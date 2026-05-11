// ─────────────────────────────────────────────────────────────────────
//  FADEFINDER — Firebase Configuration
//
//  HOW TO SET UP (free):
//  1. Go to https://console.firebase.google.com/
//  2. Click "Add project" → name it "fadefinder" → continue
//  3. In the project, click "Firestore Database" → Create database
//     → Start in TEST MODE → choose a region → Done
//  4. Click "Authentication" → Get started → Anonymous → Enable → Save
//  5. Go to Project Settings (gear icon) → scroll to "Your apps"
//  6. Click the </> icon to add a Web app → register it
//  7. Copy the firebaseConfig values below into the matching fields
//  8. Push to GitHub and enable GitHub Pages
//
//  That's it — Firestore free tier = 50k reads + 20k writes/day.
// ─────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Firestore Security Rules ─────────────────────────────────────────
//  Paste these into Firebase Console → Firestore → Rules:
//
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      match /fades/{fadeId} {
//        allow read: if true;
//        allow create: if request.auth != null;
//        allow update: if request.auth != null
//          && resource.data.status != 'expired';
//        allow delete: if request.auth != null
//          && request.auth.uid == resource.data.creatorId;
//      }
//    }
//  }
// ─────────────────────────────────────────────────────────────────────
