import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GlobalContextProvider } from './utils/GlobalContext.jsx'
import { AuthProvider } from "./utils/contexts/authContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </AuthProvider>
  </React.StrictMode>,
)
