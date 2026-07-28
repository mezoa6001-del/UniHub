# 💊 UniHub

**Learn. Practice. Excel.**

A complete pharmaceutical education platform — question bank, spaced-repetition flashcards, video lectures, analytics, leaderboards, and subscriptions — built on Next.js 15 and Firebase.

Created by **Dr. Mazen Ashraf**.

---

## ✨ Features

- 🔐 **Authentication** — Email/password + Google sign-in via Firebase Auth
- 📝 **Question Bank** — Custom exam builder, timed mode, chapter filters, bookmarks, wrong-answer review
- ⚡ **Flashcards** — SM-2 spaced repetition algorithm
- 🎥 **Video Lectures** — Resume playback, progress tracking, multi-provider support (Firebase Storage / Bunny CDN / Vimeo)
- 📊 **Analytics** — Per-chapter accuracy, weekly activity charts, score trends
- 🏆 **Leaderboard** — Real-time rankings with weekly reset
- 💳 **Subscriptions** — Paymob payment integration (Card / Vodafone Cash / InstaPay)
- 🛡️ **Admin Dashboard** — Full CRUD for questions, chapters, flashcards, videos, and users
- 🔒 **Custom Claims Security** — Role-based access (student/admin/superadmin) enforced via Firestore Rules using JWT claims
- 📱 **PWA Ready** — Offline support, installable, service worker caching

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Backend | Firebase (Auth, Firestore, Storage, Cloud Functions) |
| Payments | Paymob (Egypt) |
| Hosting | Vercel (frontend) + Firebase (functions/data) |

---

## 📁 Project Structure

```
unihub/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, register, password reset
│   ├── (dashboard)/        # Student-facing pages
│   ├── admin/               # Admin CRUD dashboard
│   └── api/                # API routes (payment proxy, health)
├── components/             # Reusable UI + layout components
├── lib/                    # Firebase config, Firestore CRUD, utils
├── hooks/                  # useAuth, useDebounce, useToast, etc.
├── store/                  # Zustand exam session store
├── types/                  # All TypeScript interfaces
├── functions/              # Firebase Cloud Functions (Node/TS)
├── public/                 # Static assets, PWA manifest, service worker
├── firestore.rules         # Firestore security rules (custom claims)
├── storage.rules           # Firebase Storage security rules
├── firestore.indexes.json  # Composite indexes
└── firebase.json           # Firebase project config
```

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> unihub
cd unihub
npm install
```

### 2. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Create a **Firestore Database** (start in production mode)
4. Enable **Storage**
5. Copy your Firebase config values

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Firebase, Paymob, and other credentials in `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy Firestore rules and indexes

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project, alias it "default"
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 6. Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase functions:config:set \
  paymob.api_key="YOUR_KEY" \
  paymob.card_int_id="YOUR_ID" \
  paymob.vodafone_int_id="YOUR_ID" \
  paymob.instapay_int_id="YOUR_ID" \
  paymob.iframe_id="YOUR_ID" \
  paymob.hmac_secret="YOUR_SECRET"
firebase deploy --only functions
```

### 7. Bootstrap your first superadmin

Run once, from a trusted server environment (never client-side):

```js
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("./serviceAccount.json")) });

await admin.auth().setCustomUserClaims("YOUR_UID", {
  role: "superadmin",
  subscribed: true,
});
```

### 8. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables from `.env.example` in the Vercel dashboard.

### 9. Configure Paymob webhook

In your Paymob dashboard, set the notification URL to:

```
https://{region}-{project-id}.cloudfunctions.net/paymobCallback
```

---

## 🔒 Security Model

- **Custom Claims**: Roles (`student` / `admin` / `superadmin`) and subscription status live in the Firebase Auth JWT, not just Firestore documents — Firestore rules read `request.auth.token.role` for fast, read-free authorization checks.
- **No client-side subscription writes**: The `subscriptions` collection can only be written by Cloud Functions (via Admin SDK), preventing students from granting themselves free access.
- **Immutable audit trail**: Exam attempts and wrong-question records cannot be deleted or edited by students once created.
- **Idempotent payments**: The Paymob webhook checks for duplicate transaction IDs before activating a subscription, and verifies the HMAC signature on every request.

See `firestore.rules` and `storage.rules` for the full rule set.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run functions:build` | Build Cloud Functions |
| `npm run functions:serve` | Run Functions emulator |
| `npm run deploy:rules` | Deploy Firestore rules, indexes, Storage rules |
| `npm run deploy:all` | Deploy everything to Firebase |

---

## 📄 License

Proprietary — © Dr. Mazen Ashraf. All rights reserved.

---

## 🙏 Credits

Built with Next.js, React, Firebase, and Tailwind CSS.
Platform design and architecture by **Dr. Mazen Ashraf**.
