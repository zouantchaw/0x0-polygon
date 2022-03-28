import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// web app's Firebase configuration
import { firebaseConfig } from "./fbConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);