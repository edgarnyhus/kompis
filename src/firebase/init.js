import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA",
    authDomain: "cvue-bf9ec.firebaseapp.com",
    databaseURL: "https://cvue-bf9ec.firebaseio.com",
    projectId: "cvue-bf9ec",
    storageBucket: "cvue-bf9ec.appspot.com",
    messagingSenderId: "851848949486"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()

export default  db
