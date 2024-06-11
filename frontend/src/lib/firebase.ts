import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import config from "@/lib/config"
import { getFirestore, initializeFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
   apiKey: config.firebase.apiKey,
   authDomain: config.firebase.authDomain,
   projectId: config.firebase.projectId,
   storageBucket: config.firebase.storageBucket,
   messagingSenderId: config.firebase.messagingSenderId,
   appId: config.firebase.appId
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
initializeFirestore(app, {
   ignoreUndefinedProperties: true
})
const db = getFirestore(app)
const storage = getStorage(app)
export { auth, db, storage }
