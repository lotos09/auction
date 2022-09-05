import React, { useCallback, useContext } from 'react';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { makeCollectionPath, makeRequest } from '../../../../api/general';
import { Button, Checkbox, TextField } from '@mui/material';
import { Context } from '../../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';

const RegisterForm = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  const registerForm = useFormik(
    {
      initialValues: {
        registerEmail: '',
        role: {
          admin: false,
          employee: false,
          readOnly: false,
        },
      },
      onSubmit: () => registerUser(),
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

  const onCheckboxChange = useCallback(setRole => {
    registerForm.setFieldValue('role', {...registerForm.values.role,
      [setRole]: !registerForm.values.role[setRole]})
  })

  return (
    <div>
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
          sx={{color: 'red', marginLeft: '10px'}}
          required
          id='registerPassword'
          label='registerPassword'
          name='registerPassword'
          onChange={registerForm.handleChange}
          value={registerForm.values.registerPassword}
        />

        <div>
          <div>
            <Checkbox
              checked={registerForm.values.role.admin}
              onChange={() => onCheckboxChange('admin')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span>is admin</span>
          </div>

          <div>
            <Checkbox
              checked={registerForm.values.role.employee}
              onChange={() => onCheckboxChange('employee')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span>is employee</span>
          </div>

          <div>
            <Checkbox
              checked={registerForm.values.role.readOnly}
              onChange={() => onCheckboxChange('readOnly')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span>is read only</span>
          </div>

        </div>
        <Button type='submit' variant="contained">Submit</Button>
      </form>
    </div>
  )
}

export default RegisterForm;