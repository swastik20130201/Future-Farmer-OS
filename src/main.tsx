import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CloudDataProvider } from './context/CloudDataContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CloudDataProvider>
        <App />
      </CloudDataProvider>
    </AuthProvider>
  </StrictMode>,
);

