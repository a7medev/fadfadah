import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyD4ptnavJGtdReyPnI3BxKSbXigpZp_XOY',
  authDomain: 'saraha-eg.firebaseapp.com',
  databaseURL: 'https://saraha-eg.firebaseio.com',
  projectId: 'saraha-eg',
  storageBucket: 'saraha-eg.appspot.com',
  messagingSenderId: '827351082931',
  appId: '1:827351082931:web:e93a4af347b4e91ffbcdc6',
  measurementId: 'G-FRSF6QTS61'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
