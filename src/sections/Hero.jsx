import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const scrollToHistory = () => {
        const element = document.getElementById('history');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            {/* Animated Background Elements */}
            <div className="hero-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="hero-content">
                <div className="hero-badge">
                    🙏 Non-Profit Organization
                </div>
                <h1 className="hero-title">
                    <span className="title-main">Bharat Foundation</span>
                    <span className="title-sub">{t.hero.title}</span>
                </h1>
                <p className="hero-subtitle">
                    {t.hero.subtitle}
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary hero-btn" onClick={() => navigate('/donate')}>
                        {t.hero.donateToday}
                    </button>
                    <button className="btn btn-secondary hero-btn" onClick={scrollToHistory}>
                        {t.hero.knowMore}
                    </button>
                </div>
            </div>

            <div className="hero-scroll">
                <span>Scroll Down</span>
                <div className="scroll-arrow">↓</div>
            </div>
        </section>
    );
};

export default Hero;
