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
  apiKey: "AIzaSyAgbniAjntaEtXRA5JhYMZ_kbheGIuBZP0",
  authDomain: "study-plan-generator-90f50.firebaseapp.com",
  projectId: "study-plan-generator-90f50",
  storageBucket: "study-plan-generator-90f50.firebasestorage.app",
  messagingSenderId: "1086420602145",
  appId: "1:1086420602145:web:6f156b4093ee5c7b178260",
};

export const isConfigured = !Object.values(firebaseConfig).some((v) =>
  typeof v === "string" && v.includes("REPLACE_ME")
);
