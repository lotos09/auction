import React, { useCallback, useContext, useMemo } from 'react';

const UsersTable = ({ users }) => {

  return (
    <>
      <div>
        <h2>Users:</h2>
        {users ? users.map(user => (
          <div key={user.registerEmail}>{user.registerEmail}</div>
        )) : <p>no users</p>}
      </div>
    </>
  )
}

export default UsersTable;