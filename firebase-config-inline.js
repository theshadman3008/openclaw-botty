// ============================================================================
// CONFIGURAZIONE FIREBASE - Ross AI Dashboard
// Progetto: rossdb
// ============================================================================

const firebaseConfig = {
    apiKey: "AIzaSyDac491FBUVD_O5A2u2r2r2RlWKu26u9pA",
    authDomain: "rossdb.firebaseapp.com",
    projectId: "rossdb",
    storageBucket: "rossdb.firebasestorage.app",
    messagingSenderId: "776172557370",
    appId: "1:776172557370:web:256c12b8e1fc660ea51103"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Inizializza servizi
const auth = firebase.auth();
const db = firebase.firestore();
