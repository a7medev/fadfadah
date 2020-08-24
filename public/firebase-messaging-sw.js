importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB9QiKhNpNd0-FXrxSlYShusU_95quET8I',
  projectId: 'fad-fadah',
  messagingSenderId: '514590012549',
  appId: '1:514590012549:web:d679963f9c71faebba65ec',
  measurementId: 'G-L6L6JWXE14'
});

const messaging = firebase.messaging();
