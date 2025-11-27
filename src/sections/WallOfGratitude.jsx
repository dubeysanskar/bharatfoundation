import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WallOfGratitude.css';

const WallOfGratitude = () => {
    const { t } = useLanguage();
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/donors');
                const data = await response.json();
                setDonors(data.data);
            } catch (error) {
                console.error('Error fetching donors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
        // Poll every 10 seconds to update list
        const interval = setInterval(fetchDonors, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="donors" className="wall-of-gratitude">
            <h2 className="wall-title">{t.wall.title}</h2>
            <p className="wall-subtitle">{t.wall.subtitle}</p>

            <div className="donor-list-container">
                {loading ? (
                    <div className="donor-list-placeholder">
                        {t.wall.loading}
                    </div>
                ) : donors.length > 0 ? (
                    <div className="donor-marquee">
                        <div className="marquee-content">
                            {donors.map((donor, index) => (
                                <span key={index} className="donor-item">
                                    {donor.name} (₹{donor.amount})
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="donor-list-placeholder">
                        Be the first to donate!
                    </div>
                )}
            </div>
        </section>
    );
};

export default WallOfGratitude;
