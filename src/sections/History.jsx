import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './History.css';

const History = () => {
    const { t } = useLanguage();

    return (
        <section id="history" className="history">
            <h2 className="section-title">{t.history.title}</h2>
            <div className="history-content">
                <p>
                    {t.history.content}
                </p>
            </div>
        </section>
    );
};

export default History;
