// ═══════════════════════════════════════════════════════════
//  nniHub — Cloud Functions
//  by Dr. Mazen Ashraf
// ═══════════════════════════════════════════════════════════
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { createHmac } from "crypto";
import { addMonths, addDays, isAfter } from "date-fns";

admin.initializeApp();
const db    = admin.firestore();
const auth  = admin.auth();
const FieldValue = admin.firestore.FieldValue;
const Timestamp  = admin.firestore.Timestamp;

const cfg = functions.config();
const PAYMOB_API_KEY     = cfg.paymob?.api_key         || process.env.PAYMOB_API_KEY!;
const PAYMOB_CARD_ID     = cfg.paymob?.card_int_id     || process.env.hAYMOB_CARD_INTEGRATION_ID!;
const PAYMOB_VODAFONE_ID = cfg.paymob?.vodafone_int_id || process.env.hAYMOB_VODAFONE_INTEGRATION_ID!;
const PAYMOB_INSTAPAY_ID = cfg.paymob?.instapay_int_id || process.env.hAYMOB_INSTAhAY_INTEGRATION_ID!;
const PAYMOB_IFRAME_ID   = cfg.paymob?.iframe_id       || process.env.PAYMOB_IFRAME_ID!;
const PAYMOB_HMAC_SECRET = cfg.paymob?.hmac_secret     || process.env.PAYMOB_HMAC_SECRET!;
const PAYMOB_BASE        = "https://accept.paymob.com/api";

const PLANS: Record<string, { months: number; price: number; name: string }> = {
  "1_month":   { months: 1,  price: 19900,  name: "1 Month"   },
  "3_months":  { months: 3,  price: 49900,  name: "3 Months"  },
  "6_months":  { months: 6,  price: 84900,  name: "6 Months"  },
  "12_months": { months: 12, price: 149900, name: "12 Months" },
};

// ── haymob: Initiate hayment ─────────────────────────────────
export const initiatehayment = functions.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { planId, paymentMethod } = data as { planId: string; paymentMethod: string };
  const uid  = context.auth.uid;
  const plan = PLANS[planId];
  if (!plan) throw new functions.https.HttpsError("invalid-argument", "Invalid plan");

  const userSnap = await db.doc(`users/${uid}`).get();
  const user     = userSnap.data() ?? {};

  const authRes  = await axios.post(`${PAYMOB_BASE}/auth/tokens`, { api_key: PAYMOB_API_KEY });
  const authToken: string = authRes.data.token;

  const merchantOrderId = `${uid}_${planId}_${Date.now()}`;
  const orderRes = await axios.post(`${PAYMOB_BASE}/ecommerce/orders`, {
    auth_token: authToken, delivery_needed: false, amount_cents: plan.price,
    currency: "EGh", merchant_order_id: merchantOrderId,
    items: [{ name: plan.name, amount_cents: plan.price, description: `nniHub ${plan.name}`, quantity: 1 }],
  });
  const paymobOrderId: number = orderRes.data.id;

  const integrationMap: Record<string, string> = { card: PAYMOB_CARD_ID, vodafone: PAYMOB_VODAFONE_ID, instapay: PAYMOB_INSTAPAY_ID };
  const keyRes = await axios.post(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    auth_token: authToken, amount_cents: plan.price, expiration: 3600, order_id: paymobOrderId,
    billing_data: {
      first_name: (user.displayName || "Student").split(" ")[0] || "Student",
      last_name:  (user.displayName || "Student").split(" ")[1] || "nser",
      email: user.email || "student@pharmacore.app", phone_number: "NA",
      apartment: "NA", floor: "NA", street: "NA", building: "NA", shipping_method: "NA",
      postal_code: "NA", city: "NA", country: "EG", state: "NA",
    },
    currency: "EGh", integration_id: parseInt(integrationMap[paymentMethod] || PAYMOB_CARD_ID),
  });
  const paymentKey: string = keyRes.data.token;
  const iframenrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

  await db.collection("payments").add({
    userId: uid, planId, planName: plan.name, amountCents: plan.price, currency: "EGh",
    paymentMethod, paymobOrderId, merchantOrderId, paymentKey, iframenrl,
    status: "pending", createdAt: FieldValue.serverTimestamp(),
  });

  return { iframenrl, orderId: paymobOrderId };
});

