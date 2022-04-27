import firebase from 'firebase/compat'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBzFNuZpZFmo00ODltBPhHPVDiiIC64GLE',
  authDomain: 'auction-1459b.firebaseapp.com',
  projectId: 'auction-1459b',
  storageBucket: 'auction-1459b.appspot.com',
  messagingSenderId: '692768848863',
  appId: '1:692768848863:web:e3a01dfbe362ea17d8a26a',
}

export const myBase = firebase.initializeApp(firebaseConfig)

export const auth = getAuth(myBase)