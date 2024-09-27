// src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Correct import

const firebaseConfig = {
  apiKey: "q",
  authDomain: "ogres-beads-workshop.firebaseapp.com",
  databaseURL: "https://ogres-beads-workshop-default-rtdb.firebaseio.com",
  projectId: "ogres-beads-workshop",
  storageBucket: "ogres-beads-workshop.appspot.com",
  messagingSenderId: "433330029208",
  appId: "1:433330029208:web:94e623b74be269567b46ed",
  measurementId: "G-RE38NCD3DH"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Correct initialization

export { db, storage, auth, collection, addDoc, ref, uploadBytes, getDownloadURL, signInWithEmailAndPassword }; // Export auth
