import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Assuming server is running on port 5000, usually we set up a proxy in vite.config.js
            // For now I'll hardcode localhost:5000 if not proxy
            const { data } = await axios.post('/api/auth/login', { username, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true };
        } catch (error) {
            console.error('Login Error:', error);
            const message = error.response?.data?.message ||
                (error.request ? 'No response from server. Check your connection.' : 'Login failed');
            return {
                success: false,
                message: message
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const register = async (username, password) => {
        try {
            const { data } = await axios.post('/api/auth/register', { username, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true };
        } catch (error) {
            console.error('Registration Error:', error);
            const message = error.response?.data?.message ||
                (error.request ? 'No response from server. Check your connection.' : 'Registration failed');
            return {
                success: false,
                message: message
            };
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
