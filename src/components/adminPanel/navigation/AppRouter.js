import React, { useContext } from 'react';
import { CHAT_ROUTE, MAIN_PAGE_ROUTE, MANAGE_CONTENT_ROUTE } from '../../../utils/constants';
import { Routes, Route } from 'react-router-dom';
import { Chat } from '../app/chat/Chat';
import { Context } from '../../../index';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MainPage } from '../../MainPage';
import { ManageContentPage } from '../app/manageContent/ManageContentPage';
import { Navbar } from './Navbar';
import { NotFound } from './NotFound';

const AppRouter = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index key={MAIN_PAGE_ROUTE} element={<MainPage />} />
          {!!user && (
            <Route key={MANAGE_CONTENT_ROUTE} path="content" element={<ManageContentPage />} />
          )}
          {!!user && <Route key={CHAT_ROUTE} path="chat" element={<Chat />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
