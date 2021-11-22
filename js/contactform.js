const firebaseConfig = {
    apiKey: "AIzaSyB2PuEiAh7qtEgwasmkFIGoO-8wM56J3tY",
    authDomain: "projectcsci225.firebaseapp.com",
    projectId: "projectcsci225",
    storageBucket: "projectcsci225.appspot.com",
    messagingSenderId: "517167171471",
    appId: "1:517167171471:web:a28c3e6f52714367faadfa",
    measurementId: "G-WJ3Z48K56Y"
};

firebase.initializeApp(firebaseConfig);
const fireB = firebase.firestore();


const form = document.querySelector('#contactform');



form.addEventListener('submit', (e) => {
    e.preventDefault();
    fireB.collection('contact').add({
        email:   form.elements["email"].value,
        message: form.elements["message"].value,
        nameF:   form.elements["nameFirst"].value,
        nameL:   form.elements["nameLast"].value,
    })
});
