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
            <h2 className="projects-title">{t.projects.title}</h2>

            <div className="projects-grid">
                {projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}></div>
                        <div className="project-content">
                            <h3 className="project-name">{project.title}</h3>
                            <p className="project-desc">{project.description}</p>
                            <button className="project-btn" onClick={() => navigate('/donate')}>Donate to the Cause</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
