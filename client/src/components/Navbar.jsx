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
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}>
                            A
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Attendance System</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Faculty Portal</p>
                        </div>
                    </div>

                    {/* Desktop Controls */}
                    <div className="nav-controls-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="navbar-user-info" style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.95rem' }}>{user?.username}</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>Administrator</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: 'var(--danger)',
                                    border: '1px solid currentColor',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
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
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                    aria-label="Close Menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                        width: '60px',
                        height: '60px',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        margin: '0 auto 1rem',
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
                    }}>
                        A
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 0.25rem' }}>{user?.username}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Administrator</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</p>

                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className="drawer-item"
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer',
                                background: activeTab === item.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--glass-bg)',
                                color: activeTab === item.id ? 'var(--accent-color)' : 'var(--text-main)',
                                borderColor: activeTab === item.id ? 'var(--accent-color)' : 'var(--glass-border)',
                                borderLeftWidth: activeTab === item.id ? '4px' : '1px'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: activeTab === item.id ? 1 : 0.6 }}>
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

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />

                    <div className="drawer-item" style={{ justifyContent: 'space-between' }}>
                        <span>Theme Mode</span>
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="drawer-item"
                        style={{ width: '100%', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: '1rem' }}
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
