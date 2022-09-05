import React, { useContext } from 'react';
import { ROUTES } from '../../../utils/constants';
import { Routes, Route } from 'react-router-dom';
import { Context } from '../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MainPage } from '../../MainPage';
import { Navbar } from './Navbar';
import { NotFound } from './NotFound';
import ManageLots from '../app/manageLots/ManageLots';
import { LoginPage } from '../login/LoginPage';
import { ManageUsersPage } from '../app/manageUsers/ManageUsersPage';

const AppRouter = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ?
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index key={ROUTES.MAIN_PAGE_ROUTE} element={<MainPage />} />
            <Route key={ROUTES.MANAGE_USERS_ROUTE} path={ROUTES.MANAGE_USERS_ROUTE}
                   element={<ManageUsersPage />} />
            <Route key={ROUTES.MANAGE_LOTS_ROUTE} path={ROUTES.MANAGE_LOTS_ROUTE}
                   element={<ManageLots />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes> : <LoginPage />}
    </div>
  );
};

export default AppRouter;
