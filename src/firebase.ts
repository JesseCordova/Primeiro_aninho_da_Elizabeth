import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2fqx-0c0MaXXDBSy_9AnYCvNuvhDUCKU",
  authDomain: "listaconfirmados.firebaseapp.com",
  projectId: "listaconfirmados",
  storageBucket: "listaconfirmados.firebasestorage.app",
  messagingSenderId: "137115211048",
  appId: "1:137115211048:web:08dc84d0e05f9fe74eac1d",
  measurementId: "G-B7LBKZ2Y95"
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