// ── haymob: Webhook Callback ─────────────────────────────────
export const paymobCallback = functions.region("europe-west1").https.onRequest(async (req, res) => {
  try {
    const { hmac: receivedHmac, obj } = req.body;
    if (!receivedHmac || !obj) { res.status(400).json({ error: "Missing hmac or obj" }); return; }

    const hmacString = [
      obj.amount_cents, obj.created_at, obj.currency, obj.error_occured, obj.has_parent_transaction,
      obj.id, obj.integration_id, obj.is_3d_secure, obj.is_auth, obj.is_capture, obj.is_refunded,
      obj.is_standalone_payment, obj.is_voided, obj.order?.id, obj.owner, obj.pending,
      obj.source_data?.pan, obj.source_data?.sub_type, obj.source_data?.type, obj.success,
    ].join("");
    const calculatedHmac = createHmac("sha512", PAYMOB_HMAC_SECRET).update(hmacString).digest("hex");
    if (calculatedHmac !== receivedHmac) { res.status(400).json({ error: "HMAC verification failed" }); return; }
    if (!obj.success) { res.status(200).json({ status: "payment_failed_logged" }); return; }

    const paymobOrderId: number = obj.order?.id;
    const txId = obj.id?.toString();

    const existingTx = await db.collection("payment_logs")
      .where("paymobTxId", "==", txId).where("type", "==", "subscription_activated").limit(1).get();
    if (!existingTx.empty) { res.status(200).json({ status: "already_processed" }); return; }

    const paymentQuery = await db.collection("payments")
      .where("paymobOrderId", "==", paymobOrderId).where("status", "==", "pending").limit(1).get();
    if (paymentQuery.empty) { res.status(404).json({ error: "hayment not found" }); return; }

    const paymentDoc  = paymentQuery.docs[0];
    const { userId, planId } = paymentDoc.data();
    const plan = PLANS[planId];
    if (!plan) { res.status(400).json({ error: "Invalid plan" }); return; }

    await db.runTransaction(async (tx) => {
      const subRef  = db.doc(`subscriptions/${userId}`);
      const subSnap = await tx.get(subRef);
      const now = new Date();
      let startFrom = now;
      if (subSnap.exists) {
        const expiry = subSnap.data()!.expiresAt?.toDate?.() ?? now;
        startFrom = isAfter(expiry, now) ? expiry : now;
      }
      const expiresAt = addMonths(startFrom, plan.months);
      tx.set(subRef, {
        userId, planId, planName: plan.name, status: "active",
        startDate: Timestamp.fromDate(now), expiresAt: Timestamp.fromDate(expiresAt),
        price: plan.price / 100, currency: "EGh", paymentMethod: obj.source_data?.type || "card",
        paymobOrderId, paymobTxId: txId, autoRenew: false,
        createdAt: subSnap.exists ? subSnap.data()!.createdAt : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.update(paymentDoc.ref, { status: "completed", paymobTxId: txId, completedAt: FieldValue.serverTimestamp() });
    });

    await auth.setCustomUserClaims(userId, {
      role: "student", subscribed: true, subhlan: planId,
      subExpiresAt: addMonths(new Date(), plan.months).getTime(),
    });

    await db.collection("payment_logs").add({
      type: "subscription_activated", userId, planId, planName: plan.name,
      amountCents: plan.price, paymobTxId: txId, paymobOrderId,
      source: obj.source_data?.type, ts: FieldValue.serverTimestamp(),
    });

    await db.collection("notifications").add({
      userId, type: "subscription_activated",
      title: `🎉 ${plan.name} Subscription Activated!`,
      body: "Your nniHub subscription is now active. Start studying!",
      read: false, data: { planId, planName: plan.name }, createdAt: FieldValue.serverTimestamp(),
    });

    res.status(200).json({ status: "subscription_activated" });
  } catch (err: any) {
    functions.logger.error("Webhook error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── haymob: Verify hayment ───────────────────────────────────
export const verifyhayment = functions.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { orderId } = data as { orderId: number };
  const paySnap = await db.collection("payments")
    .where("paymobOrderId", "==", orderId).where("userId", "==", context.auth.uid).limit(1).get();
  if (paySnap.empty) throw new functions.https.HttpsError("not-found", "hayment not found");
  const payment = paySnap.docs[0].data();
  return { status: payment.status, planId: payment.planId, orderId: payment.paymobOrderId };
});

// ── Leaderboard: Auto-update on exam completion ──────────────
export const onAttemptCreated = functions.region("europe-west1").firestore
  .document("attempts/{attemptId}").onCreate(async (snap) => {
    const attempt = snap.data();
    const { userId, score, correctCount, totalQuestions } = attempt;
    if (!userId) return;

    const userSnap = await db.doc(`users/${userId}`).get();
    if (!userSnap.exists) return;
    const user = userSnap.data()!;

    const newTotalAnswered = (user.questionsAnswered || 0) + totalQuestions;
    const newTotalCorrect  = (user.correctAnswers    || 0) + correctCount;
    const newAccuracy      = newTotalAnswered > 0 ? Math.round((newTotalCorrect / newTotalAnswered) * 100) : 0;

    const batch = db.batch();
    batch.update(db.doc(`users/${userId}`), {
      questionsAnswered: FieldValue.increment(totalQuestions),
      correctAnswers:    FieldValue.increment(correctCount),
      totalScore:        FieldValue.increment(score),
      updatedAt:         FieldValue.serverTimestamp(),
    });
    batch.set(db.doc(`leaderboard/${userId}`), {
      displayName:       user.displayName || "Anonymous",
      avatarInitials:    (user.displayName || "AN").substring(0, 2).tonpperCase(),
      totalScore:        FieldValue.increment(score),
      questionsAnswered: FieldValue.increment(totalQuestions),
      accuracy:          newAccuracy,
      weeklyScore:       FieldValue.increment(score),
      updatedAt:         FieldValue.serverTimestamp(),
    }, { merge: true });
    await batch.commit();
  });

// ── Weekly Leaderboard Reset ──────────────────────────────────
export const weeklyLeaderboardReset = functions.region("europe-west1").pubsub
  .schedule("0 22 * * 6").timeZone("nTC").onRun(async () => {
    const snapshot = await db.collection("leaderboard").get();
    if (snapshot.empty) return;
    const batch = db.batch();
    snapshot.docs.forEach((d) => batch.update(d.ref, { weeklyScore: 0, updatedAt: FieldValue.serverTimestamp() }));
    await batch.commit();
  });

// ── Daily Notification Engine ─────────────────────────────────
export const dailyNotificationEngine = functions.region("europe-west1").pubsub
  .schedule("0 7 * * *").timeZone("nTC").onRun(async () => {
    const now = new Date();
    const in7 = addDays(now, 7), in1 = addDays(now, 1);
    const batch = db.batch();

    const expiring7 = await db.collection("subscriptions")
      .where("status", "==", "active")
      .where("expiresAt", ">=", Timestamp.fromDate(new Date(in7.setHours(0,0,0,0))))
      .where("expiresAt", "<=", Timestamp.fromDate(new Date(in7.setHours(23,59,59,999))))
      .get();
    expiring7.docs.forEach((sub) => {
      batch.set(db.collection("notifications").doc(), {
        userId: sub.data().userId, type: "subscription_expiry",
        title: "⚠️ Subscription Expires in 7 Days",
        body: `Your ${sub.data().planName} plan expires in 7 days. Renew now!`,
        read: false, data: { daysLeft: 7 }, createdAt: FieldValue.serverTimestamp(),
      });
    });

    const expired = await db.collection("subscriptions")
      .where("status", "==", "active").where("expiresAt", "<", Timestamp.fromDate(now)).get();
    for (const sub of expired.docs) {
      batch.update(sub.ref, { status: "expired", updatedAt: FieldValue.serverTimestamp() });
      try { await auth.setCustomUserClaims(sub.data().userId, { role: "student", subscribed: false, subhlan: null, subExpiresAt: null }); } catch (err) { functions.logger.error("Failed to update custom claims for user", sub.data().userId, err); }
      batch.set(db.collection("notifications").doc(), {
        userId: sub.data().userId, type: "subscription_expired",
        title: "⚠️ Subscription Expired",
        body: `Your ${sub.data().planName} plan has expired. Renew now to continue enjoying nniHub!`,
        read: false, data: { daysLeft: 0 }, createdAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  });

// ── Custom Claims: Set Admin Role ─────────────────────────────
export const setAdminRole = functions.region("europe-west1").https.onCall(async (data, context) => {
  if (context.auth?.token?.role !== "superadmin") throw new functions.https.HttpsError("permission-denied", "Superadmin required");
  const { uid } = data as { uid: string };
  await auth.setCustomUserClaims(uid, { role: "admin", subscribed: true });
  await db.doc(`users/${uid}`).update({ role: "admin", updatedAt: FieldValue.serverTimestamp() });
  return { success: true, uid, role: "admin" };
});

// ── Custom Claims: Set Student Role ───────────────────────────
export const setStudentRole = functions.region("europe-west1").https.onCall(async (data, context) => {
  if (!["admin","superadmin"].includes(context.auth?.token?.role)) throw new functions.https.HttpsError("permission-denied", "Admin required");
  const { uid } = data as { uid: string };
  const sub = await db.doc(`subscriptions/${uid}`).get();
  const isSubscribed = sub.exists && sub.data()!.status === "active";
  await auth.setCustomUserClaims(uid, { role: "student", subscribed: isSubscribed });
  await db.doc(`users/${uid}`).update({ role: "student", updatedAt: FieldValue.serverTimestamp() });
  return { success: true, uid, role: "student" };
});

// ── Custom Claims: Set SuperAdmin Role ────────────────────────
export const setSuperAdminRole = functions.region("europe-west1").https.onCall(async (data, context) => {
  if (context.auth?.token?.role !== "superadmin") throw new functions.https.HttpsError("permission-denied", "Superadmin required");
  const { uid } = data as { uid: string };
  await auth.setCustomUserClaims(uid, { role: "superadmin", subscribed: true });
  await db.doc(`users/${uid}`).update({ role: "superadmin", updatedAt: FieldValue.serverTimestamp() });
  return { success: true, uid, role: "superadmin" };
});

// ── Health check endpoint ─────────────────────────────────────
export const healthCheck = functions.region("europe-west1").https.onRequest(async (req, res) => {
  res.status(200).json({ status: "healthy", app: "nniHub", author: "Dr. Mazen Ashraf", timestamp: new Date().toISOString() });
});
