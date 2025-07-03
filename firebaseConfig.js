// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// using school email
// const firebaseConfig = {
//   apiKey: "AIzaSyAdbAFIsjI8RrW-GBRrGligZWhAM-qrRVE",
//   authDomain: "atlas-lumigram-27ed4.firebaseapp.com",
//   projectId: "atlas-lumigram-27ed4",
//   storageBucket: "atlas-lumigram-27ed4.appspot.com",
//   messagingSenderId: "395406710720",
//   appId: "1:395406710720:web:d982addf7804ee8ab29a25"
// };

// using personal email
const firebaseConfig = {
  apiKey: "AIzaSyC1mo-KW09xDvnLNLSx1Ls10PsZiH1X49w",
  authDomain: "lumigram-c91ae.firebaseapp.com",
  projectId: "lumigram-c91ae",
  storageBucket: "lumigram-c91ae.firebasestorage.app",
  messagingSenderId: "290369783438",
  appId: "1:290369783438:web:f59cc7d46a5fcaaa2a6bdf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);