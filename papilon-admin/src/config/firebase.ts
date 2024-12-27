// src/config/firebase.ts

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA-iclZDvZ_IFCvm18k8UC1NJVm0GbS8zg",
    authDomain: "papilon-baa86.firebaseapp.com",
    projectId: "papilon-baa86",
    storageBucket: "papilon-baa86.appspot.com",
    messagingSenderId: "820668029080",
    appId: "1:820668029080:web:e89170fe99dbcf5877d8ed",
    measurementId: "G-BDEM75GZG9"
  };

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtén la instancia de Storage
export const storage = getStorage(app);
