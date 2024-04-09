console.log("Hello world! (from index.js)");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  collection, 
  addDoc,
  orderBy,
  query, 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbgm-9ZvZn6BPyQkt5p-o-GLiR1vJoGXw",
    authDomain: "oslomet-quiz.firebaseapp.com",
    projectId: "oslomet-quiz",
    storageBucket: "oslomet-quiz.appspot.com",
    messagingSenderId: "604545436437",
    appId: "1:604545436437:web:d7240b1af644a6aafef71c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function getIdEn() {
    const docID1 = await getDoc(doc(db, 'os', '1'));
    console.log("Id 1: " + docID1.data().navn);
}
// getIdEn();
