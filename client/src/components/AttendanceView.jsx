import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const AttendanceView = () => {
    const [department, setDepartment] = useState('BCA');
    const [year, setYear] = useState('1');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/attendance?date=${date}&department=${department}&year=${year}`);
            if (data && data.records) {
                setRecords(data.records);
                setFound(true);
            } else {
                setRecords([]);
                setFound(false);
            }
        } catch (error) {
            setRecords([]);
            setFound(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAttendance();
    }, [date, department, year]);

    return (
        <div className="glass-panel animate-fade-in panel-padding">
            <div className="grid-responsive grid-3 mb-8">
                <div>
                    <label>Date</label>
                    <input type="date" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="m-0" />
                </div>
                <div>
                    <label>Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="m-0">
                        <option value="BCA">BCA</option>
                        <option value="Bcom">Bcom</option>
                        <option value="Bsc">Bsc</option>
                        <option value="BBA">BBA</option>
                    </select>
                </div>
                <div>
                    <label>Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="m-0">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>

            {loading ? <LoadingSpinner message="Searching records..." /> : (
                <>
                    {found ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Roll No</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map(r => (
                                        <tr key={r._id}>
                                            <td>{r.student?.rollNo || 'N/A'}</td>
                                            <td>{r.student?.name || 'Unknown'}</td>
                                            <td>
                                                <span className={`status-badge ${r.status.toLowerCase()}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            No attendance records found for this date.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AttendanceView;
