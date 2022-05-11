import React, { useContext } from 'react';
import { Context } from '../index';
import { useAuthState } from 'react-firebase-hooks/auth';


export const MainPage = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  return (
    <>
      <h2>Test API</h2>
    </>
  );
};
