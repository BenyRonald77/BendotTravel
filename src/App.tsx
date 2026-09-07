import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicPortal } from './components/public/PublicPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ToastContainer } from './components/common/ToastContainer';
import './styles/index.css';
import './styles/public.css';
import './styles/admin.css';

const MainView: React.FC = () => {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'public' ? <PublicPortal /> : <AdminPortal />}
      <ToastContainer />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
};

export default App;
