// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdbAFIsjI8RrW-GBRrGligZWhAM-qrRVE",
  authDomain: "atlas-lumigram-27ed4.firebaseapp.com",
  projectId: "atlas-lumigram-27ed4",
  storageBucket: "atlas-lumigram-27ed4.appspot.com",
  messagingSenderId: "395406710720",
  appId: "1:395406710720:web:d982addf7804ee8ab29a25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
