import { useFormik } from 'formik';
import { Button, TextField, Checkbox } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useContext, useMemo } from 'react';
import { Context } from '../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { superAdminUid } from './constants';
import { makeCollectionPath, makeRequest } from '../../../api/general';

export const LoginPage = () => {
  const { auth, shallowUsers, setUsers } = useContext(Context);
  const [user] = useAuthState(auth);

  const registerForm = useFormik(
    {
      initialValues: {
        registerEmail: '',
        registerPassword: '',
        role: {
          admin: false,
          employee: false,
          readOnly: false,
        },
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
      const newUser = await createUserWithEmailAndPassword(auth, registerForm.values.registerEmail,
        registerForm.values.registerPassword);
      await makeRequest(makeCollectionPath(`users`, user.accessToken, ''),
        'POST', { ...registerForm.values, uid: newUser.user.uid });
      console.log(newUser);
    } catch (error) {
      console.log(error.message);
    }
  };


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

  const onCheckboxChange = useCallback(setRole => {
    registerForm.setFieldValue('role', {...registerForm.values.role,
      [setRole]: !registerForm.values.role[setRole]})
  })

  const renderRegisterForm = useMemo(() => {
    return (
      <>
        <div>
          <h2>Users:</h2>
          {shallowUsers ? shallowUsers.map(user => (
            <div key={user.registerEmail}>{user.registerEmail}</div>
          )) : <p>no users</p>}
        </div>
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
            sx={{color: 'red'}}
            required
            id='registerPassword'
            label='registerPassword'
            name='registerPassword'
            onChange={registerForm.handleChange}
            value={registerForm.values.registerPassword}
          />

          <div>
            <span>is admin</span>
            <Checkbox
              checked={registerForm.values.role.admin}
              onChange={() => onCheckboxChange('admin')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span>is employee</span>
            <Checkbox
              checked={registerForm.values.role.employee}
              onChange={() => onCheckboxChange('employee')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span>is read only</span>
            <Checkbox
              checked={registerForm.values.role.readOnly}
              onChange={() => onCheckboxChange('readOnly')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>



          <Button type='submit' variant="contained">Submit</Button>
        </form>
      </>
    );
  }, [user, registerForm]);

  return (
    <>
      {user?.uid === superAdminUid && renderRegisterForm}


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

      {user && <h2>you are logged in</h2>}
    </>
  );
};