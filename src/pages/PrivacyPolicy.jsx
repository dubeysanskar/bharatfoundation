import React, { useEffect } from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page">
            <div className="policy-container">
                <h1>Privacy Policy</h1>
                <p className="effective-date">Effective from: January 2024</p>

                <p className="intro">
                    This website is owned and operated by Bharat Foundation. We recognize that visitors
                    to our site may be concerned about the information they provide to us and how we
                    treat that information. Bharat Foundation is committed to ensuring that your privacy
                    is protected.
                </p>

                <section>
                    <h2>Contact Information</h2>
                    <p>If you have any questions about our Privacy Policy, you may contact us at:</p>
                    <div className="contact-box">
                        <p><strong>Bharat Foundation</strong></p>
                        <p>Prayagraj, Uttar Pradesh, India</p>
                        <p>📧 Email: bharatfoundation4@gmail.com</p>
                        <p>📞 Phone: +91 9911031689</p>
                    </div>
                </section>

                <section>
                    <h2>Personal Information</h2>
                    <p>
                        Bharat Foundation uses its best efforts to respect the privacy of its online
                        visitors. At our site, we do not collect personally identifiable information
                        from individuals unless they provide it to us voluntarily and knowingly.
                    </p>
                    <p>
                        We only gather personally identifiable data such as names, addresses, email
                        addresses, phone numbers, etc., when voluntarily submitted by a visitor. This
                        information is used to process donations and communicate with donors.
                    </p>
                    <p>
                        <strong>Bharat Foundation does not sell or trade donor information to third
                            parties.</strong> We will not share personally identifiable information unless
                        authorized by the person submitting the information or required by law.
                    </p>
                </section>

                <section>
                    <h2>Donation Information Security</h2>
                    <p>
                        We take the security of your information seriously. All donation transactions
                        are processed through secure payment gateways. We do not store credit card or
                        banking information on our servers.
                    </p>
                    <p>
                        For offline donations, you may contact us directly via phone or email.
                    </p>
                </section>

                <section>
                    <h2>Donations</h2>
                    <p>
                        We request information from visitors on our donation form including contact
                        information (name, email, address) and payment details. This information is
                        used for:
                    </p>
                    <ul>
                        <li>Processing and acknowledging donations</li>
                        <li>Issuing 80G tax exemption certificates (for eligible Indian donors)</li>
                        <li>Sending updates about our work and impact</li>
                        <li>Contacting donors if there are issues with their donation</li>
                    </ul>
                    <p>
                        We offer donors the option to donate anonymously. If selected, your name will
                        not be displayed publicly.
                    </p>
                </section>

                <section>
                    <h2>Communication Preferences</h2>
                    <p>
                        If you provide us with your email address, you may receive periodic updates
                        about our programs and activities. If you do not wish to receive such
                        communications, please contact us at bharatfoundation4@gmail.com.
                    </p>
                </section>

                <section>
                    <h2>Cookies</h2>
                    <p>
                        Our website may use cookies to improve your browsing experience. Cookies are
                        small text files that help us recognize repeat visitors. You can configure
                        your browser to reject cookies if you prefer.
                    </p>
                </section>

                <section>
                    <h2>External Links</h2>
                    <p>
                        This website may contain links to other sites. Bharat Foundation is not
                        responsible for the privacy practices of other websites. We encourage you to
                        read the privacy policies of any external sites you visit.
                    </p>
                </section>

                <section>
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. Any changes will be
                        posted on this page. We encourage you to review this policy periodically.
                    </p>
                </section>

                <div className="back-link">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
