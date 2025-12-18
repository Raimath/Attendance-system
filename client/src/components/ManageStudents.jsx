import { useState, useEffect } from 'react';
import axios from 'axios';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ name: '', rollNo: '', department: 'BCA', year: '1' });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get('/api/students');
            setStudents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`/api/students/${editingId}`, formData);
                setEditingId(null);
            } else {
                await axios.post('/api/students', formData);
            }
            setFormData({ ...formData, name: '', rollNo: '' }); // reset but keep dept/year
            fetchStudents();
        } catch (error) {
            alert(editingId ? 'Error updating student' : 'Error adding student');
        }
        setLoading(false);
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            rollNo: student.rollNo,
            department: student.department,
            year: student.year
        });
        setEditingId(student._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`/api/students/${id}`);
            fetchStudents();
        } catch (error) {
            alert('Error deleting student');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ ...formData, name: '', rollNo: '' });
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSubmit} className="grid-responsive grid-5" style={{ alignItems: 'end' }}>
                <div>
                    <label>Name</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" style={{ margin: 0 }} />
                </div>
                <div>
                    <label>Roll No</label>
                    <input value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} required placeholder="101" style={{ margin: 0 }} />
                </div>
                <div>
                    <label>Dept</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={{ margin: 0 }}>
                        <option value="BCA">BCA</option>
                        <option value="Bcom">Bcom</option>
                        <option value="Bsc">Bsc</option>
                        <option value="BBA">BBA</option>
                    </select>
                </div>
                <div>
                    <label>Year</label>
                    <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} style={{ margin: 0 }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '42px' }}>{editingId ? 'Update' : 'Add'}</button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} style={{ height: '42px', padding: '0 1rem', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    )}
                </div>
            </form>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Student List</h3>
            <div className="table-container" style={{ maxHeight: '400px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Year</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s._id}>
                                <td>{s.rollNo}</td>
                                <td>{s.name}</td>
                                <td>{s.department}</td>
                                <td>{s.year}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleEdit(s)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginRight: '1rem', fontWeight: '500' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No students found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;
