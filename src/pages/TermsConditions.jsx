import React, { useEffect } from 'react';
import './PolicyPages.css';

const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page">
            <div className="policy-container">
                <h1>Terms and Conditions</h1>
                <p className="effective-date">Effective from: January 2024</p>

                <p className="intro">
                    Bharat Foundation takes your privacy seriously and treats all financial
                    information about any transaction you have with the Foundation as highly
                    confidential. The Foundation deeply values all contributions to sustain our mission.
                </p>

                <section>
                    <h2>Donor Privacy</h2>
                    <p>To protect the privacy of our donors, we maintain the following policies:</p>
                    <ul>
                        <li>We collect personal information only for the purpose of accepting and processing donations</li>
                        <li>We will not release or use this information for any other purpose without your consent</li>
                        <li>We do not trade or sell your personal information with other organizations</li>
                        <li>We offer donors the option to be recognized anonymously</li>
                        <li>Donors may request at any time to not receive our communications</li>
                    </ul>
                </section>

                <section>
                    <h2>Donation Terms</h2>
                    <ul>
                        <li>All donations are voluntary contributions to support Bharat Foundation's charitable activities</li>
                        <li>Donations are used to fund our ongoing projects and operational costs</li>
                        <li>Indian citizens are eligible for 80G tax exemption certificates upon request</li>
                        <li>For 80G certificates, valid PAN card details are required</li>
                        <li>Monthly donations continue until cancelled by the donor</li>
                    </ul>
                </section>

                <section>
                    <h2>Data Security</h2>
                    <p>
                        Personal data collected through our website is handled with appropriate
                        security measures. We use secure payment gateways for processing donations
                        and do not store sensitive financial information on our servers.
                    </p>
                </section>

                <section>
                    <h2>Donor Rights</h2>
                    <p>As a donor, you have the right to:</p>
                    <ul>
                        <li>Be informed of the Foundation's mission and how donations are used</li>
                        <li>Receive appropriate acknowledgment and receipts for donations</li>
                        <li>Request information about the Foundation's activities</li>
                        <li>Have your information handled with respect and confidentiality</li>
                        <li>Ask questions and receive prompt, truthful answers</li>
                        <li>Request to have your name removed from mailing lists</li>
                    </ul>
                </section>

                <section>
                    <h2>Refund Policy</h2>
                    <p>
                        Bharat Foundation follows a fair refund policy. In case of an erroneous
                        deduction or if a donor wants to cancel their donation:
                    </p>
                    <ul>
                        <li>Contact us within 7 days of the donation with proof of transaction</li>
                        <li>Refunds will be processed within 7-10 working days</li>
                        <li>If a tax exemption certificate has already been issued, refund may not be possible</li>
                        <li>International donations may require additional processing time</li>
                    </ul>
                </section>

                <section>
                    <h2>Use of Donations</h2>
                    <p>
                        Donations are used to support Bharat Foundation's charitable activities
                        including but not limited to:
                    </p>
                    <ul>
                        <li>Community development projects</li>
                        <li>Educational initiatives</li>
                        <li>Social welfare programs</li>
                        <li>Operational and administrative costs</li>
                    </ul>
                    <p>
                        In case of excess funds for a specific project, remaining funds may be
                        redirected to other Foundation activities.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>For any questions about these terms or your donations, please contact:</p>
                    <div className="contact-box">
                        <p><strong>Bharat Foundation</strong></p>
                        <p>📧 Email: bharatfoundation4@gmail.com</p>
                        <p>📞 Phone/WhatsApp: +91 9911031689</p>
                    </div>
                </section>

                <div className="back-link">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
