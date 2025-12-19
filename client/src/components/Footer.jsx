import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <footer className="glass-footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <div className="footer-logo-icon">
                        A
                    </div>
                    <span className="footer-logo-text">
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
                <div className="flex gap-4">
                    <span>v1.2.4</span>
                    <span className="message-success font-500">Faculty Portal</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
