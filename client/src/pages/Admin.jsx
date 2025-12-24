import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const ap = "admin@123";
    const au = "admin";
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', password: '' });
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);

    // Admin Login State
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const apass = ap;
    const auser = au;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/auth/users');
            setUsers(data);
        } catch (error) {
            setMessage('Failed to load users');
        }
        setLoading(false);
    };

    const fetchLogs = async () => {
        setLogsLoading(true);
        try {
            const { data } = await axios.get('/api/attendance/logs');
            setAttendanceLogs(data);
        } catch (error) {
            console.error('Failed to load logs', error);
        }
        setLogsLoading(false);
    };

    useEffect(() => {
        if (isAdminLoggedIn) {
            fetchUsers();
            fetchLogs();
        }
    }, [isAdminLoggedIn]);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminCreds.username === auser && adminCreds.password === apass) {
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
                <div className="glass-panel animate-fade-in auth-panel">
                    <h2 className="auth-title">
                        Admin Portal
                    </h2>
                    <p className="text-center mb-8 text-muted message-text">
                        Please enter master credentials to access management.
                    </p>

                    {loginError && (
                        <div className="error-message">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin}>
                        <div>
                            <label className="form-label">Admin Username</label>
                            <input
                                type="text"
                                value={adminCreds.username}
                                onChange={(e) => setAdminCreds({ ...adminCreds, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Admin Password</label>
                            <input
                                type="password"
                                value={adminCreds.password}
                                onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary mt-4">
                            Unlock Management
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <div className="glass-panel animate-fade-in panel-padding">
                <div className="section-header">
                    <div>
                        <h2 className="nav-title font-bold text-lg">User Management</h2>
                        <p className="nav-subtitle">Authorized Admin Access</p>
                    </div>
                    <div className="text-right">
                        {message && (
                            <span className={`message-text font-500 mr-4 ${message.includes('failed') ? 'message-danger' : 'message-success'}`}>
                                {message}
                            </span>
                        )}
                        <button onClick={() => setIsAdminLoggedIn(false)} className="btn-danger-light">Lock</button>
                    </div>
                </div>

                {editingUser && (
                    <div className="glass-panel edit-panel">
                        <h3 className="mb-4">Edit Faculty: {editingUser.username}</h3>
                        <form onSubmit={handleUpdate} className="grid-responsive grid-3 items-end">
                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    value={editForm.username}
                                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                    required
                                    className="m-0"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password (Plain Text)</label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                    required
                                    className="m-0"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="btn-primary h-42">Save Changes</button>
                                <button type="button" onClick={() => setEditingUser(null)} className="btn-outline h-42">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Faculty Username</th>
                                <th>Plain Text Password</th>
                                <th>Role</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td className="font-600">{u.username}</td>
                                    <td className="font-monospace message-success font-bold">
                                        {u.password}
                                    </td>
                                    <td>
                                        <span className="badge badge-accent">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => startEdit(u)}
                                            className="btn-action btn-edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="btn-action btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && <LoadingSpinner message="Fetching users..." />}
                {!loading && users.length === 0 && <p className="empty-state">No faculty accounts found.</p>}

                {/* Attendance Logs Section */}
                <div className="mt-12">
                    <div className="section-header">
                        <div>
                            <h2 className="nav-title font-bold text-lg">Marking Activity</h2>
                            <p className="nav-subtitle">Who marked attendance and when</p>
                        </div>
                        <button onClick={fetchLogs} className="btn-outline" style={{ padding: '0.4rem 1rem' }}>Refresh Logs</button>
                    </div>

                    <div className="table-container mt-4">
                        <table>
                            <thead>
                                <tr>
                                    <th>Attendance Date</th>
                                    <th>Class</th>
                                    <th>Faculty Name</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceLogs.map(log => (
                                    <tr key={log._id}>
                                        <td className="font-600">{new Date(log.date).toLocaleDateString()}</td>
                                        <td>
                                            {log.department} - Year {log.year}
                                        </td>
                                        <td>
                                            <span className="badge badge-primary" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.3rem 0.6rem' }}>
                                                {log.faculty?.username || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            {log.lastUpdated
                                                ? new Date(log.lastUpdated).toLocaleString()
                                                : 'No tracking data'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {logsLoading && <LoadingSpinner message="Updating logs..." />}
                    {!logsLoading && attendanceLogs.length === 0 && <p className="empty-state">No attendance activity recorded yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Admin;
