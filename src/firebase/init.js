import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "AIzaSyDhl6ntnga1OlaZVfvyhbUo7IXzwwUiBZ0",
    authDomain: "kompis-1c826.firebaseapp.com",
    databaseURL: "https://kompis-1c826.firebaseio.com",
    projectId: "kompis-1c826",
    storageBucket: "",
    messagingSenderId: "866130525256"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()

export default  db
