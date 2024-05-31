const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAevf-7ohDkwF7ym_Q9WQkNzxN5W6-y1tQ",
    authDomain: "brookeplace-50233.firebaseapp.com",
    databaseURL: "https://brookeplace-50233-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "brookeplace-50233",
    storageBucket: "brookeplace-50233.appspot.com",
    messagingSenderId: "285909176465",
    appId: "1:285909176465:web:30dbe3d6ac5687c134ef30"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp); // Only if you're using Firebase Database

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle any other routes and return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 