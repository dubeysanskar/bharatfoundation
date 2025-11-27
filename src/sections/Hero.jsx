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
                <div className="hero-cta">
                    <button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })} className="cta-button primary">
                        {t.hero.ourWork}
                    </button>
                    <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="cta-button secondary">
                        {t.hero.joinUs}
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
