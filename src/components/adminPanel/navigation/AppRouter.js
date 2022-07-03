import React, { useContext } from 'react';
import {
  LOGIN_ROUTE,
  MAIN_PAGE_ROUTE,
  MANAGE_LOTS_ROUTE,
} from '../../../utils/constants';
import { Routes, Route } from 'react-router-dom';
import { Context } from '../../../index';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MainPage } from '../../MainPage';
import { Navbar } from './Navbar';
import { NotFound } from './NotFound';
import ManageLots from '../app/manageLots/ManageLots';
import { LoginPage } from '../login/LoginPage';

const AppRouter = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ?
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index key={MAIN_PAGE_ROUTE} element={<MainPage />} />
            <Route key={LOGIN_ROUTE} path={LOGIN_ROUTE} element={<LoginPage />} />
            {!!user &&
              <Route key={MANAGE_LOTS_ROUTE} path={MANAGE_LOTS_ROUTE}
                     element={<ManageLots />} />}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes> : <LoginPage />}
    </div>
  );
};

export default AppRouter;
