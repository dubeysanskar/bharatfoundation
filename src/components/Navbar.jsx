import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';
import logo from '../assets/logo.jpeg';

const Navbar = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleScroll = (id) => {
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Bharat Foundation Logo" className="logo-img" />
                    <span className="logo-text">
                        <span className="logo-orange">Bharat</span> <span className="logo-white">Foundation</span>
                    </span>
                </Link>
            </div>
            <div className="navbar-links">
                <button onClick={() => handleScroll('history')} className="nav-link-btn">{t.nav.history}</button>
                <button onClick={() => handleScroll('members')} className="nav-link-btn">{t.nav.members}</button>
                <button onClick={() => handleScroll('projects')} className="nav-link-btn">{t.nav.projects}</button>
                <button onClick={() => handleScroll('gallery')} className="nav-link-btn">{t.nav.gallery}</button>
                <button onClick={() => handleScroll('contact')} className="nav-link-btn">{t.nav.contact}</button>
                <button onClick={() => handleScroll('donors')} className="nav-link-btn">{t.nav.donors}</button>
            </div>
            <div className="navbar-actions">
                <button className="lang-toggle" onClick={toggleLanguage}>
                    {language === 'en' ? 'HI' : 'EN'} / {language === 'en' ? 'EN' : 'HI'}
                </button>
                <Link to="/donate" className="donate-btn">{t.nav.donateNow}</Link>
                <Link to="/admin/login" className="admin-btn">Admin</Link>
            </div>
        </nav>
    );
};

export default Navbar;
