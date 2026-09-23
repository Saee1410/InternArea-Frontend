import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDG3SaRQnojN1Yc8Ie06gxm2nQTFYXQspE",
  authDomain: "housefull-486815.firebaseapp.com",
  projectId: "housefull-486815",
  storageBucket: "housefull-486815.firebasestorage.app",
  messagingSenderId: "427128532757",
  appId: "1:427128532757:web:e5846763e34e19ef33031c"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const googleProvider = new GoogleAuthProvider();


export {
  auth,
  googleProvider
};