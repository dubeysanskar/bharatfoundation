import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Team.css';

const Team = () => {
    const { t } = useLanguage();
    const [founders, setFounders] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch('/api/members');
                const data = await response.json();
                const allMembers = data.data;
                setFounders(allMembers.filter(m => m.type === 'founder'));
                setMembers(allMembers.filter(m => m.type === 'member'));
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };
        fetchTeam();
    }, []);

    return (
        <section id="members" className="team">
            <h2 className="team-title">{t.team.title}</h2>

            {founders.length > 0 && (
                <>
                    <h3 className="sub-team-title">Founder Members</h3>
                    <div className="team-grid founders-grid">
                        {founders.map((member, index) => (
                            <div key={index} className="team-card">
                                <div className="member-avatar" style={{ borderColor: member.color }}>
                                    <img src={member.image} alt={`${member.name} - Bharat Foundation Volunteer`} loading="lazy" />
                                </div>
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-role" style={{ color: member.color }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {members.length > 0 && (
                <>
                    <h3 className="sub-team-title">Members</h3>
                    <div className="team-grid members-grid">
                        {members.map((member, index) => (
                            <div key={index} className="team-card small-card">
                                <div className="member-avatar small-avatar">
                                    <img src={member.image} alt={`${member.name} - Bharat Foundation Volunteer`} loading="lazy" />
                                </div>
                                <h3 className="member-name small-name">{member.name}</h3>
                                <p className="member-role small-role">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Team;
