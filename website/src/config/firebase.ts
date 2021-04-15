import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase
  .app()
  .functions(process.env.REACT_APP_FIREBASE_FUNCTIONS_REGION);
export const messaging = firebase.messaging();
export const analytics = firebase.analytics();
export const performance = firebase.performance();

if (process.env.NODE_ENV === 'development') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', 8080);
  functions.useEmulator('localhost', 5001);
}

db.enablePersistence({ synchronizeTabs: true });

export const messages: { [key: string]: string } = {
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بحساب آخر بالفعل',
  'auth/weak-password': 'يجب أن تحتوي كلمة المرور على 6 حروف أو أكثر',
  'auth/invalid-email': 'رجاءاً أدخل بريد إلكتروني صالح',
  'auth/network-request-failed':
    'حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك',
  'auth/user-not-found': 'هذا المستخدم غير موجود',
  'auth/wrong-password': 'كلمة المرور غير صحيحة أو المستخدم لا يمتلك كلمة مرور',
  'auth/popup-closed-by-user': 'لقد قمت بإغلاق النافذة المنبثقة',
  'auth/cancelled-popup-request':
    'تم إلغاء هذه العملية بسبب فتح نافذة منبثقة أخرى متضاربة',
  'auth/user-mismatch':
    ' البريد الإلكتروني أو كلمة المرور لا تتوافق مع المستخدم',
  'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/invalid-verification-code': 'رمز التأكيد غير صحيح',
  'permission-denied': 'غير مصرح لك بالقيام بذلك'
};
