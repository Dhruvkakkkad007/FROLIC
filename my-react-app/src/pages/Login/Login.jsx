import { useState } from 'react';
import { Mail, Lock, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        EmailAddress: '',
        UserPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-dark to-dark">
            <div className="w-full max-w-md">
                <div className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to continue to Frolic.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={formData.EmailAddress}
                                    onChange={(e) => setFormData({ ...formData, EmailAddress: e.target.value })}
                                    placeholder="name@university.edu"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.UserPassword}
                                    onChange={(e) => setFormData({ ...formData, UserPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                <input type="checkbox" className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary hover:text-primary-light transition-colors">Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative my-10 flex items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Or continue with</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition-colors">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition-colors">
                            <Github size={18} />
                            GitHub
                        </button>
                    </div>

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Don't have an account? <Link to="#" className="text-primary font-semibold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
