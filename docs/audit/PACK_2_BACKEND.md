# UniHub Audit

# Pack 2 — Backend

Status: PASS WITH FINDINGS

Review Date: 2026-08-02

---

# Scope

- Authentication
- Firebase Layer
- Firestore Layer
- Backend Services
- API Routes
- Authorization
- Data Consistency

---

# Overall Score

| Category | Score |
|----------|------:|
| Authentication | 9.6 |
| Firestore Layer | 9.1 |
| Authorization | 8.8 |
| API Design | 9.2 |
| Service Layer | 9.4 |
| Data Consistency | 8.5 |

Overall Score

**9.1 / 10**

---

# Executive Summary

الـ Backend مبني بطريقة جيدة.

يوجد فصل واضح بين:

- Firebase Config
- Authentication
- Firestore
- Services

كما أن Hooks لا تحتوي Business Logic كبير.

المشروع قابل للتوسع بدون إعادة كتابة كاملة.

---

# Findings

---

## AUD-009

Priority

P1

Category

Data Consistency

Files

- lib/firebase/firestore.ts

Description

وجدت عمليات متعددة تعتمد على أكثر من Write متتابع.

إذا نجحت أول عملية وفشلت الثانية قد تصبح البيانات غير متناسقة.

Impact

- User Stats
- Leaderboard
- Attempts

Recommendation

مراجعة العمليات متعددة الكتابات وتحويل المناسب منها إلى Atomic Writes (`writeBatch` أو `runTransaction`) بعد التأكد من متطلبات الـ Business Logic.

Status

Open

---

## AUD-010

Priority

P2

Category

Authentication

Files

- lib/firebase/auth.ts

Description

إنشاء User Profile يتم مباشرة بعد Authentication.

```ts
const prof = await getUserProfile(uid);

if (!prof) {
    await createUserProfile(...)
}
```

هذا التصميم جيد.

ولكن لا يوجد Retry أو معالجة خاصة إذا نجح Firebase Auth وفشل إنشاء Profile.

Impact

قد ينتج مستخدم بدون Profile في حالات الفشل النادرة.

Recommendation

إضافة Recovery Strategy أو معالجة لهذه الحالة أثناء تسجيل الدخول التالي أو عبر Cloud Function.

Status

Open

---

## AUD-011

Priority

P2

Category

Authorization

Files

hooks/useAuth.ts

Description

الواجهة تعتمد على:

- profile.role

لحساب:

- isAdmin
- isSubscribed

وهذا مناسب للـ UI.

لكن يجب أن يبقى المصدر الحقيقي للصلاحيات هو:

- Firestore Rules
- Cloud Functions
- Server APIs

Status

Verified

لا توجد مشكلة حالياً.

---

## AUD-012

Priority

P3

Category

Maintainability

Files

lib/firebase/firestore.ts

Description

الملف أصبح كبيراً ويجمع Domains متعددة:

- Users
- Chapters
- Questions
- Videos
- Attempts
- Leaderboard
- Notifications

Impact

سيصبح أصعب في الصيانة مع نمو المشروع.

Recommendation

بعد MVP تقسيمه إلى ملفات Domain مستقلة.

Status

Open

---

# Strong Points

## Authentication

ممتاز.

وجود

- createUserProfile()

بعد التسجيل

قرار صحيح.

---

## Hooks

useAuth نظيف جداً.

إدارة listeners ممتازة.

يتم إلغاء جميع subscriptions بصورة صحيحة.

---

## API

API Routes الخاصة بالدفع لا تحتوي Business Logic.

هي Proxy فقط إلى Cloud Functions.

وهذا قرار معماري ممتاز.

---

## Firebase Layer

وجود

lib/firebase

بدلاً من استدعاء Firebase مباشرة داخل Components

قرار ممتاز.

---

## Service Layer

وجود

features/**/services

بدلاً من Firestore داخل الـ UI

من أفضل القرارات الموجودة بالمشروع.

---

# Technical Debt

| Priority | Item |
|----------|------|
| P1 | مراجعة العمليات متعددة الكتابات |
| P2 | Recovery Strategy لإنشاء Profile |
| P2 | مراجعة Authorization داخل Cloud Functions |
| P3 | تقسيم firestore.ts بعد MVP |

---

# Quick Wins

- إضافة Recovery لحالة فشل إنشاء Profile.
- مراجعة العمليات متعددة الكتابات.
- توثيق مسؤولية Cloud Functions عن Authorization.

---

# Decision

PASS

لا يوجد ما يمنع الانتقال إلى مراجعة المنتج.

Backend Architecture سليم.

لا أوصي بأي Refactor كبير قبل MVP.
