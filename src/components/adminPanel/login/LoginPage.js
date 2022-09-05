import { useFormik } from 'formik';
import { Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext } from 'react';
import { Context } from '../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeCollectionPath } from '../../../api/general';

export const LoginPage = () => {
  const { auth, setUsers } = useContext(Context);
  const [user] = useAuthState(auth);

  const loginForm = useFormik(
    {
      initialValues: {
        loginEmail: '',
        loginPassword: '',
      },
      onSubmit: () => loginUser(),
    },
  );


  const loginUser = async () => {
    try {
      const newUser = await signInWithEmailAndPassword(auth, loginForm.values.loginEmail,
        loginForm.values.loginPassword);
      fetch(makeCollectionPath('users', newUser.accessToken, ''))
        .then(response => response.json())
        .then(data => setUsers(data));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {!user &&
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2>Log in</h2>
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
              style={{marginLeft: '20px'}}
            />

            <Button type='submit' variant="contained" sx={{marginLeft: '20px'}}>Submit</Button>
          </form>
        </div>
        }
    </>
  );
};