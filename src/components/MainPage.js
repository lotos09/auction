import React, { useContext } from 'react';
import { Context } from '../App';
import { useAuthState } from 'react-firebase-hooks/auth';

export const MainPage = () => {
  const { auth } = useContext(Context);

  return (
    <>
      <h2>Test deployment</h2>
    </>
  );
};
