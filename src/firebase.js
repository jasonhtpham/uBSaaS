import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();
