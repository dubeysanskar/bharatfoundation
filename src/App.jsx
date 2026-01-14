import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import History from './sections/History';

import Moments from './sections/Moments';
import Projects from './sections/Projects';
import Team from './sections/Team';
import Donation from './sections/Donation';
import Contact from './sections/Contact';
import VerifyDonation from './pages/VerifyDonation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Gallery from './pages/Gallery';
import ProjectDetails from './pages/ProjectDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

import SEO from './components/SEO';

const Home = () => (
  <>
    <SEO
      title="Bharat Foundation Prayagraj | Empowering Lives & Education"
      description="Bharat Foundation in Prayagraj is a leading NGO dedicated to education, healthcare, and social welfare. Join us in making a difference today."
      keywords="Bharat Foundation, Bharat Foundation Prayagraj, Bharat Foundation NGO Prayagraj, NGO in Prayagraj, Charity in Prayagraj, Best NGO for education in Prayagraj, Donate to charity in Prayagraj, Volunteer opportunities in Prayagraj NGO"
      name="Bharat Foundation"
      type="website"
      canonical="https://www.bharatfoundationprayagraj.com/"
    />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NGO",
            "name": "Bharat Foundation",
            "url": "https://www.bharatfoundationprayagraj.com/",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Bharat Foundation Office",
              "addressLocality": "Prayagraj",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "211001",
              "addressCountry": "IN"
            },
            "telephone": "+91-XXXXXXXXXX",
            "areaServed": "Prayagraj",
            "description": "Bharat Foundation is an NGO in Prayagraj working in education, health, and social welfare for underprivileged communities."
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How can I donate to Bharat Foundation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can donate by clicking the 'Donate Now' button on our website. We accept various payment methods to support our cause."
                }
              },
              {
                "@type": "Question",
                "name": "Where is Bharat Foundation located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bharat Foundation is located in Prayagraj, Uttar Pradesh, India."
                }
              },
              {
                "@type": "Question",
                "name": "How can I volunteer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Please visit our Contact page or call us to learn about volunteer opportunities in Prayagraj."
                }
              }
            ]
          }
        ]
      })}
    </script>
    <Hero />
    <History />
    <Team />
    <Projects />

    <Moments />
    <Contact />
  </>
);

const DonationPage = () => (
  <div style={{ paddingTop: '2rem', minHeight: '80vh' }}>
    <SEO
      title="Donate | Bharat Foundation Prayagraj"
      description="Support our cause. Donate to Bharat Foundation Prayagraj and help us provide education and healthcare to the underprivileged."
      keywords="Donate to Bharat Foundation, Charity Donation Prayagraj, Support NGO Prayagraj"
      name="Bharat Foundation"
      type="website"
      canonical="https://www.bharatfoundationprayagraj.com/donate"
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

const GalleryPage = () => (
  <>
    <SEO
      title="Gallery | Bharat Foundation Prayagraj"
      description="Explore our moments of impact and the journey of Bharat Foundation."
    />
    <Gallery />
  </>
);

const ProjectDetailsPage = () => (
  <>
    <SEO
      title="Project Details | Bharat Foundation Prayagraj"
      description="Learn more about our projects and how you can contribute."
    />
    <ProjectDetails />
  </>
);

const VerifyDonationPage = () => (
  <>
    <SEO title="Verify Donation" noindex={true} />
    <VerifyDonation />
  </>
);

// Layout component that conditionally renders Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/verify/:id" element={<VerifyDonationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppLayout />
      </Router>
    </LanguageProvider>
  );
}

export default App;

