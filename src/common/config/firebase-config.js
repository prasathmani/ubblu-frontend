import firebase from 'firebase/app';
import '@firebase/messaging';

/*Initialize Firebase*/
const FCMConfig = {
  apiKey: 'AIzaSyCSz9esx0A7zSmWdnwUkSZZjGKZA24ALxQ',
  authDomain: 'ubblu-3283a.firebaseapp.com',
  databaseURL: 'https://ubblu-3283a.firebaseio.com',
  projectId: 'ubblu-3283a',
  storageBucket: '',
  messagingSenderId: '314151965424',
  appId: '1:314151965424:web:8debd9df333471eb',
};

/*if (!firebase.apps.length) {
  firebase.initializeApp(FCMConfig);
}*/

!firebase.apps.length ? firebase.initializeApp(FCMConfig) : firebase.app();

let FCMMessaging;

/*we need to check if messaging is supported by the browser*/
if (firebase.messaging.isSupported()) {
  FCMMessaging = firebase.messaging();
  console.log('------------------------supported',firebase.messaging.isSupported());
}else{
  console.log('------------------------not supported',firebase.messaging.isSupported());
}

export { FCMMessaging };
