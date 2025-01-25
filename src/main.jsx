import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from '../redux/store.jsx'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID is not set in environment variables');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => {
        console.error('Google OAuth script failed to load');
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)