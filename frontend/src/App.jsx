import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Categories from './pages/Categories';
import NewArrivals from './pages/NewArrivals';
import './index.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    fetch('/api/cart?sessionId=user_123')
      .then(res => res.json())
      .then(data => {
        const count = data.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCartCount();
    // Listen for custom events dispatched when items are added/removed to cart
    window.addEventListener('cart-updated', fetchCartCount);
    return () => window.removeEventListener('cart-updated', fetchCartCount);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Shop cartItemCount={cartCount} />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
    </Routes>
  );
}

export default App;
