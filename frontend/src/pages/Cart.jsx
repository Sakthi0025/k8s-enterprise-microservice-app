import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = () => {
        fetch('/api/cart?sessionId=user_123')
            .then(res => res.json())
            .then(data => setCartItems(data))
            .catch(err => console.error("Failed to load cart", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeItem = (itemId) => {
        fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    fetchCart();
                    window.dispatchEvent(new Event('cart-updated'));
                }
            });
    };

    const handleCheckout = () => {
        setCheckoutLoading(true);
        fetch('/api/checkout?sessionId=user_123', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                window.dispatchEvent(new Event('cart-updated')); // clear badge
                navigate('/checkout-success', { state: { order: data } });
            })
            .catch(err => console.error(err))
            .finally(() => setCheckoutLoading(false));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <button className="icon-btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/')}>
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShoppingCart size={32} /> Your Cart
            </h1>

            {loading ? <p>Loading cart...</p> :
                cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'white', borderRadius: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '20px' }}>Your cart is empty.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
                    </div>
                ) : (
                    <>
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '30px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.product.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Qty: {item.quantity} x ${item.product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button className="icon-btn" style={{ color: 'red' }} onClick={() => removeItem(item.id)}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Total</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>${calculateTotal()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-primary" onClick={handleCheckout} disabled={checkoutLoading}>
                                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </>
                )}
        </div>
    );
}
