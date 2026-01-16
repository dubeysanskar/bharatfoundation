import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './History.css';

const History = () => {
    const { t } = useLanguage();

    const aboutContent = `We are a newly established non-governmental organization committed to serving society with compassion, responsibility, and dedication. Our goal is to protect cultural values, promote social welfare, and support meaningful causes that bring long-term positive change to communities.

Our current initiative, Kishori Gau Shala, focuses on the care, protection, and well-being of cows by providing safe shelter, proper nutrition, and medical support. In the coming years, we plan to establish a Shiv Mandir that will serve as a spiritual and community space, encouraging faith, unity, and cultural preservation.

Looking toward the future, we aim to extend our efforts to support underprivileged children, especially in the areas of education, nutrition, and basic care. Through collective efforts and community support, we strive to create a more compassionate and inclusive society.`;

    return (
        <section id="history" className="history">
            <div className="container">
                <div className="history-content-wrapper">
                    <span className="section-label">About Us</span>
                    <h2 className="history-title">{t.history.title}</h2>
                    <div className="history-text">
                        {aboutContent.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default History;
