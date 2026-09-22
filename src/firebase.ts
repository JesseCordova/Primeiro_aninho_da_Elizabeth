import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCoXW_EWxrPBKc1sYiGEKCK7u9lu2MsFcM',
  authDomain: 'gen-lang-client-0178250261.firebaseapp.com',
  projectId: 'gen-lang-client-0178250261',
  storageBucket: 'gen-lang-client-0178250261.firebasestorage.app',
  messagingSenderId: '848652384664',
  appId: '1:848652384664:web:6c9a96686e0b5947ae13ed',
};

const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
