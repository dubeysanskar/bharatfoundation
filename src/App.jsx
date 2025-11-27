import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('./sections/Hero'));
const History = lazy(() => import('./sections/History'));
const WallOfGratitude = lazy(() => import('./sections/WallOfGratitude'));
const Moments = lazy(() => import('./sections/Moments'));
const Projects = lazy(() => import('./sections/Projects'));
const Team = lazy(() => import('./sections/Team'));
const Donation = lazy(() => import('./sections/Donation'));
const Contact = lazy(() => import('./sections/Contact'));

const LoadingFallback = () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

const Home = () => (
  <Suspense fallback={<LoadingFallback />}>
    <SEO
      title="Bharat Foundation Prayagraj | Empowering Lives & Education"
      description="Bharat Foundation in Prayagraj is a leading NGO dedicated to education, healthcare, and social welfare. Join us in making a difference today."
      keywords="Bharat Foundation, Bharat Foundation Prayagraj, Bharat Foundation NGO Prayagraj, NGO in Prayagraj, Charity in Prayagraj, Best NGO for education in Prayagraj, Donate to charity in Prayagraj, Volunteer opportunities in Prayagraj NGO"
      name="Bharat Foundation"
      type="website"
      canonical="https://bharatfoundation.in/"
    />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NGO",
            "name": "Bharat Foundation",
            "url": "https://bharatfoundation.in/",
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
    <WallOfGratitude />
    <Moments />
    <Contact />
  </Suspense>
);

const DonationPage = () => (
  <div style={{ paddingTop: '2rem', minHeight: '80vh' }}>
    <SEO
      title="Donate | Bharat Foundation Prayagraj"
      description="Support our cause. Donate to Bharat Foundation Prayagraj and help us provide education and healthcare to the underprivileged."
      keywords="Donate to Bharat Foundation, Charity Donation Prayagraj, Support NGO Prayagraj"
      name="Bharat Foundation"
      type="website"
      canonical="https://bharatfoundation.in/donate"
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
