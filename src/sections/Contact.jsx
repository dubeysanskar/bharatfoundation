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
        <section id="contact" className="contact">
            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <span className="section-label">Contact</span>
                        <h2 className="contact-title">{t.contact.title}</h2>
                        <p className="contact-description">
                            Have questions or want to get involved? Reach out to us and we'll respond as soon as possible.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">📍</div>
                                <div>
                                    <h4>Address</h4>
                                    <p>Prayagraj, Uttar Pradesh, India</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📧</div>
                                <div>
                                    <h4>Email</h4>
                                    <p>bharatfoundation4@gmail.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📞</div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+91 9911031689</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Name</label>
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
                                <label>Email Address</label>
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
                                <label>Your Message</label>
                                <textarea
                                    name="message"
                                    placeholder={t.contact.msgPlaceholder}
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary submit-btn">
                                {t.contact.send}
                            </button>
                            {status && <p className="form-status">{status}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
