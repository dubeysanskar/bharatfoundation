import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send message.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error sending message.');
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-bg-overlay"></div>
            <div className="contact-content-wrapper">
                <h2 className="section-title">{t.contact.title}</h2>

                <div className="contact-grid">
                    <div className="contact-info-card">
                        <h3>{t.contact.getInTouch}</h3>
                        <p className="contact-desc">
                            We'd love to hear from you. Whether you have a question about our projects,
                            want to volunteer, or just want to say hello, feel free to reach out.
                        </p>

                        <div className="info-item">
                            <span className="icon">📧</span>
                            <div className="details">
                                <h4>Email Us</h4>
                                <p>bharatfoundation4@gmail.com</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">📍</span>
                            <div className="details">
                                <h4>Visit Us</h4>
                                <p>173k/10, Purvanchal chauraha, 60 feet road, Rajrooppur, 211011</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">📞</span>
                            <div className="details">
                                <h4>Call Us</h4>
                                <p>+91 9911031689</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form-card" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder={t.contact.namePlaceholder}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder={t.contact.emailPlaceholder}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                placeholder={t.contact.messagePlaceholder}
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">
                            {t.contact.send}
                        </button>
                        {status && <p className="status-message">{status}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
