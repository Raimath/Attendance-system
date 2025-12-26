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
                    {found && records.length > 0 && (
                        <div className="stats-grid mb-6 animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                            <div className="glass-panel stat-card" style={{ borderLeft: '3px solid var(--accent-color)', padding: '0.75rem 1rem', gap: '0.75rem' }}>
                                <div className="stat-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Σ</span>
                                </div>
                                <div>
                                    <p className="stat-label" style={{ fontSize: '0.75rem', marginBottom: '0' }}>Total</p>
                                    <h3 className="stat-value" style={{ fontSize: '1.2rem' }}>{records.length}</h3>
                                </div>
                            </div>

                            <div className="glass-panel stat-card" style={{ borderLeft: '3px solid var(--success)', padding: '0.75rem 1rem', gap: '0.75rem' }}>
                                <div className="stat-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>✓</span>
                                </div>
                                <div>
                                    <p className="stat-label" style={{ fontSize: '0.75rem', marginBottom: '0' }}>Present</p>
                                    <h3 className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--success)' }}>
                                        {records.filter(r => r.status === 'Present').length}
                                    </h3>
                                </div>
                            </div>

                            <div className="glass-panel stat-card" style={{ borderLeft: '3px solid var(--danger)', padding: '0.75rem 1rem', gap: '0.75rem' }}>
                                <div className="stat-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>✕</span>
                                </div>
                                <div>
                                    <p className="stat-label" style={{ fontSize: '0.75rem', marginBottom: '0' }}>Absent</p>
                                    <h3 className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>
                                        {records.filter(r => r.status === 'Absent').length}
                                    </h3>
                                </div>
                            </div>

                            <div className="glass-panel stat-card hide-on-mobile" style={{ borderLeft: '3px solid #f59e0b', padding: '0.75rem 1rem', gap: '0.75rem' }}>
                                <div className="stat-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>%</span>
                                </div>
                                <div>
                                    <p className="stat-label" style={{ fontSize: '0.75rem', marginBottom: '0' }}>Rate</p>
                                    <h3 className="stat-value" style={{ fontSize: '1.2rem' }}>
                                        {((records.filter(r => r.status === 'Present').length / records.length) * 100).toFixed(0)}%
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}
                    {found ? (
                        <div className="attendance-list-wrapper">
                            {/* Desktop Table */}
                            <div className="table-container hide-on-mobile">
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

                            {/* Mobile Card List */}
                            <div className="mobile-attendance-list">
                                {records.map(r => (
                                    <div key={r._id} className="attendance-card">
                                        <div className="attendance-card-inner" style={{ cursor: 'default' }}>
                                            <div className="card-info">
                                                <span className="card-roll">ROLL {r.student?.rollNo || 'N/A'}</span>
                                                <span className="card-name" title={r.student?.name}>{r.student?.name || 'Unknown'}</span>
                                            </div>
                                            <div className={`card-status-indicator ${r.status === 'Present' ? 'indicator-present' : 'indicator-absent'}`} style={{ cursor: 'default' }}>
                                                {r.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
