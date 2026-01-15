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

// Comprehensive Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": "https://www.bharatfoundationprayagraj.com/#organization",
  "name": "Bharat Foundation",
  "alternateName": ["Bharat Foundation Prayagraj", "Bharat Foundation NGO", "Best NGO Prayagraj"],
  "url": "https://www.bharatfoundationprayagraj.com/",
  "logo": "https://www.bharatfoundationprayagraj.com/logo.jpeg",
  "image": "https://www.bharatfoundationprayagraj.com/logo.jpeg",
  "description": "Bharat Foundation is the best NGO in Prayagraj, Uttar Pradesh, India. We provide education, healthcare, and social welfare services to underprivileged communities.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bharat Foundation Office",
    "addressLocality": "Prayagraj",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "211001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.4358,
    "longitude": 81.8463
  },
  "areaServed": [
    { "@type": "City", "name": "Prayagraj" },
    { "@type": "City", "name": "Allahabad" },
    { "@type": "State", "name": "Uttar Pradesh" },
    { "@type": "Country", "name": "India" }
  ],
  "knowsAbout": ["Education", "Healthcare", "Social Welfare", "Community Development", "Charity", "Volunteer Work"],
  "slogan": "Empowering Lives Through Education & Care",
  "nonprofitStatus": "Registered NGO"
};

// FAQ Schema for Home Page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Bharat Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bharat Foundation is a registered NGO in Prayagraj, Uttar Pradesh, India. We work for education, healthcare, and social welfare of underprivileged communities."
      }
    },
    {
      "@type": "Question",
      "name": "How can I donate to Bharat Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can donate by clicking the 'Donate Now' button on our website at bharatfoundationprayagraj.com/donate. We accept various payment methods including UPI, cards, and net banking."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Bharat Foundation located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bharat Foundation is located in Prayagraj (formerly Allahabad), Uttar Pradesh, India. We serve communities across Prayagraj and surrounding areas."
      }
    },
    {
      "@type": "Question",
      "name": "How can I volunteer with Bharat Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can volunteer by contacting us through our website. We welcome volunteers for education programs, health camps, and community development activities."
      }
    },
    {
      "@type": "Question",
      "name": "Is Bharat Foundation the best NGO in Prayagraj?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bharat Foundation is recognized as one of the leading NGOs in Prayagraj, known for our transparent operations, impactful programs, and dedicated service to underprivileged communities."
      }
    }
  ]
};

// Breadcrumb Schema Generator
const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

