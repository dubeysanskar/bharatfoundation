import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import History from './sections/History';
import WallOfGratitude from './sections/WallOfGratitude';
import Moments from './sections/Moments';
import Projects from './sections/Projects';
import Team from './sections/Team';
import Donation from './sections/Donation';
import Contact from './sections/Contact';
import VerifyDonation from './pages/VerifyDonation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import SEO from './components/SEO';

const Home = () => (
  <>
    <SEO
      title="Bharat Foundation Prayagraj | Empowering Lives & Education"
      description="Bharat Foundation in Prayagraj is a leading NGO dedicated to education, healthcare, and social welfare. Join us in making a difference today."
      name="Bharat Foundation"
      type="website"
    />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Bharat Foundation",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Prayagraj",
          "addressLocality": "Prayagraj",
          "addressRegion": "UP",
          "postalCode": "211001",
          "addressCountry": "IN"
        },
        "url": "https://bharatfoundationprayagraj.org",
        "telephone": "+91-XXXXXXXXXX"
      })}
    </script>
    <Hero />
    <History />
    <Team />
    <Projects />
    <WallOfGratitude />
    <Moments />
    <Contact />
  </>
);

const DonationPage = () => (
  <div style={{ paddingTop: '2rem', minHeight: '80vh' }}>
    <SEO
      title="Donate | Bharat Foundation Prayagraj"
      description="Support our cause. Donate to Bharat Foundation Prayagraj and help us provide education and healthcare to the underprivileged."
      name="Bharat Foundation"
      type="website"
    />
    <Donation />
  </div>
);

const AdminLoginPage = () => (
  <>
    <SEO title="Admin Login" noindex={true} />
    <AdminLogin />
  </>
);

const AdminDashboardPage = () => (
  <>
    <SEO title="Admin Dashboard" noindex={true} />
    <AdminDashboard />
  </>
);

const VerifyDonationPage = () => (
  <>
    <SEO title="Verify Donation" noindex={true} />
    <VerifyDonation />
  </>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/verify/:id" element={<VerifyDonationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
