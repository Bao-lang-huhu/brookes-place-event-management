// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAevf-7ohDkwF7ym_Q9WQkNzxN5W6-y1tQ",
    authDomain: "brookeplace-50233.firebaseapp.com",
    databaseURL: "https://brookeplace-50233-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "brookeplace-50233",
    storageBucket: "brookeplace-50233.appspot.com",
    messagingSenderId: "285909176465",
    appId: "1:285909176465:web:30dbe3d6ac5687c134ef30"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
