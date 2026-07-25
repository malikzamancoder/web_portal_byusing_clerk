import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0eWjWuK3cFafKlbvkp36ftO2C9Uv8Vb4",
  authDomain: "institute-management-sys-e926a.firebaseapp.com",
  projectId: "institute-management-sys-e926a",
  storageBucket: "institute-management-sys-e926a.firebasestorage.app",
  messagingSenderId: "822540645947",
  appId: "1:822540645947:web:91cdc6b0ca28953cc78e1e",
  measurementId: "G-5EZL0W0X7W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);