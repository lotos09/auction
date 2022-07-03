import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'firebase/storage';

import firebase from 'firebase/compat';
import 'firebase/firestore';
import 'firebase/auth';
import { myBase } from './firebase/config';

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
        myBase,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
