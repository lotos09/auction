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
import { superAdminUid } from './components/adminPanel/login/constants';
import { PacmanLoader } from 'react-spinners';

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  const currentUser = useMemo(() => user, [user]);

  const [users, setUsers] = useState({});
  const [currentShallowUser, setCurrentShallowUser] = useState(null);
  const shallowUsers = useMemo(() => Object.entries(users).map(item => {
    return {...item[1], dbId: item[0]}
  }), [users]);

  useEffect(() => {
    if (user) {
      setCurrentShallowUser(shallowUsers.find(({ uid }) => uid === user.uid))
    }
  }, [users, shallowUsers]);

  useEffect(() => {
    const token = user?.accessToken;
    fetch(makeCollectionPath('users', token, ''))
      .then(response => response.json())
      .then(data => {
        if (!data?.error) {
          setUsers(data);
        }
      });
  }, [user?.accessToken]);

  const isAdmin = useMemo(() => currentShallowUser?.role?.admin, [currentShallowUser]);
  const isEmployee = useMemo(() => currentShallowUser?.role?.employee, [currentShallowUser]);
  const isSuperAdmin = useMemo(() => user?.uid === superAdminUid, [user]);
console.log(user);
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
        currentUser,
        isAdmin,
        isSuperAdmin,
        isEmployee,
      }}
    >
      {user ? <BrowserRouter>
        <AppRouter />
      </BrowserRouter> : <PacmanLoader color="#36d7b7" />}
    </Context.Provider>
  );
}

export default App;
