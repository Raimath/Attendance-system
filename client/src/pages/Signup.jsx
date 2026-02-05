import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await register(username, password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {isLoading && (
                <LoadingSpinner
                    fullPage
                    message="Creating your account..."
                />
            )}
            <div className="glass-panel animate-fade-in auth-panel">
                <h2 className="auth-title">
                    Faculty Register
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
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-4"
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </form>

                <div className="form-footer">
                    <Link
                        to="/login"
                        className="link-btn"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>
            <div className="theme-toggle-fixed">
                <ThemeToggle />
            </div>
        </div>
    );
};

export default Signup;
