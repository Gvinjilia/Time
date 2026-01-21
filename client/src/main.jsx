import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18n from './i18n/i18n.js';
import App from './App.jsx';

import { BrowserRouter } from 'react-router';
import { AuthProvider } from './context/AuthContext.jsx';
import { WatchProvider } from './context/WatchContext.jsx';
import { ReviewProvider } from './context/ReviewContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WatchProvider>
          <ReviewProvider>
            <UserProvider>
              <CartProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CartProvider>
            </UserProvider>
          </ReviewProvider>
        </WatchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
