import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Donation.css';

const Donation = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', amount: '', email: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Processing...');

        try {
            const response = await fetch('http://localhost:5000/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'General' })
            });

            const data = await response.json();
            if (data.success) {
                setStatus('Donation initiated! Please check your email to verify.');
                setFormData({ name: '', amount: '', email: '' });
            } else {
                setStatus('Failed to initiate donation.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error processing donation.');
        }
    };

    return (
        <section id="donate" className="donation">
            <h2 className="donation-title">{t.donation.title}</h2>

            <div className="donation-container">
                <div className="donation-card">
                    <h3 className="card-title">{t.donation.cardTitle}</h3>
                    <p className="card-desc">
                        {t.donation.cardDesc}
                    </p>

                    <form className="donation-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder={t.donation.namePlaceholder}
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email (for verification)"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="amount"
                            placeholder={t.donation.amountPlaceholder}
                            className="form-input"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="donate-submit-btn">{t.donation.submit}</button>
                        {status && <p className="status-msg">{status}</p>}
                    </form>
                </div>

                <div className="upi-qr-section">
                    <h3>Scan to Donate via UPI</h3>
                    <div className="qr-placeholder">
                        <p>UPI QR Code</p>
                        {/* Replace with actual QR image */}
                        <div className="qr-box"></div>
                    </div>
                    <p className="upi-id">UPI ID: bharatfoundation@upi</p>
                </div>
            </div>
        </section>
    );
};

export default Donation;
