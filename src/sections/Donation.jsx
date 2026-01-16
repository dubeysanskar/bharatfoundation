import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Donation.css';

const Donation = () => {
    const { t } = useLanguage();

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        citizenship: 'indian',
        want80G: false,
        panCard: '',
        donationType: 'once',
        title: 'Mr',
        fullName: '',
        dob: '',
        email: '',
        mobile: '',
        agreeTerms: false,
        address: '',
        pinCode: '',
        state: '',
        city: '',
        donateAnonymously: false
    });

    // Captcha state
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
    const [captchaError, setCaptchaError] = useState('');

    // UI state
    const [status, setStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showPayment, setShowPayment] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate captcha on mount
    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setCaptcha({ num1, num2, answer: '' });
        setCaptchaError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCaptchaChange = (e) => {
        setCaptcha(prev => ({ ...prev, answer: e.target.value }));
        setCaptchaError('');
    };

    const validateForm = () => {
        // Check captcha
        const correctAnswer = captcha.num1 + captcha.num2;
        if (parseInt(captcha.answer) !== correctAnswer) {
            setCaptchaError('Incorrect answer. Please try again.');
            generateCaptcha();
            return false;
        }

        // Check terms
        if (!formData.agreeTerms) {
            setStatus('Please agree to the Terms and Conditions.');
            return false;
        }

        // Check required fields
        if (!formData.fullName || !formData.mobile || !formData.amount) {
            setStatus('Please fill all required fields.');
            return false;
        }

        // Check PAN if 80G selected
        if (formData.want80G && formData.citizenship === 'indian' && !formData.panCard) {
            setStatus('PAN Card is required for 80G certificate.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setStatus('Processing your donation...');

        try {
            const response = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setStatus('Thank you! Your donation details have been submitted.');
                setShowPayment(true);
                // Scroll to top when showing payment
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setStatus(data.error || 'Failed to process donation. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error processing donation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Foreign national message
    if (formData.citizenship === 'foreign' && showPayment) {
        return (
            <section id="donate" className="donation">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Support Us</span>
                        <h2 className="section-title">Donate to Bharat Foundation</h2>
                    </div>

                    <div className="foreign-donor-message">
                        <div className="message-card">
                            <div className="message-icon">🌍</div>
                            <h3>Thank You for Your Interest!</h3>
                            <p>
                                Thank you for your interest in the Bharat Foundation.
                                For international donations, kindly send an email to us with your details.
                            </p>
                            <div className="contact-info">
                                <p><strong>📧 Email:</strong> bharatfoundation4@gmail.com</p>
                                <p><strong>📞 Phone/WhatsApp:</strong> +91 9911031689</p>
                            </div>
                            <p className="note">Our team will get back to you with the donation process for foreign nationals.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => { setShowPayment(false); setStatus(''); }}
                            >
                                ← Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="donate" className="donation">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Support Us</span>
                    <h2 className="section-title">{t.donation?.title || 'Donate to Bharat Foundation'}</h2>
                    <p className="section-subtitle">
                        Your contribution helps us continue our mission of serving the community
                    </p>
                </div>

                {!showPayment ? (
                    <div className="donation-form-container">
                        <form className="donation-form" onSubmit={handleSubmit}>
                            {/* Donation Amount */}
                            <div className="form-section">
                                <h3 className="form-section-title">Donation Amount</h3>
                                <div className="form-group">
                                    <label>Amount (₹) *</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Enter donation amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Citizenship Selection */}
                            <div className="form-section">
                                <h3 className="form-section-title">Select Your Citizenship</h3>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="citizenship"
                                            value="indian"
                                            checked={formData.citizenship === 'indian'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-custom"></span>
                                        Indian Citizen
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="citizenship"
                                            value="foreign"
                                            checked={formData.citizenship === 'foreign'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-custom"></span>
                                        Foreign National
                                    </label>
                                </div>
                            </div>

                            {/* 80G Section - Only for Indian Citizens */}
                            {formData.citizenship === 'indian' && (
                                <div className="form-section tax-section">
                                    <h3 className="form-section-title">Avail Tax Exemption under Section 80G</h3>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="want80G"
                                                checked={formData.want80G}
                                                onChange={handleChange}
                                            />
                                            <span className="checkbox-custom"></span>
                                            I would like to receive 80(G) Certificate
                                        </label>
                                    </div>

                                    {formData.want80G && (
                                        <div className="pan-section">
                                            <div className="form-group">
                                                <label>PAN Card No. *</label>
                                                <input
                                                    type="text"
                                                    name="panCard"
                                                    placeholder="Enter your PAN number"
                                                    value={formData.panCard}
                                                    onChange={handleChange}
                                                    maxLength="10"
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                                <small className="help-text">
                                                    To get the 80-G certificate, please enter your PAN number
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Donation Type */}
                            <div className="form-section">
                                <h3 className="form-section-title">Select Donation Type (Optional)</h3>
                                <div className="radio-group horizontal">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="donationType"
                                            value="once"
                                            checked={formData.donationType === 'once'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-custom"></span>
                                        Donate Once
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="donationType"
                                            value="monthly"
                                            checked={formData.donationType === 'monthly'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-custom"></span>
                                        Donate Monthly
                                    </label>
                                </div>
                            </div>

                            {/* Donor Details */}
                            <div className="form-section">
                                <h3 className="form-section-title">Donor Details</h3>

                                {/* Anonymous Donation Option */}
                                <div className="anonymous-option">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="donateAnonymously"
                                            checked={formData.donateAnonymously}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-custom"></span>
                                        I wish to donate anonymously
                                    </label>
                                    <small className="help-text">Your name will not be displayed publicly</small>
                                </div>

                                <div className="form-row">
                                    <div className="form-group small">
                                        <label>Title</label>
                                        <select
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                        >
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>
                                    <div className="form-group large">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>



                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your email address (optional)"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number *</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Your mobile number"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section - Only for 80G */}
                            {formData.want80G && formData.citizenship === 'indian' && (
                                <div className="form-section">
                                    <h3 className="form-section-title">Address (Required for 80G)</h3>

                                    <div className="form-group">
                                        <label>Address *</label>
                                        <textarea
                                            name="address"
                                            placeholder="Enter your full address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Pin Code *</label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                placeholder="PIN Code"
                                                value={formData.pinCode}
                                                onChange={handleChange}
                                                maxLength="6"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                placeholder="State"
                                                value={formData.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Captcha */}
                            <div className="form-section captcha-section">
                                <h3 className="form-section-title">Security Verification</h3>
                                <div className="captcha-container">
                                    <div className="captcha-question">
                                        <span className="captcha-num">{captcha.num1}</span>
                                        <span className="captcha-operator">+</span>
                                        <span className="captcha-num">{captcha.num2}</span>
                                        <span className="captcha-equals">=</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="captcha-input"
                                        placeholder="?"
                                        value={captcha.answer}
                                        onChange={handleCaptchaChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="captcha-refresh"
                                        onClick={generateCaptcha}
                                    >
                                        ↻
                                    </button>
                                </div>
                                {captchaError && <p className="error-text">{captchaError}</p>}
                            </div>

                            {/* Terms Agreement */}
                            <div className="form-section terms-section">
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="checkbox-custom"></span>
                                        I have read through the website's <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> & <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> to make a donation.
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary donate-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                            </button>

                            {status && <p className={`form-status ${status.includes('Thank') ? 'success' : 'error'}`}>{status}</p>}
                        </form>
                    </div>
                ) : (
                    /* Payment Gateway UI */
                    <div className="payment-gateway-container">
                        <div className="payment-success-header">
                            <div className="success-icon">✓</div>
                            <h3>Donation Details Submitted!</h3>
                            <p>Please complete your payment of <strong>₹{formData.amount}</strong> using one of the methods below.</p>
                        </div>

                        <div className="payment-info-card">
                            <div className="payment-tabs">
                                <button
                                    className={`tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('upi')}
                                >
                                    UPI
                                </button>
                                <button
                                    className={`tab-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('bank')}
                                >
                                    Bank Transfer
                                </button>
                            </div>

                            {paymentMethod === 'upi' && (
                                <div className="payment-content">
                                    <h4>Scan to Donate via UPI</h4>
                                    <div className="qr-container">
                                        <img
                                            src="/assets/donors/bfqr.jpeg"
                                            alt="Bharat Foundation UPI QR Code"
                                            className="qr-image"
                                        />
                                    </div>
                                    <p className="upi-id">
                                        <strong>UPI ID:</strong> bharatfoundation@upi
                                    </p>
                                    <p className="payment-note">
                                        Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                                    </p>
                                </div>
                            )}

                            {paymentMethod === 'bank' && (
                                <div className="payment-content">
                                    <h4>Bank Transfer Details</h4>
                                    <div className="bank-details">
                                        <div className="detail-row">
                                            <span className="label">Bank Name</span>
                                            <span className="value">Punjab National Bank</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Account Name</span>
                                            <span className="value">Bharat Foundation</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Account No</span>
                                            <span className="value">3913002100009042</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">IFSC Code</span>
                                            <span className="value">PUNB0391300</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Branch</span>
                                            <span className="value">Prayagraj</span>
                                        </div>
                                    </div>
                                    <p className="payment-note">
                                        Please mention your name in the transaction remarks for reference.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="payment-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setShowPayment(false); setStatus(''); }}
                            >
                                ← Back to Form
                            </button>
                            <a
                                href="/"
                                className="btn btn-primary"
                            >
                                Return to Home
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Donation;
