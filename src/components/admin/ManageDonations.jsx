import React, { useEffect, useState } from 'react';

const ManageDonations = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        const response = await fetch('http://localhost:5000/api/admin/donors');
        const data = await response.json();
        setDonations(data.data);
    };

    const verifyDonation = async (id, currentStatus) => {
        const newStatus = currentStatus ? 0 : 1;
        await fetch(`http://localhost:5000/api/admin/donors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verified: newStatus })
        });
        fetchDonations();
    };

    const deleteDonation = async (id) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            await fetch(`http://localhost:5000/api/admin/donors/${id}`, {
                method: 'DELETE'
            });
            fetchDonations();
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Manage Donations</h2>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map(d => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>₹{d.amount}</td>
                            <td>{d.type}</td>
                            <td>{d.email}</td>
                            <td>
                                <span style={{ color: d.verified ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {d.verified ? 'Verified' : 'Pending'}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => deleteDonation(d.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDonations;
