import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VerifyDonation.css';

const VerifyDonation = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verifyDonation = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });

                const data = await response.json();
                if (data.success) {
                    setStatus('Donation Verified Successfully! Thank you for your support.');
                } else {
                    setStatus('Verification Failed. Invalid or expired link.');
                }
            } catch (error) {
                console.error('Error verifying:', error);
                setStatus('Error during verification.');
            }
        };

        if (id) {
            verifyDonation();
        }
    }, [id]);

    return (
        <div className="verify-container">
            <div className="verify-card">
                <h2>Donation Verification</h2>
                <p className="verify-status">{status}</p>
                <Link to="/" className="home-btn">Return to Home</Link>
            </div>
        </div>
    );
};

export default VerifyDonation;
