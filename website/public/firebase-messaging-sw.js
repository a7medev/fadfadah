importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC9VQy2EtTg9QBL6vIdws3178CWM136LkE',
  projectId: 'fadfadah-app',
  messagingSenderId: '137606338',
  appId: '1:137606338:web:6b8fa2d11138278ab9f75b',
  measurementId: 'G-KFX596R655'
});

const messaging = firebase.messaging();
