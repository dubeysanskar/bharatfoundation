import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                setError('Invalid Password');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>
                {error && <p className="error-msg">{error}</p>}
                <button className="back-home-btn" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
