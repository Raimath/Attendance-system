import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    if (!user) return null;

    const activeTab = searchParams.get('tab') || 'take';
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleTabClick = (tabId) => {
        if (!isDashboard) {
            navigate(`/dashboard?tab=${tabId}`);
        } else {
            setSearchParams({ tab: tabId });
        }
        setIsMenuOpen(false);
    };

    const navItems = [
        { id: 'take', label: 'Take Attendance', icon: 'M9 11l3 3L22 4' },
        { id: 'view', label: 'View Records', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
        { id: 'students', label: 'Manage Students', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
        { id: 'export', label: 'Export Report', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }
    ];

    return (
        <>
            <nav className="glass-navbar">
                <div className="nav-container">
                    <div className="nav-brand" onClick={() => navigate('/dashboard')}>
                        <div className="nav-logo-icon">
                            A
                        </div>
                        <div>
                            <h1 className="nav-title">Attendance System</h1>
                            <p className="nav-subtitle">Faculty Portal</p>
                        </div>
                    </div>

                    {/* Desktop Controls */}
                    <div className="nav-controls-desktop nav-controls">
                        <div className="navbar-user-info nav-user-meta">
                            <p className="nav-username">{user?.username}</p>
                            <p className="nav-user-role">Administrator</p>
                        </div>

                        <div className="nav-actions">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="btn-logout"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <>
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
            <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
                <button
                    onClick={toggleMenu}
                    className="drawer-close-btn"
                    aria-label="Close Menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="drawer-header">
                    <div className="drawer-logo-icon">
                        A
                    </div>
                    <h2 className="drawer-user-name">{user?.username}</h2>
                    <p className="drawer-user-role">Administrator</p>
                </div>

                <div className="drawer-menu">
                    <p className="drawer-menu-label">Menu</p>

                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`drawer-item ${activeTab === item.id ? 'drawer-item-active' : ''}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`svg-opacity-transition ${activeTab === item.id ? 'svg-active' : 'svg-inactive'}`}>
                                <path d={item.icon === 'M9 11l3 3L22 4' ? "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" : (
                                    item.id === 'take' ? "M12 2v20m10-10H2" : "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                                )} />
                                {item.id === 'view' && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                                {item.id === 'students' && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>}
                                {item.id === 'export' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>}
                            </svg>
                            {item.label}
                        </button>
                    ))}

                    <hr className="drawer-divider" />

                    <div className="drawer-item justify-between">
                        <span>Theme Mode</span>
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="drawer-item drawer-logout"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
