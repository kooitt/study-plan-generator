// Cloud sync module.
//
// Exposes `window.cloudSync` which the main app talks to. If Firebase isn't
// configured, it exports a stub with `enabled: false` and the app falls back
// to localStorage-only behaviour.
//
// API surface (when enabled):
//   cloudSync.enabled                  -> boolean
//   cloudSync.signInGoogle()           -> Promise<user>
//   cloudSync.signOut()                -> Promise<void>
//   cloudSync.currentUser()            -> firebase user or null
//   cloudSync.currentPlanId()          -> string or null
//   cloudSync.plans()                  -> list of plan metadata (cached)
//   cloudSync.setActivePlan(planId)    -> void
//   cloudSync.createPlan(name, state, done) -> Promise<planId>
//   cloudSync.renamePlan(planId, name) -> Promise<void>
//   cloudSync.deletePlan(planId)       -> Promise<void>
//   cloudSync.savePlan(state, done)    -> Promise<void>    (writes active plan)
//   cloudSync.sharePlan(planId, email) -> Promise<void>
//   cloudSync.unsharePlan(planId, email)-> Promise<void>
//   cloudSync.on(event, fn)            -> () => {}   returns an unsubscribe
// Events: 'authChange' (user), 'plansChange' (plans[]), 'planChange' (plan),
//         'error' (Error)

import { firebaseConfig, isConfigured } from "./firebase-config.js";

