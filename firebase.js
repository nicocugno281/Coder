import { initializeApp } from "firebase/app";
import { getAuth,getApp, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Asegúrate de importar Firestore
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBujVDLfV4pRNmHannNJyr5aPMDfN3LAnQ",
  authDomain: "coder-a7af0.firebaseapp.com",
  databaseURL: "https://coder-a7af0-default-rtdb.firebaseio.com",
  projectId: "coder-a7af0",
  storageBucket: "coder-a7af0.appspot.com",
  messagingSenderId: "53201572307",
  appId: "1:53201572307:web:c5cafd0da01083083c5f26"
};

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializar Firestore
const db = getFirestore(app); // Asegúrate de inicializar Firestore

export { app, auth, db, getApp, getAuth }; // Exporta `db` también