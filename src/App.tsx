import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DialogProvider } from './context/DialogContext';
import { PublicPortal } from './components/public/PublicPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ToastContainer } from './components/common/ToastContainer';
import { DialogContainer } from './components/common/DialogContainer';
import './styles/index.css';
import './styles/public.css';
import './styles/admin.css';
import './styles/dialog.css';

const MainView: React.FC = () => {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'public' ? <PublicPortal /> : <AdminPortal />}
      <ToastContainer />
      <DialogContainer />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <DialogProvider>
      <AppProvider>
        <MainView />
      </AppProvider>
    </DialogProvider>
  );
};

export default App;
