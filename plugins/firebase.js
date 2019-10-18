import firebase from "firebase/app";
import "firebase/firestore";
if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyCoU4TDBNftjiJFgRxda23F-snwHoeRM-Q",
    authDomain: "oepc-167018.firebaseapp.com",
    databaseURL: "https://oepc-167018.firebaseio.com",
    projectId: "oepc-167018",
    storageBucket: "oepc-167018.appspot.com",
    messagingSenderId: "75211564780",
    appId: "1:75211564780:web:d1aaa262358a51caf927c9",
    measurementId: "G-JHPGJ8SKY1"
  };
  firebase.initializeApp(config);
  firebase.firestore().settings({ timestampsInSnapshots: true });
}
const fireDb = firebase.firestore();
export { fireDb };
