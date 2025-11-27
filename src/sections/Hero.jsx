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

    const navigateToDonate = () => {
        navigate('/donate');
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="title-orange">Bharat Foundation:</span> {t.hero.title}
                </h1>
                <p className="hero-subtitle">
                    {t.hero.subtitle}
                </p>
                <div className="hero-buttons">
                    <button className="btn-primary" onClick={scrollToHistory}>
                        {t.hero.knowMore}
                    </button>
                    <button className="btn-secondary" onClick={navigateToDonate}>
                        {t.hero.donateToday}
                    </button>
                </div>
            </div>
            <div className="hero-background-text">
                {t.hero.bgText}
            </div>
        </section>
    );
};

export default Hero;