if (!isConfigured) {
  console.info("[cloud-sync] firebase-config.js still has REPLACE_ME placeholders — running in offline/local mode.");
  window.cloudSync = { enabled: false };
  window.dispatchEvent(new CustomEvent("cloudsync-ready"));
} else try {
  console.info("[cloud-sync] Loading Firebase SDK…", firebaseConfig.projectId);
  const FB = "https://www.gstatic.com/firebasejs/10.12.0";
  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import(`${FB}/firebase-app.js`),
    import(`${FB}/firebase-auth.js`),
    import(`${FB}/firebase-firestore.js`),
  ]);
  const {
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  } = authMod;
  const {
    getFirestore, doc, collection, addDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, serverTimestamp, arrayUnion, arrayRemove,
    setDoc, enableIndexedDbPersistence, initializeFirestore,
    persistentLocalCache, persistentMultipleTabManager,
  } = fsMod;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Offline persistence.
  let db;
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (e) {
    db = getFirestore(app);
  }

  const listeners = { authChange: [], plansChange: [], planChange: [], error: [] };
  function emit(name, ...args) {
    (listeners[name] || []).forEach((f) => {
      try { f(...args); } catch (e) { console.error(e); }
    });
  }
  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = listeners[event].filter((x) => x !== fn);
    };
  }

  let currentUser = null;
  let activePlanId = null;
  let plansCache = [];
  let activePlanUnsub = null;
  let plansListUnsub = null;

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    emit("authChange", user);
    stopPlanListener();
    stopPlansListListener();
    activePlanId = null;
    plansCache = [];
    if (user) {
      startPlansListListener();
    } else {
      emit("plansChange", []);
      emit("planChange", null);
    }
  });

  function startPlansListListener() {
    const email = (currentUser.email || "").toLowerCase();
    if (!email) return;
    const q = query(
      collection(db, "plans"),
      where("memberEmails", "array-contains", email)
    );
    plansListUnsub = onSnapshot(
      q,
      (snap) => {
        plansCache = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const at = (a.updatedAt && a.updatedAt.toMillis && a.updatedAt.toMillis()) || 0;
            const bt = (b.updatedAt && b.updatedAt.toMillis && b.updatedAt.toMillis()) || 0;
            return bt - at;
          });
        emit("plansChange", plansCache);
        if (!activePlanId && plansCache.length > 0) {
          setActivePlan(plansCache[0].id);
        } else if (activePlanId && !plansCache.some((p) => p.id === activePlanId)) {
          // Active plan was deleted / unshared.
          activePlanId = null;
          stopPlanListener();
          if (plansCache.length > 0) setActivePlan(plansCache[0].id);
          else emit("planChange", null);
        }
      },
      (err) => emit("error", err)
    );
  }
  function stopPlansListListener() {
    if (plansListUnsub) { plansListUnsub(); plansListUnsub = null; }
  }
  function stopPlanListener() {
    if (activePlanUnsub) { activePlanUnsub(); activePlanUnsub = null; }
  }

  function setActivePlan(planId) {
    if (planId === activePlanId) return;
    stopPlanListener();
    activePlanId = planId;
    if (!planId) { emit("planChange", null); return; }
    activePlanUnsub = onSnapshot(
      doc(db, "plans", planId),
      (snap) => {
        if (!snap.exists()) {
          emit("planChange", null);
          return;
        }
        emit("planChange", { id: snap.id, ...snap.data() });
      },
      (err) => emit("error", err)
    );
  }

  async function createPlan(name, state, done) {
    if (!currentUser) throw new Error("Not signed in");
    const email = currentUser.email.toLowerCase();
    const ref = await addDoc(collection(db, "plans"), {
      ownerUid: currentUser.uid,
      ownerEmail: email,
      name: (name || "Untitled plan").slice(0, 120),
      memberEmails: [email],
      state: state || {},
      done: done || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setActivePlan(ref.id);
    return ref.id;
  }

  async function renamePlan(planId, name) {
    await updateDoc(doc(db, "plans", planId), {
      name: (name || "Untitled plan").slice(0, 120),
      updatedAt: serverTimestamp(),
    });
  }

  async function deletePlan(planId) {
    await deleteDoc(doc(db, "plans", planId));
  }

  async function savePlan(state, done) {
    if (!currentUser || !activePlanId) return;
    await updateDoc(doc(db, "plans", activePlanId), {
      state: state || {},
      done: done || {},
      updatedAt: serverTimestamp(),
    });
  }

  async function sharePlan(planId, email) {
    const e = String(email || "").trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      throw new Error("Not a valid email");
    }
    await updateDoc(doc(db, "plans", planId), {
      memberEmails: arrayUnion(e),
      updatedAt: serverTimestamp(),
    });
  }

  async function unsharePlan(planId, email) {
    await updateDoc(doc(db, "plans", planId), {
      memberEmails: arrayRemove(String(email || "").toLowerCase()),
      updatedAt: serverTimestamp(),
    });
  }

  async function signInGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      console.info("[cloud-sync] Opening Google sign-in popup…");
      return await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn("[cloud-sync] Popup sign-in failed:", err && err.code, err && err.message);
      // Fall back to full-page redirect if popups are blocked or unsupported.
      if (
        err && (err.code === "auth/popup-blocked" ||
                err.code === "auth/popup-closed-by-user" ||
                err.code === "auth/cancelled-popup-request" ||
                err.code === "auth/operation-not-supported-in-this-environment")
      ) {
        const { signInWithRedirect } = authMod;
        console.info("[cloud-sync] Falling back to redirect sign-in");
        return signInWithRedirect(auth, provider);
      }
      throw err;
    }
  }

  window.cloudSync = {
    enabled: true,
    signInGoogle,
    signOut: () => signOut(auth),
    currentUser: () => currentUser,
    currentPlanId: () => activePlanId,
    plans: () => plansCache.slice(),
    setActivePlan,
    createPlan,
    renamePlan,
    deletePlan,
    savePlan,
    sharePlan,
    unsharePlan,
    on,
  };
  console.info("[cloud-sync] Firebase ready. Project:", firebaseConfig.projectId);
  window.dispatchEvent(new CustomEvent("cloudsync-ready"));
} catch (err) {
  console.error("[cloud-sync] Failed to initialise Firebase:", err);
  window.cloudSync = { enabled: false, initError: err };
  window.dispatchEvent(new CustomEvent("cloudsync-ready"));
}
