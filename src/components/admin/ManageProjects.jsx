import React, { useState, useEffect } from 'react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        long_description: '',
        image: null
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data.data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('long_description', formData.long_description);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formDataToSend
            });
            const data = await response.json();
            if (data.success) {
                fetchProjects();
                setFormData({ title: '', description: '', long_description: '', image: null });
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Manage Projects</h2>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3>Add New Project</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Short Description (for cards)"
                        className="form-input"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Long Description for Project Page (3-4 paragraphs, use empty lines to separate)"
                        className="form-input"
                        rows="8"
                        value={formData.long_description}
                        onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                        style={{ resize: 'vertical' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                    <button type="submit" className="add-btn">Add Project</button>
                </form>
            )}

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
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </td>
                            <td>{project.title}</td>
                            <td>{project.description?.substring(0, 50)}...</td>
                            <td>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(project.id)}
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

export default ManageProjects;
