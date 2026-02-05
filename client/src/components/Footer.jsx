import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
                <div className="footer-info">
                    <p>This website is designed and developed by Department of Computer Applications.</p>
                    <p>Copyright &copy; {new Date().getFullYear()} <Link to="https://github.com/Raimath" target='_blank'>Rehamath Ali </Link>. All rights reserved.</p>
                </div>
                <div className="footer-meta">
                    <div className="flex gap-4">
                        <span>v1.2.4</span>
                        <span className="message-success font-500">Faculty Portal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
