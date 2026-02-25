import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, ArrowLeft } from 'lucide-react';

export default function Categories() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
            <button className="icon-btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/')}>
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <LayoutGrid size={32} /> Browse By Category
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                {['Bags & Backpacks', 'Audio & Tech', 'Wearables', 'Footwear', 'Lifestyle', 'Accessories'].map(cat => (
                    <div key={cat} style={{ background: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s' }} className="hover-lift">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{cat}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Explore Collection</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
