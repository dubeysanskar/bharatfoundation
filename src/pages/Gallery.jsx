import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Gallery.css';

const Gallery = () => {
    const { t } = useLanguage();
    const [moments, setMoments] = useState([]);

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await fetch('/api/moments');
                const data = await response.json();
                setMoments(data.data);
            } catch (error) {
                console.error('Error fetching moments:', error);
            }
        };
        fetchMoments();
    }, []);

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <span className="section-label">Gallery</span>
                <h1 className="gallery-title">{t.moments.title}</h1>
                <p className="gallery-subtitle">
                    Explore our journey and the impact we've created together through years of dedicated service.
                </p>
            </div>

            <div className="gallery-grid">
                {moments.map((moment, index) => (
                    <div key={index} className="gallery-card">
                        {moment.image ? (
                            <div className="gallery-image-wrapper">
                                <img
                                    src={moment.image}
                                    alt={moment.title || 'Bharat Foundation Moment'}
                                    loading="lazy"
                                    className="gallery-image"
                                />
                                {moment.title && (
                                    <div className="gallery-overlay">
                                        <h3 className="gallery-card-title">{moment.title}</h3>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="gallery-placeholder">
                                <span>{moment.title || 'Moment'}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {moments.length === 0 && (
                <div className="gallery-empty">
                    <p>No moments to display yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default Gallery;
