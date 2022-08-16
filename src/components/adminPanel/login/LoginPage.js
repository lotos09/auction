import { useFormik } from 'formik';
import { Button, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useMemo } from 'react';
import { Context } from '../../../index';
import { useAuthState } from 'react-firebase-hooks/auth';
import { superAdminUid } from './constants';
import { getAuth, updatePassword } from 'firebase/auth';

export const LoginPage = () => {
  // const { auth } = useContext(Context);
  // const [user] = useAuthState(auth);

  const auth = getAuth();

  const user = auth.currentUser;

  const registerForm = useFormik(
    {
      initialValues: {
        registerEmail: '',
        registerPassword: '',

      },
      onSubmit: () => registerUser(),
    },
  );

  const loginForm = useFormik(
    {
      initialValues: {
        loginEmail: '',
        loginPassword: '',
      },
      onSubmit: () => loginUser(),
    },
  );


  const registerUser = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerForm.values.registerEmail,
        registerForm.values.registerPassword);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };


  const loginUser = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginForm.values.loginEmail,
        loginForm.values.loginPassword);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updatePass = () => updatePassword(user, 'newPass').then(() => {
    console.log('password updated');
  }).catch((error) => {
    console.log('error');
  });

  const renderRegisterForm = useMemo(() => {
    return (
      <>
        <h2>Register user</h2>
        <form onSubmit={registerForm.handleSubmit}>
          <TextField
            required
            id='registerEmail'
            label='registerEmail'
            name='registerEmail'
            onChange={registerForm.handleChange}
            value={registerForm.values.registerEmail}
          />

          <TextField
            required
            id='registerPassword'
            label='registerPassword'
            name='registerPassword'
            onChange={registerForm.handleChange}
            value={registerForm.values.registerPassword}
          />

          <Button type='submit'>Submit</Button>
        </form>
      </>
    );
  }, [user]);

  return (
    <>
      {user?.uid === superAdminUid && renderRegisterForm}


      <h2>Log in</h2>

      <button onClick={updatePass}>update pass</button>

      <form onSubmit={loginForm.handleSubmit}>
        <TextField
          required
          id='loginEmail'
          label='loginEmail'
          name='loginEmail'
          onChange={loginForm.handleChange}
          value={loginForm.values.loginEmail}
        />

        <TextField
          required
          id='loginPassword'
          label='loginPassword'
          name='loginPassword'
          onChange={loginForm.handleChange}
          value={loginForm.values.loginPassword}
        />

        <Button type='submit'>Submit</Button>
      </form>
    </>
  );
};