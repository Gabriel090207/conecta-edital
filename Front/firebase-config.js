// firebase-config.js

// Suas configurações do Firebase que você copiou do console
const firebaseConfig = {
    apiKey: "AIzaSyAaKKRHcQqsfjLjPczsgxJhnjfyY4cclkQ",
    authDomain: "conectaeditalapp.firebaseapp.com",
    projectId: "conectaeditalapp",
    storageBucket: "conectaeditalapp.firebasestorage.app",
    messagingSenderId: "1057915288128",
    appId: "1:1057915288128:web:30799f8972115a48173da5",
    measurementId: "G-ZG4JPW6X3B"
    // measurementId: "SEU_MEASUREMENT_ID" // Opcional, se você tiver o Google Analytics configurado
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);

// Obtém as instâncias dos serviços que iremos usar
const auth = app.auth(); // Para autenticação de usuários
const db = app.firestore(); // Para o Firestore (banco de dados NoSQL)