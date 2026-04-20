# Firebase setup — 10 minutes, one time

This adds **Google Sign-in** and **cloud sync** to the Study Plan Generator so your
plan and checklist follow you between devices, and so you can share a plan with
another user by email.

You only do this once. All of it is **free** on the Firebase Spark plan.

---

## 1. Create a Firebase project

1. Open <https://console.firebase.google.com> and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name it something like `study-plan-generator`. Click **Continue**.
4. Google Analytics: you can **disable** it (it's not needed). Click **Continue** / **Create project**.
5. Wait ~30 seconds for the project to be created, then click **Continue**.

## 2. Register the web app

1. On the project home, click the **`</>`** (Web) icon under "Get started by adding Firebase to your app".
2. App nickname: `Study Plan Web`. **Do not** check "Also set up Firebase Hosting".
3. Click **Register app**.
4. Firebase will show you a code snippet containing a `firebaseConfig = { ... }` object.
   **Copy the object** — you'll paste it into `firebase-config.js` in step 6.
5. Click **Continue to console**.

The config object looks like this (the values are different for each project):

```js
const firebaseConfig = {
  apiKey: "AIzaSy......",
  authDomain: "study-plan-xxxxx.firebaseapp.com",
  projectId: "study-plan-xxxxx",
  storageBucket: "study-plan-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

> These values are **not secret** — they identify your project publicly. Security comes
> from the Firestore rules we deploy in step 5. It's fine to commit them to GitHub.

## 3. Enable Google Sign-in

1. In the left sidebar, click **Build → Authentication**.
2. Click **Get started**.
3. Under the **Sign-in method** tab, click **Google**.
4. Toggle **Enable**.
5. Pick your Google account as the **Project support email**.
6. Click **Save**.

### Add your site to authorized domains

1. Still in **Authentication**, click the **Settings** tab → **Authorized domains**.
2. `localhost` is already there. Click **Add domain** and add:
   - `kooitt.github.io`   ← your GitHub Pages domain
3. Click **Add**.

## 4. Create the Firestore database

1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode**. Click **Next**.
4. Pick a location. The one closest to you is best (e.g. `asia-southeast1 (Singapore)`
   for Malaysia). **This cannot be changed later**, so pick carefully. Click **Enable**.
5. Wait ~30 seconds for provisioning.

## 5. Deploy the security rules

1. In **Firestore Database**, click the **Rules** tab.
2. **Replace the entire contents** with the rules from the file `firestore.rules`
   in this repo (open it and copy everything).
3. Click **Publish**.

These rules enforce:
- Anyone can sign in, but can only read/write plans they own or were invited to.
- The invite is by email — your Google Sign-in email must be listed in `memberEmails`.

## 6. Paste your config into the app

Open `firebase-config.js` in this repo. You'll see a placeholder object.
**Replace it** with the config object you copied in step 2.

Before:
```js
export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  // ...
};
```

After (example):
```js
export const firebaseConfig = {
  apiKey: "AIzaSy......",
  authDomain: "study-plan-xxxxx.firebaseapp.com",
  projectId: "study-plan-xxxxx",
  storageBucket: "study-plan-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

Save, commit, push. GitHub Pages will redeploy in ~30 seconds, and the login UI
will appear in the top-right of the app.

---

## Using it

- Click **Sign in with Google** in the top-right.
- On first sign-in, a default plan is created for you in the cloud.
- Any change (editing subjects, ticking topics, …) is auto-synced.
- Open the site on your phone, sign in with the same Google account → everything
  is already there.

### Multiple plans

- Use the plan dropdown next to your avatar to switch between plans.
- Click **New plan** to start another one (e.g. "Mid-year exam" vs "Final exam").
- Click **Rename** or **Delete** from the plan menu.

### Sharing a plan with someone else

- Click **Share** on the plan dropdown.
- Enter the other user's Google email address, click **Add**.
- They sign in with that Google account and will immediately see the shared plan
  in their list. Either of you can edit and tick topics — changes sync in real time.
- To revoke, open **Share** again and click the × next to the email.

### Without login

- If you prefer not to sign in, the app keeps working exactly as before, with
  progress saved in your browser's localStorage. You can still use Export/Import
  JSON to move plans between devices manually.

---

## Free tier — is it enough?

Yes, by a huge margin. The Firebase Spark plan gives each project:

- 1 GiB Firestore storage (a plan is ~5 KB → ~200,000 plans fit)
- 50,000 document reads/day, 20,000 writes/day (plenty for a family)
- Unlimited Google Sign-ins

You will never hit these limits for a study planner.

## Troubleshooting

- **"This domain is not authorized"** when clicking Sign In → you missed step 3
  "Add your site to authorized domains". Add `kooitt.github.io` and try again.
- **"Missing or insufficient permissions"** toast → the Firestore rules from step 5
  weren't published. Go to Firestore → Rules, paste them in, click Publish.
- **Login popup is blocked** → browser blocked popups; click the popup-blocked icon
  in the address bar and allow popups for this site.
- **Nothing happens on sign-in button** → `firebase-config.js` still has the
  placeholder `REPLACE_ME` value. Paste your real config and redeploy.
