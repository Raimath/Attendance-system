import { useState, useRef } from 'react';

const StudentAttendanceItem = ({ student, status, onToggle }) => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const cardRef = useRef(null);

    const threshold = 100; // px to trigger action

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
        if (!isSwiping) return;
        const diff = e.touches[0].clientX - startX;
        // Limit swipe range
        if (Math.abs(diff) < 150) {
            setCurrentX(diff);
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (currentX > threshold) {
            // Swiped Right -> Present (if not already?)
            if (status !== 'Present') onToggle(student._id, 'Present');
        } else if (currentX < -threshold) {
            // Swiped Left -> Absent
            if (status !== 'Absent') onToggle(student._id, 'Absent');
        }
        setCurrentX(0);
    };

    return (
        <div className="attendance-card">
            <div className="swipe-actions">
                <div className="action-present" style={{
                    opacity: currentX > 0 ? Math.min(currentX / threshold, 1) : 0,
                    transform: `scale(${currentX > 0 ? Math.min(0.5 + currentX / (threshold * 2), 1.2) : 0.5})`
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ marginLeft: '10px' }}>PRESENT</span>
                </div>
                <div className="action-absent" style={{
                    opacity: currentX < 0 ? Math.min(Math.abs(currentX) / threshold, 1) : 0,
                    transform: `scale(${currentX < 0 ? Math.min(0.5 + Math.abs(currentX) / (threshold * 2), 1.2) : 0.5})`
                }}>
                    <span style={{ marginRight: '10px' }}>ABSENT</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div
                className="attendance-card-inner"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(${currentX}px)`,
                    borderColor: currentX > threshold ? 'var(--success)' : (currentX < -threshold ? 'var(--danger)' : 'transparent'),
                }}
            >
                <div className="card-info">
                    <span className="card-roll">ROLL {student.rollNo}</span>
                    <span className="card-name" title={student.name}>{student.name}</span>
                </div>
                <button
                    className={`card-status-indicator ${status === 'Present' ? 'indicator-present' : 'indicator-absent'}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent potential swipe triggers
                        onToggle(student._id);
                    }}
                >
                    {status}
                </button>
            </div>
        </div>
    );
};

export default StudentAttendanceItem;
