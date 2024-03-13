// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr1tpGzY6DfmbPtlaARoVTyTY0YjkRasU",
  authDomain: "md-cv-master.firebaseapp.com",
  projectId: "md-cv-master",
  storageBucket: "md-cv-master.appspot.com",
  messagingSenderId: "1024582780235",
  appId: "1:1024582780235:web:4da72bafbeb7226b2554ce",
  measurementId: "G-SVYRCJDPJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
