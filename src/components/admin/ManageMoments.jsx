import React, { useEffect, useState } from 'react';

const ManageMoments = () => {
    const [moments, setMoments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', color: '#fca311' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchMoments();
    }, []);

    const fetchMoments = async () => {
        const response = await fetch('/api/moments');
        const data = await response.json();
        setMoments(data.data);
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
            ? `/api/moments/${editId}`
            : '/api/moments';
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setFormData({ title: '', color: '#fca311' });
        setImageFile(null);
        setIsEditing(false);
        setEditId(null);
        fetchMoments();
    };

    const handleEdit = (moment) => {
        setFormData(moment);
        setEditId(moment.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this moment?')) {
            await fetch(`/api/moments/${id}`, { method: 'DELETE' });
            fetchMoments();
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Manage Moments of Impact</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#eee', borderRadius: '8px' }}>
                <h3>{isEditing ? 'Edit Moment' : 'Add New Moment'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="form-input" />
                    <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="form-input" style={{ height: '40px' }} />
                    <input type="file" onChange={e => setImageFile(e.target.files[0])} className="form-input" style={{ gridColumn: 'span 2' }} />
                </div>
                <button type="submit" className="add-btn" style={{ marginTop: '1rem' }}>{isEditing ? 'Update' : 'Add'} Moment</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', color: '#fca311' }); }} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {moments.map(m => (
                    <div key={m.id} style={{ background: m.color, padding: '1rem', borderRadius: '8px', color: 'white', position: 'relative' }}>
                        {m.image && <img src={m.image} alt={m.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />}
                        <h4 style={{ margin: 0 }}>{m.title}</h4>
                        <div style={{ marginTop: '1rem' }}>
                            <button className="action-btn" style={{ background: 'white', color: 'black' }} onClick={() => handleEdit(m)}>Edit</button>
                            <button className="action-btn delete-btn" onClick={() => handleDelete(m.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageMoments;
