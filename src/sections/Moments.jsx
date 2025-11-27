import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Moments.css';

const Moments = () => {
    const { t } = useLanguage();
    const [moments, setMoments] = useState([]);

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/moments');
                const data = await response.json();
                setMoments(data.data);
            } catch (error) {
                console.error('Error fetching moments:', error);
            }
        };
        fetchMoments();
    }, []);

    return (
        <section id="gallery" className="moments">
            <h2 className="moments-title">{t.moments.title}</h2>
            <div className="moments-grid">
                {moments.map((moment, index) => (
                    <div
                        key={index}
                        className="moment-card"
                        style={{ backgroundColor: moment.color }}
                    >
                        {moment.image && <img src={moment.image} alt={moment.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} />}
                        <h3>{moment.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Moments;
