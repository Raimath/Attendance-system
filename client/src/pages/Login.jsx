import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isRegistering) {
            result = await register(username, password);
        } else {
            result = await login(username, password);
        }

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel animate-fade-in auth-panel">
                <h2 className="auth-title">
                    {isRegistering ? 'Faculty Register' : 'Faculty Login'}
                </h2>

                {error && (
                    <div className="animate-fade-in error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary mt-4">
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="form-footer">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="link-btn"
                    >
                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                </div>
            </div>
            <div className="theme-toggle-fixed">
                <ThemeToggle />
            </div>
        </div>
    );
};

export default Login;
