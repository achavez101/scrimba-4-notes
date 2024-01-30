// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu6XEptSM3rWYJTS3lVdB0jBnoVQn-jXE",
  authDomain: "react-notes-e786d.firebaseapp.com",
  projectId: "react-notes-e786d",
  storageBucket: "react-notes-e786d.appspot.com",
  messagingSenderId: "773768144459",
  appId: "1:773768144459:web:16ac220a61af31a48e8fce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
