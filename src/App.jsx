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

const Home = () => (
  <>
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
    <Donation />
  </div>
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
            <Route path="/verify/:id" element={<VerifyDonation />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
