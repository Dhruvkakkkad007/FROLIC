import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/#events' },
        { name: 'Rules', path: '/#rules' },
        { name: 'FAQs', path: '/#faqs' },
        { name: 'Facilities', path: '/#facilities' },
        { name: 'Contact Us', path: '/#contact' },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', path: '/admin/dashboard' },
        { name: 'Participants', path: '/admin/participants' },
        { name: 'Departments', path: '/admin/manage?tab=departments' },
        { name: 'Events', path: '/admin/manage?tab=events' },
        { name: 'Institute', path: '/admin/manage?tab=institutes' },
        { name: 'ManageAll', path: '/admin/manage' },
    ];

    const isAdminPath = location.pathname.startsWith('/admin');
    const currentLinks = (user?.isAdmin && isAdminPath) ? adminLinks : navLinks;

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' && !location.hash;
        if (path.startsWith('/#')) return location.hash === path.substring(1);
        if (path.includes('?')) return (location.pathname + location.search).includes(path);
        // Special case for ManageAll to not be active when a specific tab is selected
        if (path === '/admin/manage') return location.pathname === path && !location.search;
        return location.pathname === path;
    };

    const handleNavLinkClick = (e, path) => {
        if (path === '/' || path.startsWith('/#')) {
            const id = path === '/' ? 'home' : path.substring(2);
            if (location.pathname === '/') {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (path.startsWith('/#')) {
                setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
            setIsOpen(false);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center h-full">
                <Link to={user?.isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-2 group">

                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                        <Rocket className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">
                        Frolic<span className="text-primary">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {currentLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={(e) => handleNavLinkClick(e, link.path)}
                            className={`text-sm font-medium transition-colors hover:text-primary ${
                                isActive(link.path) ? 'text-primary' : 'text-gray-300'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Admin Dropdown - Only for Admins (hidden when already on admin side) */}
                    {user?.isAdmin && !isAdminPath && (
                        <div className="relative group">
                            <button
                                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-primary transition-colors"
                                onClick={() => setIsAdminOpen(!isAdminOpen)}
                                onMouseEnter={() => setIsAdminOpen(true)}
                            >
                                Admin <ChevronDown size={14} className={`transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute top-full right-0 mt-2 w-48 glass-dark rounded-2xl border border-white/10 p-2 transition-all duration-300 origin-top-right ${isAdminOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                                onMouseLeave={() => setIsAdminOpen(false)}
                            >
                                {adminLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                        onClick={() => setIsAdminOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 group px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <User size={16} className="text-primary" />
                                <span className="text-xs font-bold text-white">{user.UserName}</span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary scale-90">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass-dark animate-in fade-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col p-6 gap-4">
                        {user && (
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-2">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                    <User className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{user.UserName}</p>
                                    <p className="text-gray-400 text-xs">{user.EmailAddress}</p>
                                </div>
                            </div>
                        )}

                        {currentLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => handleNavLinkClick(e, link.path)}
                                className={`text-lg font-medium ${isActive(link.path) ? 'text-primary' : 'text-gray-300'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Admin Section (hidden when already on admin side) */}
                        {user?.isAdmin && !isAdminPath && (
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Administration</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {adminLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className="text-gray-300 hover:text-primary transition-colors pl-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user ? (
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="btn-primary text-center mt-6 flex items-center justify-center gap-2"
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-primary text-center mt-6"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
