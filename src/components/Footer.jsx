import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-title">
                            <span className="brand-accent">Bharat</span> Foundation
                        </h3>
                        <p className="footer-tagline">
                            Serving with Diligence and Integrity
                        </p>
                    </div>
                    <div className="footer-links">
                        <Link to="/admin/login" className="footer-link">Admin</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="copyright">
                        © 2025 Bharat Foundation. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
