import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyB9QiKhNpNd0-FXrxSlYShusU_95quET8I',
  authDomain: 'fad-fadah.firebaseapp.com',
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

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();

export const messages = {
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بحساب آخر بالفعل',
  'auth/weak-password': 'يجب أن تحتوي كلمة المرور على 6 حروف أو أكثر',
  'auth/invalid-email': 'رجاءاً أدخل بريد إلكتروني صالح',
  'auth/network-request-failed': 'حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك'
}
