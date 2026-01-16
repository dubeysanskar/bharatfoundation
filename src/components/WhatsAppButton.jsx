import React, { useState, useEffect } from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const phoneNumber = '919278206557';
    const message = 'Hello! I would like to know more about Bharat Foundation.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const [isVisible, setIsVisible] = useState(false);

    // Show button only after scrolling 350px
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 350);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`whatsapp-float ${isVisible ? 'visible' : ''}`}
            aria-label="Chat on WhatsApp"
        >
            <svg viewBox="0 0 32 32" className="whatsapp-icon">
                <path fill="#fff" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825.736 5.571 2.143 8l-2.143 8 8.286-2.143c2.357 1.357 5.071 2.143 8 2.143 8.837 0 16-7.163 16-16s-7.163-16-16-16zm8.214 22.857c-.357 1-2.071 1.929-2.857 2.036-.786.107-1.5.5-5.071-1.071-4.286-1.893-7-6.357-7.214-6.643-.214-.286-1.714-2.286-1.714-4.357s1.071-3.071 1.5-3.5c.357-.357.786-.5 1.071-.5.286 0 .5 0 .714.036.214.036.5-.071.786.607.286.679 1 2.393 1.071 2.571.071.179.143.393.036.607-.107.214-.179.357-.357.536-.179.179-.357.393-.5.536-.179.179-.357.357-.143.714.214.357.929 1.536 2 2.5 1.357 1.214 2.5 1.607 2.857 1.786.357.179.571.143.786-.071.214-.214.929-1.071 1.179-1.429.25-.357.5-.286.786-.179.286.107 1.857.857 2.179 1.036.321.179.536.25.607.393.071.143.071.821-.286 1.821z" />
            </svg>
            <span className="whatsapp-text">Chat with us</span>
        </a>
    );
};

export default WhatsAppButton;