const Home = () => (
  <>
    <SEO
      title="Bharat Foundation Prayagraj | Best NGO for Education & Social Welfare in India"
      description="Bharat Foundation is the best NGO in Prayagraj, Uttar Pradesh, India. We provide education, healthcare, and social welfare to underprivileged communities. Donate now or volunteer with us!"
      keywords="best NGO in Prayagraj, best NGO in Uttar Pradesh, best NGO in India, best NGO in world, NGO near me, NGO website, charity organization Prayagraj, education NGO India, healthcare charity UP, volunteer opportunities Prayagraj, donate to NGO India, Bharat Foundation, social welfare organization, non-profit organization Allahabad, charitable trust Prayagraj, best charity in UP, NGO for poor, help NGO, top NGO India, registered NGO Prayagraj, NGO for education, NGO for health, community development NGO, Prayagraj charity, Allahabad NGO"
      name="Bharat Foundation"
      type="website"
      canonical="https://www.bharatfoundationprayagraj.com/"
    />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          faqSchema,
          createBreadcrumbSchema([
            { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" }
          ])
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
      title="Donate to Best NGO in Prayagraj | Bharat Foundation"
      description="Donate to Bharat Foundation, the best NGO in Prayagraj, India. Your donation helps provide education, healthcare, and support to underprivileged communities. Tax-deductible donations accepted."
      keywords="donate to NGO, donate to charity India, charity donation Prayagraj, support NGO Prayagraj, tax deductible donation India, donate for education, donate for poor, best NGO to donate, online donation NGO, help underprivileged, donate to best NGO India, donation for social cause, contribute to charity"
      name="Bharat Foundation"
      type="website"
      canonical="https://www.bharatfoundationprayagraj.com/donate"
    />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DonateAction",
        "name": "Donate to Bharat Foundation",
        "description": "Support education, healthcare, and social welfare programs",
        "recipient": {
          "@type": "NGO",
          "name": "Bharat Foundation",
          "url": "https://www.bharatfoundationprayagraj.com/"
        },
        "potentialAction": {
          "@type": "DonateAction",
          "target": "https://www.bharatfoundationprayagraj.com/donate"
        }
      })}
    </script>
    <script type="application/ld+json">
      {JSON.stringify(createBreadcrumbSchema([
        { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" },
        { name: "Donate", url: "https://www.bharatfoundationprayagraj.com/donate" }
      ]))}
    </script>
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
      title="Gallery | Photos & Moments | Bharat Foundation Prayagraj"
      description="Explore the photo gallery of Bharat Foundation showcasing our impactful work in education, healthcare, and social welfare across Prayagraj and Uttar Pradesh."
      keywords="NGO gallery, Bharat Foundation photos, social work images, charity work photos Prayagraj, education program pictures, healthcare camp photos, NGO events gallery, community service photos"
      canonical="https://www.bharatfoundationprayagraj.com/gallery"
    />
    <script type="application/ld+json">
      {JSON.stringify(createBreadcrumbSchema([
        { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" },
        { name: "Gallery", url: "https://www.bharatfoundationprayagraj.com/gallery" }
      ]))}
    </script>
    <Gallery />
  </>
);

const ProjectDetailsPage = () => (
  <>
    <SEO
      title="Our Projects | Bharat Foundation Prayagraj"
      description="Learn about the impactful projects of Bharat Foundation in education, healthcare, and social welfare. See how we are making a difference in Prayagraj and beyond."
      keywords="NGO projects, education projects India, healthcare initiatives, social welfare programs, community development projects, Bharat Foundation projects"
      canonical="https://www.bharatfoundationprayagraj.com/projects"
    />
    <script type="application/ld+json">
      {JSON.stringify(createBreadcrumbSchema([
        { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" },
        { name: "Projects", url: "https://www.bharatfoundationprayagraj.com/projects" }
      ]))}
    </script>
    <ProjectDetails />
  </>
);

const VerifyDonationPage = () => (
  <>
    <SEO title="Verify Donation" noindex={true} />
    <VerifyDonation />
  </>
);

const PrivacyPolicyPage = () => (
  <>
    <SEO
      title="Privacy Policy | Bharat Foundation"
      description="Read the privacy policy of Bharat Foundation. Learn how we collect, use, and protect your personal information."
      keywords="privacy policy, Bharat Foundation privacy, NGO privacy policy, data protection"
      canonical="https://www.bharatfoundationprayagraj.com/privacy"
      noindex={false}
    />
    <script type="application/ld+json">
      {JSON.stringify(createBreadcrumbSchema([
        { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" },
        { name: "Privacy Policy", url: "https://www.bharatfoundationprayagraj.com/privacy" }
      ]))}
    </script>
    <PrivacyPolicy />
  </>
);

const TermsConditionsPage = () => (
  <>
    <SEO
      title="Terms & Conditions | Bharat Foundation"
      description="Read the terms and conditions of Bharat Foundation. Understand the rules and guidelines for using our website and services."
      keywords="terms and conditions, Bharat Foundation terms, NGO terms of service"
      canonical="https://www.bharatfoundationprayagraj.com/terms"
      noindex={false}
    />
    <script type="application/ld+json">
      {JSON.stringify(createBreadcrumbSchema([
        { name: "Home", url: "https://www.bharatfoundationprayagraj.com/" },
        { name: "Terms & Conditions", url: "https://www.bharatfoundationprayagraj.com/terms" }
      ]))}
    </script>
    <TermsConditions />
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
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsConditionsPage />} />
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
