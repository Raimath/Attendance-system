import { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceForm = () => {
    const [department, setDepartment] = useState('BCA');
    const [year, setYear] = useState('1');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Run both requests in parallel
            const [studentsRes, attendanceRes] = await Promise.all([
                axios.get(`/api/students?department=${department}&year=${year}`),
                axios.get(`/api/attendance?date=${date}&department=${department}&year=${year}`).catch(err => ({ data: null }))
            ]);

            const studentsData = studentsRes.data;
            setStudents(studentsData);

            const initialAttendance = {};

            // Default to Present
            studentsData.forEach(s => {
                initialAttendance[s._id] = 'Present';
            });

            // If we have existing records, override defaults
            if (attendanceRes.data && attendanceRes.data.records) {
                attendanceRes.data.records.forEach(r => {
                    // r.student might be populated object or id string depending on backend
                    const sId = r.student._id || r.student;
                    if (initialAttendance[sId] !== undefined) {
                        initialAttendance[sId] = r.status;
                    }
                });
                if (attendanceRes.data.records.length > 0) {
                    setMessage('Loaded existing attendance for this date.');
                    setTimeout(() => setMessage(''), 3000);
                }
            }

            setAttendance(initialAttendance);
        } catch (error) {
            console.error("Fetch Error:", error);
            if (error.code === 'ERR_NETWORK') {
                setMessage('Error: Cannot connect to server. Ensure backend is running.');
            } else {
                setMessage('Error fetching data.');
            }
        }
        setLoading(false);
    };

    // Load students when criteria changes
    useEffect(() => {
        // Debounce or just load? Manual load button is safer to avoid flashing, but useEffect is smoother.
        fetchStudents();
    }, [department, year, date]);

    const toggleStatus = (id) => {
        setAttendance(prev => ({
            ...prev,
            [id]: prev[id] === 'Present' ? 'Absent' : 'Present'
        }));
    };

    const handleSubmit = async () => {
        const presentCount = Object.values(attendance).filter(status => status === 'Present').length;
        const absentCount = Object.values(attendance).filter(status => status === 'Absent').length;
        const totalCount = Object.values(attendance).length;

        const confirmSubmit = window.confirm(
            `Attendance Summary:\n\n` +
            `Present: ${presentCount}\n` +
            `Absent: ${absentCount}\n` +
            `Total Students: ${totalCount}\n\n` +
            `Percentage: ${((presentCount / totalCount) * 100).toFixed(2)}%\n\n` +
            `Do you want to finalize and submit?`
        );

        if (!confirmSubmit) return;

        setLoading(true);
        setMessage('');
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                student: studentId,
                status
            }));

            await axios.post('/api/attendance', {
                date,
                department,
                year,
                records
            });
            setMessage(`Submitted! (${presentCount} Present)`);
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage('Failed to submit attendance.');
        }
        setLoading(false);
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <div className="grid-responsive grid-3" style={{ marginBottom: '2rem' }}>
                <div>
                    <label>Date</label>
                    <input type="date" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} style={{ margin: 0 }} />
                </div>
                <div>
                    <label>Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} style={{ margin: 0 }}>
                        <option value="BCA">BCA</option>
                        <option value="Bcom">Bcom</option>
                        <option value="Bsc">Bsc</option>
                        <option value="BBA">BBA</option>
                    </select>
                </div>
                <div>
                    <label>Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} style={{ margin: 0 }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    {students.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Roll No</th>
                                        <th>Name</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td>{student.rollNo}</td>
                                            <td>{student.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => toggleStatus(student._id)}
                                                    style={{
                                                        background: attendance[student._id] === 'Present' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                                        color: attendance[student._id] === 'Present' ? 'var(--success)' : 'var(--danger)',
                                                        border: '1px solid currentColor',
                                                        padding: '0.25rem 1rem',
                                                        borderRadius: '20px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        minWidth: '100px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {attendance[student._id]}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students found for this class.</p>
                    )}
                </>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                {message && <span style={{ marginRight: '1rem', color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)' }}>{message}</span>}
                <button className="btn-primary" onClick={handleSubmit} disabled={loading || students.length === 0} style={{ width: 'auto' }}>
                    Finalize Attendance
                </button>
            </div>
        </div>
    );
};

export default AttendanceForm;
