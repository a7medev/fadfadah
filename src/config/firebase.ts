import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/performance';

const firebaseConfig = {
  apiKey: 'AIzaSyB9QiKhNpNd0-FXrxSlYShusU_95quET8I',
  authDomain: 'fadfadah.me',
  databaseURL: 'https://fad-fadah.firebaseio.com',
  projectId: 'fad-fadah',
  storageBucket: 'fad-fadah.appspot.com',
  messagingSenderId: '514590012549',
  appId: '1:514590012549:web:d679963f9c71faebba65ec',
  measurementId: 'G-L6L6JWXE14'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const messaging = firebase.messaging();
export const analytics = firebase.analytics();
export const performance = firebase.performance();

// if (window.location.hostname === 'localhost') {
//   db.settings({
//     host: 'localhost:8080',
//     ssl: false
//   });
//   firebase.functions().useFunctionsEmulator('http://localhost:5001');
// }

db.enablePersistence({ synchronizeTabs: true });

export const messages = {
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بحساب آخر بالفعل',
  'auth/weak-password': 'يجب أن تحتوي كلمة المرور على 6 حروف أو أكثر',
  'auth/invalid-email': 'رجاءاً أدخل بريد إلكتروني صالح',
  'auth/network-request-failed':
    'حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك',
  'auth/user-not-found': 'هذا المستخدم غير موجود',
  'auth/wrong-password': 'كلمة المرور غير صحيحة',
  'auth/popup-closed-by-user': 'لقد قمت بإغلاق النافذة المنبثقة',
  'auth/cancelled-popup-request':
    'تم إلغاء هذه العملية بسبب فتح نافذة منبثقة أخرى متضاربة',
  'auth/user-mismatch':
    ' البريد الإلكتروني أو كلمة المرور لا تتوافق مع المستخدم',
  'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/invalid-verification-code': 'رمز التأكيد غير صحيح',
  'permission-denied': 'غير مصرح لك بالقيام بذلك'
};
