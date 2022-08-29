import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/adminPanel/navigation/AppRouter';

import React, { createContext, useEffect, useMemo, useState } from 'react';

import 'firebase/storage';

import firebase from 'firebase/compat';
import 'firebase/firestore';
import 'firebase/auth';
import { myBase } from './firebase/config';
import { makeCollectionPath } from './api/general';
import { useAuthState } from 'react-firebase-hooks/auth';

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  const [users, setUsers] = useState({});
  const [currentShallowUser, setCurrentShallowUser] = useState({});
  const shallowUsers = useMemo(() => Object.values(users), [users]);

  useEffect(() => {
    const token = user?.accessToken;
    fetch(makeCollectionPath('users', token, ''))
      .then(response => response.json())
      .then(data => setUsers(data));
  }, [user?.accessToken]);

  return (
    <Context.Provider
      value={{
        firebase,
        auth,
        firestore,
        myBase,
        shallowUsers,
        setUsers,
        setCurrentShallowUser,
        currentShallowUser,
      }}
    >
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
