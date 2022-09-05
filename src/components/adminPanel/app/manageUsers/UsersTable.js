import React from 'react';
import UsersTableRow from './UsersTableRow';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const styles = {
  table: {
    minWidth: 650,
    maxWidth: 1000,
  }
}

const UsersTable = ({ users }) => {

  return (
    <>
      <TableContainer>
        <Table sx={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>email</TableCell>
              <TableCell align="right">is admin</TableCell>
              <TableCell align="right">is employee</TableCell>
              <TableCell align="right">is read only</TableCell>
              <TableCell align="right">Edit user</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <UsersTableRow key={user.registerEmail} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UsersTable;