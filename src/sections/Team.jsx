import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Team.css';

const Team = () => {
    const { t } = useLanguage();
    const [founders, setFounders] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch('/api/members');
                const data = await response.json();
                const allMembers = data.data;
                setFounders(allMembers.filter(m => m.type === 'founder'));
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };
        fetchTeam();
    }, []);

    return (
        <section id="members" className="team">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Team</span>
                    <h2 className="section-title">{t.team.title}</h2>
                    <p className="section-subtitle">
                        Dedicated individuals working together to serve our community
                    </p>
                </div>

                <div className="team-grid">
                    {founders.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-image-wrapper">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="team-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="team-info">
                                <h3 className="team-name">{member.name}</h3>
                                <span className="team-role" style={{ color: member.color }}>
                                    {member.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
