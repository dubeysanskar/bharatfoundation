import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
    const heroImageRef = useRef(null);

    // Rotating mottos
    const mottos = [
        "A Legacy of Service",
        "Serving with Compassion",
        "Empowering Communities"
    ];

    // Rotate mottos every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMottoIndex((prev) => (prev + 1) % mottos.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [mottos.length]);

    // Scroll opacity effect - decrease to 80%
    useEffect(() => {
        const handleScroll = () => {
            if (heroImageRef.current) {
                const scrollY = window.scrollY;
                const maxScroll = 300; // Full effect at 300px scroll
                const minOpacity = 0.5; // Minimum 50% opacity

                const progress = Math.min(scrollY / maxScroll, 1);
                const opacity = 1 - (progress * (1 - minOpacity));

                heroImageRef.current.style.opacity = opacity;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToHistory = () => {
        const element = document.getElementById('history');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <section className="hero">
                {/* Floating Circles Background */}
                <div className="hero-circles">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                    <div className="circle circle-4"></div>
                    <div className="circle circle-5"></div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="title-main">Bharat Foundation</span>
                        <span className="title-animated" key={currentMottoIndex}>
                            {mottos[currentMottoIndex]}
                        </span>
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
            </section>

            {/* Hero Image with Scroll Opacity Effect */}
            <div className="hero-image-section">
                <img
                    ref={heroImageRef}
                    src="/herow.png"
                    alt="Bharat Foundation"
                    className="hero-image"
                />
                <div className="hero-image-overlay"></div>
            </div>
        </>
    );
};

export default Hero;
