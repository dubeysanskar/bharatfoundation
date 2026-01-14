import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';
import logo from '../assets/logo.jpeg';

const Navbar = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Check if we're on admin pages
    const isAdminPage = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollTo = (id) => {
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

    // Don't render navbar on admin pages
    if (isAdminPage) {
        return null;
    }

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="Bharat Foundation" className="navbar-logo" />
                    <span className="navbar-title">
                        <span className="title-accent">Bharat</span> Foundation
                    </span>
                </Link>

                <div className="navbar-menu">
                    <button onClick={() => handleScrollTo('history')} className="nav-link">
                        {t.nav.history}
                    </button>
                    <button onClick={() => handleScrollTo('members')} className="nav-link">
                        {t.nav.members}
                    </button>
                    <button onClick={() => handleScrollTo('projects')} className="nav-link">
                        {t.nav.projects}
                    </button>
                    <button onClick={() => handleScrollTo('gallery')} className="nav-link">
                        {t.nav.gallery}
                    </button>
                    <button onClick={() => handleScrollTo('contact')} className="nav-link">
                        {t.nav.contact}
                    </button>
                </div>

                <div className="navbar-actions">
                    <button className="lang-btn" onClick={toggleLanguage}>
                        {language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}
                    </button>
                    <Link to="/donate" className="btn btn-primary donate-nav-btn">
                        {t.nav.donateNow}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
