import React, { useContext } from 'react';
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
  const { shallowUsers, isAdmin, isSuperAdmin } = useContext(Context);

  return (
    <div style={styles.main}>
      {isAdmin && <UsersTable users={shallowUsers} />}
      {isSuperAdmin &&
        <RegisterForm />}
      {!isAdmin && <div>You don't have permission to manage users</div>}

    </div>
  )
}