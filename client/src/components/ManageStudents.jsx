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
        <div className="glass-panel animate-fade-in panel-padding">
            <h3 className="mb-4">{editingId ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSubmit} className="grid-responsive grid-5 items-end">
                <div>
                    <label>Name</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" className="m-0" />
                </div>
                <div>
                    <label>Roll No</label>
                    <input value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} required placeholder="101" className="m-0" />
                </div>
                <div>
                    <label>Dept</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="m-0">
                        <option value="BCA">BCA</option>
                        <option value="Bcom">Bcom</option>
                        <option value="Bsc">Bsc</option>
                        <option value="BBA">BBA</option>
                    </select>
                </div>
                <div>
                    <label>Year</label>
                    <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="m-0">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="btn-primary h-42" disabled={loading}>{editingId ? 'Update' : 'Add'}</button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="btn-outline h-42">Cancel</button>
                    )}
                </div>
            </form>

            <h3 className="mt-8 mb-4">Student List</h3>
            <div className="table-container max-h-400">
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Year</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s._id}>
                                <td>{s.rollNo}</td>
                                <td>{s.name}</td>
                                <td>{s.department}</td>
                                <td>{s.year}</td>
                                <td className="text-right">
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="btn-action btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        className="btn-action btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && <tr><td colSpan="5" className="text-center">No students found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;
