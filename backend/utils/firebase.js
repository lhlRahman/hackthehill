// firebase,js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2yXqX0stTUc6_8XmYkmvvGhNhesP9iPo",
  authDomain: "odyssey-file-storage.firebaseapp.com",
  projectId: "odyssey-file-storage",
  storageBucket: "odyssey-file-storage.appspot.com",
  messagingSenderId: "1084071318008",
  appId: "1:1084071318008:web:ad4cd494053c097400860d",
  measurementId: "G-FVLJCHT9HG"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);