import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <footer className="glass-footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>
                        A
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        Attendance System
                    </span>
                </div>

                <div className="footer-links">
                    <a href="#" className="footer-link">Support</a>
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Contact Us</a>
                </div>
            </div>

            <div className="footer-bottom">
                <div>
                    &copy; {new Date().getFullYear()} Rehemat Ali. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>v1.2.4</span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: '500' }}>Faculty Portal</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
