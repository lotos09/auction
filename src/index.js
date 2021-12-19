import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import firebase from 'firebase';
import 'firebase/storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat';
import 'firebase/firestore';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBzFNuZpZFmo00ODltBPhHPVDiiIC64GLE",
//     authDomain: "auction-1459b.firebaseapp.com",
//     projectId: "auction-1459b",
//     storageBucket: "auction-1459b.appspot.com",
//     messagingSenderId: "692768848863",
//     appId: "1:692768848863:web:e3a01dfbe362ea17d8a26a"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

export const myBase = firebase.initializeApp({
  apiKey: 'AIzaSyBzFNuZpZFmo00ODltBPhHPVDiiIC64GLE',
  authDomain: 'auction-1459b.firebaseapp.com',
  projectId: 'auction-1459b',
  storageBucket: 'auction-1459b.appspot.com',
  messagingSenderId: '692768848863',
  appId: '1:692768848863:web:e3a01dfbe362ea17d8a26a',
});

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore();

ReactDOM.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        firebase,
        auth,
        firestore,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
