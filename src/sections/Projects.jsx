import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Projects.css';

const Projects = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section id="projects" className="projects">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">What We Do</span>
                    <h2 className="section-title">{t.projects.title}</h2>
                    <p className="section-subtitle">
                        Our ongoing initiatives to serve the community
                    </p>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div
                                className="project-image"
                                style={{ backgroundImage: `url(${project.image})` }}
                            >
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                <div className="project-buttons">
                                    <button
                                        className="btn btn-secondary project-read-more"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        Read More
                                    </button>
                                    <button
                                        className="btn btn-primary project-donate"
                                        onClick={() => { window.scrollTo(0, 0); navigate('/donate'); }}
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
