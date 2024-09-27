import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContexts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import Reviews from './pages/Reviews';
import AdminPanel from './pages/AdminPanel';
import Login from './components/Login';
import CheckoutForm from './components/CheckoutForm'; // Add Checkout Form
import OrderSummary from './components/OrderSummary'; // Add Order Summary
import { auth } from './utils/firebase';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <PayPalScriptProvider options={{ "client-id": "ARwDpF_raJmbI-JsZamGnCg5pdKcH4BZpsaYYHO51uLkOpb6BRcTlzsU6fn7wwEgl-_5NU26FPEfyPtQ" }}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route
                  path="/admin"
                  element={user ? <AdminPanel /> : <Navigate to="/login" />} />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/admin" /> : <Login onLogin={() => setUser(auth.currentUser)} />} />
                {/* Add checkout and order summary routes */}
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/order-summary/:orderId" element={<OrderSummary />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PayPalScriptProvider>
    </CartProvider>
  );
}

export default App;
