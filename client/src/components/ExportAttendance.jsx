import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ExportAttendance = () => {
    const [department, setDepartment] = useState('BCA');
    const [year, setYear] = useState('1');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/attendance/report?month=${month}&department=${department}&year=${year}`);

            if (data.length === 0) {
                alert('No data found for this selection.');
                setLoading(false);
                return;
            }

            // Prepare for Excel
            // Headers: Roll No, Name, 1, 2, 3, ... (days), Total Present, Total Absent
            const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();
            const daysHeader = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            const wsData = [
                ['Roll No', 'Name', ...daysHeader, 'Total Present', 'Total Absent']
            ];

            data.forEach(student => {
                const row = [
                    student.rollNo,
                    student.name,
                ];

                // Add daily status
                daysHeader.forEach(day => {
                    const status = student.attendance[day];
                    // Use short codes for excel: P, A, -
                    const code = status === 'Present' ? 'P' : (status === 'Absent' ? 'A' : '-');
                    row.push(code);
                });

                row.push(student.presentCount);
                row.push(student.absentCount);

                wsData.push(row);
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Styling (simple width adjustments)
            const wscols = [
                { wch: 10 }, // Roll No
                { wch: 20 }, // Name
                ...daysHeader.map(() => ({ wch: 3 })), // Days
                { wch: 12 }, // Total P
                { wch: 12 }  // Total A
            ];
            ws['!cols'] = wscols;

            XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
            XLSX.writeFile(wb, `Attendance_${department}_${year}_${month}.xlsx`);

        } catch (error) {
            console.error(error);
            alert('Failed to export data');
        }
        setLoading(false);
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Export Monthly Attendance</h3>
            <div className="grid-responsive grid-4" style={{ alignItems: 'end' }}>
                <div>
                    <label>Month</label>
                    <input
                        type="month"
                        value={month}
                        max={new Date().toISOString().slice(0, 7)}
                        onChange={e => setMonth(e.target.value)}
                        style={{ margin: 0 }}
                    />
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
                <button className="btn-primary" onClick={handleExport} disabled={loading} style={{ height: '42px', minWidth: '150px' }}>
                    {loading ? 'Exporting...' : 'Download Excel'}
                </button>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <p>Note: The exported Excel file will contain P (Present) and A (Absent) markers for each day of the selected month.</p>
            </div>
        </div>
    );
};

export default ExportAttendance;
