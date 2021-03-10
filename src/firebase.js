import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
firebase.initializeApp({
	apiKey: "AIzaSyBLbHD0v-zMaYj9xQCLbRKCaKVM6yf7Lgg",
	authDomain: "react-to-do-list-d15ff.firebaseapp.com",
	projectId: "react-to-do-list-d15ff",
	storageBucket: "react-to-do-list-d15ff.appspot.com",
	messagingSenderId: "208792476665",
	appId: "1:208792476665:web:383af0ee48170e8d287b28",
	measurementId: "G-C04EYEK86Y",
});
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
