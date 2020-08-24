import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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
firebase.analytics();
firebase.performance();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const messaging = firebase.messaging();

db.enablePersistence({ synchronizeTabs: true });

export const messages = {
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بحساب آخر بالفعل',
  'auth/weak-password': 'يجب أن تحتوي كلمة المرور على 6 حروف أو أكثر',
  'auth/invalid-email': 'رجاءاً أدخل بريد إلكتروني صالح',
  'auth/network-request-failed': 'حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك',
  'auth/user-not-found': 'هذا المستخدم غير موجود',
  'auth/wrong-password': 'كلمة المرور التي أدخلتها خاطئة',
  'auth/popup-closed-by-user': 'لقد قمت بإغلاق النافذة المنبثقة',
  'auth/cancelled-popup-request': 'تم إلغاء هذه العملية بسبب فتح نافذة منبثقة أخرى متضاربة',
  'permission-denied': 'غير مصرح لك بالقيام بذلك'
}

// @ts-ignore
window.db = db;
