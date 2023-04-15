import * as dotenv from "dotenv";

dotenv.config();

export default {
  firebaseConfig: {
    apiKey: process.firebase_env.API_KEY,
    authDomain: process.firebase_env.AUTH_DOMAIN,
    projectId: process.firebase_env.PROJECT_ID,
    storageBucket: process.firebase_env.STORAGE_BUCKET,
    messagingSenderId: process.firebase_env.MESSAGING_SENDER_ID,
    appId: process.firebase_env.APP_ID,
    measurementId: process.firebase_env.MEASUREMENT_ID,
  },
};
