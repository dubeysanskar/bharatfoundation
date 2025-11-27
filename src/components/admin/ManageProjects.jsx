import React, { useEffect, useState } from 'react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.data);
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
            ? `/api/projects/${editId}`
            : '/api/projects';
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setFormData({ title: '', description: '' });
        setImageFile(null);
        setIsEditing(false);
        setEditId(null);
        fetchProjects();
    };

    const handleEdit = (project) => {
        setFormData(project);
        setEditId(project.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            fetchProjects();
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Manage Projects</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#eee', borderRadius: '8px' }}>
                <h3>{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="form-input" />
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" className="form-input" />
                    <input type="file" onChange={e => setImageFile(e.target.files[0])} className="form-input" />
                </div>
                <button type="submit" className="add-btn" style={{ marginTop: '1rem' }}>{isEditing ? 'Update' : 'Add'} Project</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '' }); }} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(p => (
                        <tr key={p.id}>
                            <td><img src={p.image} alt={p.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                            <td>{p.title}</td>
                            <td>{p.description}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProjects;
