import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './History.css';

const History = () => {
    const { t } = useLanguage();

    return (
        <section id="history" className="history">
            <div className="container">
                <div className="history-grid">
                    <div className="history-content">
                        <span className="section-label">About Us</span>
                        <h2 className="history-title">{t.history.title}</h2>
                        <div className="history-text">
                            {t.history.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    <div className="history-stats">
                        <div className="stat-card">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">Years of Service</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Cattle Rescued</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Lives Touched</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default History;
