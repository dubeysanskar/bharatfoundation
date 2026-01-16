import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);
                const data = await response.json();
                // API returns {data: project} or {error: ...}
                if (data.data) {
                    setProject(data.data);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="project-details-loading">
                <div className="loader"></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-error">
                <h2>Project Not Found</h2>
                <p>The project you're looking for doesn't exist.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go Back Home
                </button>
            </div>
        );
    }

    // Default extended content if no long_description exists
    const getExtendedContent = () => {
        if (project.long_description) {
            return project.long_description;
        }

        // Default content based on project title
        if (project.title.toLowerCase().includes('gaushala')) {
            return `Our Gaushala Seva project is dedicated to providing a safe sanctuary for abandoned and 
injured cows in and around Prayagraj. We believe in the sacred duty of protecting these gentle 
creatures that have served humanity for millennia.

At our Gaushala, we currently care for over 50 rescued cattle, providing them with nutritious 
food, clean water, medical care, and a loving environment. Our dedicated team of volunteers 
works tirelessly to ensure that every animal receives the attention and care they deserve.

The Gaushala operates on a sustainable model where we produce organic manure and engage in 
small-scale dairy operations to support our running costs. We also conduct regular health 
camps and have tie-ups with veterinary doctors for emergency medical needs.

Your generous donations help us expand our facilities, improve medical infrastructure, and 
rescue more cattle in need. Together, we can protect and serve these sacred animals while 
preserving our cultural heritage.`;
        }

        if (project.title.toLowerCase().includes('mandir') || project.title.toLowerCase().includes('shiv')) {
            return `The Shiv Mandir Construction project is our flagship initiative to build a magnificent 
spiritual center for the community of Prayagraj. This temple will serve as a beacon of 
faith, culture, and community gathering for generations to come.

Our vision is to create not just a temple, but a complete spiritual complex that includes 
meditation halls, a community kitchen (langar), educational facilities for Sanskrit and 
religious studies, and spaces for cultural events. The architecture draws inspiration from 
ancient temple designs while incorporating modern construction techniques for durability.

The construction is being carried out in phases, with the main sanctum sanctorum and the 
outer mandap already in progress. We are using high-quality materials including marble, 
sandstone, and traditional brass work to ensure the temple stands the test of time.

We invite devotees and well-wishers to be part of this divine endeavor. Your contributions 
will directly support the construction work, procurement of divine idols, and the finishing 
touches that will make this temple a jewel of Prayagraj.`;
        }

        // Generic default content
        return `This project is one of our key initiatives at Bharat Foundation, designed to create 
meaningful impact in the lives of people across Prayagraj and surrounding areas.

Our dedicated team of volunteers and staff work tirelessly to ensure the success of this 
project. We believe in transparency, accountability, and community participation in all 
our endeavors.

With your support, we have been able to make significant progress. However, there is still 
much work to be done. Every contribution, no matter how small, helps us move closer to our 
goals and extends our reach to those in need.

Join us in this journey of service and compassion. Together, we can build a better tomorrow 
for our community.`;
    };

    return (
        <div className="project-details">
            <div className="project-details-hero" style={{ backgroundImage: `url(${project.image})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <span className="project-badge">Our Project</span>
                    <h1 className="project-title">{project.title}</h1>
                </div>
            </div>

            <div className="project-details-content">
                <div className="content-container">
                    <div className="project-main">
                        <section className="project-section">
                            <h2>About This Project</h2>
                            <p className="project-intro">{project.description}</p>
                        </section>

                        <section className="project-section">
                            <h2>Our Mission</h2>
                            <div className="project-long-content">
                                {getExtendedContent().split('\n\n').map((para, index) => (
                                    <p key={index}>{para}</p>
                                ))}
                            </div>
                        </section>


                    </div>

                    <aside className="project-sidebar">
                        <div className="donate-card">
                            <h3>Support This Project</h3>
                            <p>Your donation helps us continue this important work.</p>
                            <button
                                className="btn btn-primary donate-btn"
                                onClick={() => { window.scrollTo(0, 0); navigate('/donate'); }}
                            >
                                Donate Now
                            </button>
                        </div>

                        <div className="contact-card">
                            <h3>Get Involved</h3>
                            <p>Want to volunteer or learn more?</p>
                            <p className="contact-email">📧 bharatfoundation4@gmail.com</p>
                            <p className="contact-phone">📞 +91 9911031689</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
