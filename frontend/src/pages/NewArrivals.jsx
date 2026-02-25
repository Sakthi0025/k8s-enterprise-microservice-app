import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NewArrivals() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
            <button className="icon-btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/')}>
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <div style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <Sparkles size={64} style={{ margin: '0 auto 20px', color: '#3b82f6' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>Spring 2026 Drops</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                    Be the first to explore the latest designs fresh off the pipeline. Stay tuned as new items synchronize via our Product Microservice.
                </p>
                <button className="btn-primary" style={{ marginTop: '30px' }} onClick={() => navigate('/')}>
                    Return to Catalog
                </button>
            </div>
        </div>
    );
}
