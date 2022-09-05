import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Checkbox, TableCell, TableRow } from '@mui/material';
import { useFormik } from 'formik';
import { Context } from '../../../../App';
import { makeCollectionPath, makeRequest } from '../../../../api/general';

const UsersTableRow = ({ user }) => {
  const { currentUser } = useContext(Context);
  const token = useMemo(() => currentUser?.accessToken, [currentUser])
  const [buttonState, setButtonState] = useState(
    {name: 'edit', toggleCheckboxes: true});

  const userForm = useFormik({
    initialValues: {
      registerEmail: user?.registerEmail,
      role: {
        admin: user?.role?.admin,
        employee: user?.role?.employee,
        readOnly: user?.role?.readOnly,
      },
      uid: user?.uid,
    },
    onSubmit: async (values, { resetForm }) => {
      await makeRequest(makeCollectionPath('users', token, `/${user.dbId}`), 'PUT',
        {...userForm.values}
      )
    },
  });

  const onButtonClick = useCallback(() => {
    if (buttonState.name === 'edit') {
      setButtonState({ ...buttonState ,name: 'save', toggleCheckboxes: false});
    }
    if (buttonState.name === 'save') {
      userForm.handleSubmit();
      setButtonState({ ...buttonState ,name: 'edit', toggleCheckboxes: true});
    }

  }, [buttonState, setButtonState]);

  const onCheckboxChange = useCallback(setRole => {
    userForm.setFieldValue('role', {...userForm.values.role,
      [setRole]: !userForm.values.role[setRole]})
  });

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">{user.registerEmail}</TableCell>
      <TableCell align="right">
        <Checkbox
        checked={userForm.values.role.admin}
        disabled={buttonState.toggleCheckboxes}
        onChange={() => onCheckboxChange('admin')}
        inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>
      <TableCell align="right">
        <Checkbox
          checked={userForm.values.role.employee}
          disabled={buttonState.toggleCheckboxes}
          onChange={() => onCheckboxChange('employee')}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>
      <TableCell align="right">
        <Checkbox
          checked={userForm.values.role.readOnly}
          disabled={buttonState.toggleCheckboxes}
          onChange={() => onCheckboxChange('readOnly')}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>
      <TableCell align="right">
        <Button onClick={onButtonClick} variant="contained">{buttonState.name}</Button>
      </TableCell>
    </TableRow>
  )
}

export default UsersTableRow;