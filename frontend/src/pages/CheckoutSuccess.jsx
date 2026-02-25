import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <div style={{
                background: 'white',
                padding: '60px 40px',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid var(--border)'
            }}>
                <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 20px' }} />

                <h1 style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: '800' }}>Order Confirmed!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
                    Thank you for your purchase. Your order has been placed in the database.
                </p>

                {state?.order && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
                            <span style={{ fontWeight: '600' }}>{state.order.orderId}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Amount Paid</span>
                            <span style={{ fontWeight: '700' }}>${state.order.totalPaid.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/')}>
                    Return to Storefront
                </button>
            </div>
        </div>
    );
}
