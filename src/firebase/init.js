import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "AIzaSyAbRwsRu9gwLv5XFkHCQE4Q8b5cmVLmskA",
    authDomain: "kompis-44b32.firebaseapp.com",
    databaseURL: "https://kompis-44b32.firebaseio.com",
    projectId: "kompis-44b32",
    storageBucket: "kompis-44b32.appspot.com",
    messagingSenderId: "340801280482"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()

export default  db
