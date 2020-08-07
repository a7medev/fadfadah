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
