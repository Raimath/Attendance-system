import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceView from '../components/AttendanceView';
import ExportAttendance from '../components/ExportAttendance';
import ManageStudents from '../components/ManageStudents';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'take';

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    return (
        <div className="dashboard-layout">
            <div className="tabs hide-on-mobile">
                <button
                    className={`tab-btn ${activeTab === 'take' ? 'active' : ''}`}
                    onClick={() => setActiveTab('take')}
                >
                    Take Attendance
                </button>
                <button
                    className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
                    onClick={() => setActiveTab('view')}
                >
                    View Records
                </button>
                <button
                    className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('students')}
                >
                    Manage Students
                </button>
                <button
                    className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                    onClick={() => setActiveTab('export')}
                >
                    Export Report
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'take' && <AttendanceForm />}
                {activeTab === 'view' && <AttendanceView />}
                {activeTab === 'students' && <ManageStudents />}
                {activeTab === 'export' && <ExportAttendance />}
            </div>
        </div>
    );
};

export default Dashboard;
