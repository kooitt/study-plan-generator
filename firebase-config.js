// Firebase client config.
//
// These values are NOT secret — they identify your Firebase project publicly
// and are meant to ship to the browser. Security is enforced by the Firestore
// rules in `firestore.rules`, not by hiding this file.
//
// HOW TO FILL THIS IN:
//   1. Follow FIREBASE_SETUP.md.
//   2. In the Firebase Console, register a Web app and copy the `firebaseConfig`
//      object it gives you.
//   3. Replace the placeholder object below with yours.
//   4. Commit and push. Done.
//
// Until you replace the placeholders, the app works exactly as before (no
// cloud sync, progress saved in your browser's localStorage only).

export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

export const isConfigured = !Object.values(firebaseConfig).some((v) =>
  typeof v === "string" && v.includes("REPLACE_ME")
);
