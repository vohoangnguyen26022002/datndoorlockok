// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCUlUI0ABt7rChRM0wxdtioZJZG5-twb30",
    authDomain: "datn2024-nt.firebaseapp.com",
    databaseURL: "https://datn2024-nt-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "datn2024-nt",
    storageBucket: "datn2024-nt.appspot.com",
    messagingSenderId: "1042771641356",
    appId: "1:1042771641356:web:a18523a59a4fd832fd1a29"
};

// Khởi tạo Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const realtimeDb = getDatabase(firebaseApp);
export { firebaseApp, auth, db, realtimeDb };