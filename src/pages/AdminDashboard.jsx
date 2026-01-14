import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Sub-components for managing sections (will implement next)
import ManageMembers from '../components/admin/ManageMembers';
import ManageProjects from '../components/admin/ManageProjects';
import ManageMoments from '../components/admin/ManageMoments';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('members');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false); // Close menu on tab change for mobile
    };

    return (
        <div className="admin-dashboard">
            <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <h2>Admin Panel</h2>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
                <nav>
                    <button className={activeTab === 'members' ? 'active' : ''} onClick={() => handleTabChange('members')}>Members</button>
                    <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => handleTabChange('projects')}>Projects</button>
                    <button className={activeTab === 'moments' ? 'active' : ''} onClick={() => handleTabChange('moments')}>Moments</button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </aside>
            <main className="content">
                {activeTab === 'members' && <ManageMembers />}
                {activeTab === 'projects' && <ManageProjects />}
                {activeTab === 'moments' && <ManageMoments />}
            </main>
        </div>
    );
};

export default AdminDashboard;
