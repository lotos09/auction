import React, { useCallback, useContext, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Context } from '../../../../App';
import UsersTable from './UsersTable';
import RegisterForm from './RegisterForm';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
}

export const ManageUsersPage = () => {
  const { auth, shallowUsers, setUsers } = useContext(Context);


  return (
    <div style={styles.main}>
      manage users page:
      <UsersTable users={shallowUsers} />
      <RegisterForm />
    </div>
  )
}