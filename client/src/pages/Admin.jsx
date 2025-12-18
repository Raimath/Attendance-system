import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', password: '' });

    // Admin Login State
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/auth/users');
            setUsers(data);
        } catch (error) {
            setMessage('Failed to load users');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAdminLoggedIn) {
            fetchUsers();
        }
    }, [isAdminLoggedIn]);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminCreds.username === 'admin' && adminCreds.password === 'admin@123') {
            setIsAdminLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('Invalid Administrator Credentials');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
        try {
            await axios.delete(`/api/auth/users/${id}`);
            setMessage('User deleted successfully');
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete user');
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setEditForm({ username: user.username, password: user.password });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                username: editForm.username,
                password: editForm.password
            };

            await axios.put(`/api/auth/users/${editingUser._id}`, payload);
            setMessage('User updated successfully');
            setEditingUser(null);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update user');
        }
    };

    if (!isAdminLoggedIn) {
        return (
            <div className="auth-container">
                <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
                        Admin Portal
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Please enter master credentials to access management.
                    </p>

                    {loginError && (
                        <div style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin}>
                        <div>
                            <label>Admin Username</label>
                            <input
                                type="text"
                                value={adminCreds.username}
                                onChange={(e) => setAdminCreds({ ...adminCreds, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Admin Password</label>
                            <input
                                type="password"
                                value={adminCreds.password}
                                onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                            Unlock Management
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>User Management</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Authorized Admin Access</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {message && <span style={{ marginRight: '1rem', color: message.includes('failed') ? 'var(--danger)' : 'var(--success)', fontWeight: '500' }}>{message}</span>}
                        <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Lock</button>
                    </div>
                </div>

                {editingUser ? (
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Edit Faculty: {editingUser.username}</h3>
                        <form onSubmit={handleUpdate} className="grid-responsive grid-3" style={{ alignItems: 'end' }}>
                            <div>
                                <label>Username</label>
                                <input
                                    value={editForm.username}
                                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                    required
                                    style={{ margin: 0 }}
                                />
                            </div>
                            <div>
                                <label>Password (Plain Text)</label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                    required
                                    style={{ margin: 0 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn-primary" style={{ height: '42px' }}>Save Changes</button>
                                <button type="button" onClick={() => setEditingUser(null)} style={{ height: '42px', padding: '0 1rem', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : null}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Faculty Username</th>
                                <th>Plain Text Password</th>
                                <th>Role</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: '600' }}>{u.username}</td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                        {u.password}
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: 'var(--accent-color)',
                                            textTransform: 'uppercase',
                                            fontWeight: '600'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => startEdit(u)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginRight: '1rem', fontWeight: '600' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Fetching users...</p>}
                {!loading && users.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No faculty accounts found.</p>}
            </div>
        </div>
    );
};

export default Admin;
