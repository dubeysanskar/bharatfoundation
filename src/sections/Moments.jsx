import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Moments.css';

const Moments = () => {
    const { t } = useLanguage();

    return (
        <section id="gallery" className="moments">
            <div className="container">
                <div className="moments-content">
                    <span className="section-label">Gallery</span>
                    <h2 className="moments-title">{t.moments.title}</h2>
                    <p className="moments-description">
                        Explore our journey and the impact we've created together through years of dedicated service.
                    </p>
                    <Link to="/gallery" className="btn btn-primary">
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Moments;
