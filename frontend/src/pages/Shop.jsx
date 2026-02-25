import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, ChevronRight } from 'lucide-react';

export default function Shop({ cartItemCount }) {
    const [products, setProducts] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Products
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to load products", err));

        // Fetch Merchants
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                if (data && data.users) setMerchants(data.users);
            })
            .catch(err => console.error("Failed to load merchants", err))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = (productId) => {
        fetch('/api/cart?sessionId=user_123', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        }).then(res => {
            if (res.ok) {
                // We trigger a re-check of cart count from the App level
                window.dispatchEvent(new Event('cart-updated'));
            }
        });
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="logo-dot"></div>
                    LuminaStore
                </div>
                <div className="nav-links">
                    <span className="nav-link active" onClick={() => navigate('/')}>Shop</span>
                    <span className="nav-link" onClick={() => navigate('/categories')}>Categories</span>
                    <span className="nav-link" onClick={() => navigate('/new-arrivals')}>New Arrivals</span>
                </div>
                <div className="nav-icons">
                    <button className="icon-btn"><Search size={20} /></button>
                    <button className="icon-btn"><User size={20} /></button>
                    <button className="icon-btn" onClick={() => navigate('/cart')}>
                        <ShoppingCart size={20} />
                        {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
                    </button>
                </div>
            </nav>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <div className="badge-tag">Spring 2026 Collection</div>
                        <h1>Design that speaks for itself.</h1>
                        <p>Discover our curated collection of premium products. Minimalist design, sustainable materials, and uncompromised quality.</p>
                        <button className="btn-primary" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>Shop Now</button>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Trending This Week</h2>
                    <div className="product-grid">
                        {products.length === 0 ? <p>Loading products from PostgreSQL...</p> :
                            products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image" style={{ padding: 0, overflow: 'hidden' }}>
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                    <div className="product-category">{product.category}</div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-footer">
                                        <div className="product-price">${product.price.toFixed(2)}</div>
                                        <button className="add-to-cart" onClick={() => addToCart(product.id)} title="Add to cart">+</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                <section className="sellers-section">
                    <div className="sellers-header">
                        <div>
                            <h2 className="section-title" style={{ marginBottom: '5px' }}>Our Top Merchants</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Live data fetched from our Spring Boot Microservices</p>
                        </div>
                        <div className="live-indicator">
                            <div className="live-dot"></div>
                            {loading ? 'Connecting to backend...' : 'Live System Sync'}
                        </div>
                    </div>

                    <div className="sellers-grid">
                        {loading ? (
                            <p>Loading merchant data...</p>
                        ) : merchants.length > 0 ? (
                            merchants.map(user => (
                                <div key={user.id} className="seller-card">
                                    <div className="seller-avatar">{user.name.charAt(0)}</div>
                                    <div className="seller-info">
                                        <h4>{user.name}</h4>
                                        <p>Merchant ID: #{user.id}00X9</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="seller-card">Backend disconnected. Please check Kubernetes deployment.</div>
                        )}
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2026 LuminaStore. A Kubernetes Demo Application.</p>
            </footer>
        </>
    );
}
