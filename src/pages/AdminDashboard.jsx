import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Sub-components for managing sections (will implement next)
import ManageDonations from '../components/admin/ManageDonations';
import ManageMembers from '../components/admin/ManageMembers';
import ManageProjects from '../components/admin/ManageProjects';
import ManageMoments from '../components/admin/ManageMoments';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('donations');

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

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>Admin Panel</h2>
                <nav>
                    <button className={activeTab === 'donations' ? 'active' : ''} onClick={() => setActiveTab('donations')}>Donations</button>
                    <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>Members</button>
                    <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects</button>
                    <button className={activeTab === 'moments' ? 'active' : ''} onClick={() => setActiveTab('moments')}>Moments</button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </aside>
            <main className="content">
                {activeTab === 'donations' && <ManageDonations />}
                {activeTab === 'members' && <ManageMembers />}
                {activeTab === 'projects' && <ManageProjects />}
                {activeTab === 'moments' && <ManageMoments />}
            </main>
        </div>
    );
};

export default AdminDashboard;
