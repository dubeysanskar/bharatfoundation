import React, { useEffect, useState } from 'react';

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', type: 'member', description: '', color: '#000000' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.image;

        if (imageFile) {
            const uploadData = new FormData();
            uploadData.append('image', imageFile);
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const uploadJson = await uploadRes.json();
            if (uploadJson.success) {
                imageUrl = uploadJson.imageUrl;
            }
        }

        const payload = { ...formData, image: imageUrl };
        const url = isEditing
            ? `/api/members/${editId}`
            : '/api/members';
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setFormData({ name: '', role: '', type: 'member', description: '', color: '#000000' });
        setImageFile(null);
        setIsEditing(false);
        setEditId(null);
        fetchMembers();
    };

    const handleEdit = (member) => {
        setFormData(member);
        setEditId(member.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this member?')) {
            await fetch(`/api/members/${id}`, { method: 'DELETE' });
            fetchMembers();
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Manage Team Members</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#eee', borderRadius: '8px' }}>
                <h3>{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
                    <input placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required className="form-input" />
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="form-input">
                        <option value="member">Member</option>
                        <option value="founder">Founder</option>
                    </select>
                    <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="form-input" style={{ height: '40px' }} />
                    <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" style={{ gridColumn: 'span 2' }} />
                    <input type="file" onChange={e => setImageFile(e.target.files[0])} className="form-input" style={{ gridColumn: 'span 2' }} />
                </div>
                <button type="submit" className="add-btn" style={{ marginTop: '1rem' }}>{isEditing ? 'Update' : 'Add'} Member</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', role: '', type: 'member', description: '', color: '#000000' }); }} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m.id}>
                            <td><img src={m.image} alt={m.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} /></td>
                            <td>{m.name}</td>
                            <td>{m.role}</td>
                            <td>{m.type}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleEdit(m)}>Edit</button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(m.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageMembers;
