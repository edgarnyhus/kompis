import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA",
    authDomain: "cvue-bf9ec.firebaseapp.com",
    databaseURL: "https://cvue-bf9ec.firebaseio.com",
    projectId: "cvue-bf9ec",
    storageBucket: "gs://cvue-bf9ec.appspot.com",
    messagingSenderId: "851848949486"
  };


// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

  // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyC8VV6GnkDeH9Bq84hamZVyT6U1LptaS4A",
//     authDomain: "kompis-bb597.firebaseapp.com",
//     databaseURL: "https://kompis-bb597.firebaseio.com",
//     projectId: "kompis-bb597",
//     storageBucket: "kompis-bb597.appspot.com",
//     messagingSenderId: "541706030985"
// };
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()
const apiKey = config.apiKey

export { db as default, apiKey }
