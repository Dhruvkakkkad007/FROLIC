import { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    Layers,
    Calendar,
    MapPin,
    TrendingUp,
    Plus,
    Clock,
    LayoutDashboard,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { instituteService, departmentService, eventService, participantService } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalInstitutes: 0,
        totalDepartments: 0,
        totalEvents: 0,
        totalParticipants: 0,
        location: 'Darshan University',
        dates: '22-24 March 2025'
    });
    const [loading, setLoading] = useState(true);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [newLocation, setNewLocation] = useState(stats.location);
    const [newDates, setNewDates] = useState(stats.dates);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [insts, depts, evts, parts] = await Promise.all([
                    instituteService.getAll(),
                    departmentService.getAll(),
                    eventService.getAll(),
                    participantService.getAll()
                ]);

                setStats(prev => ({
                    ...prev,
                    totalInstitutes: insts.length,
                    totalDepartments: depts.length,
                    totalEvents: evts.length,
                    totalParticipants: parts.length
                }));
                // setNewLocation(insts.length > 0 ? insts[0].InstituteName : stats.location); // Removed auto-overwrite
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleUpdateLocation = () => {
        setStats(prev => ({ ...prev, location: newLocation, dates: newDates }));
        setIsEditingLocation(false);
        // In a real app, this would call an API to save global settings
        alert("Location and Dates updated successfully!");
    };

    const statCards = [
        { label: 'Total Institutes', value: stats.totalInstitutes, icon: <Building2 className="text-blue-500" />, color: 'blue' },
        { label: 'Total Departments', value: stats.totalDepartments, icon: <Layers className="text-purple-500" />, color: 'purple' },
        { label: 'Total Events', value: stats.totalEvents, icon: <Calendar className="text-pink-500" />, color: 'pink' },
        { label: 'Total Participants', value: stats.totalParticipants, icon: <Users className="text-orange-500" />, color: 'orange' },
    ];

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
                        <LayoutDashboard className="text-primary" size={36} />
                        Main Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">Real-time overview of Frolic Fest management.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => setIsEditingLocation(true)}
                        className="btn-outline flex items-center gap-2 py-3 px-6"
                    >
                        <MapPin size={18} /> Enter Location
                    </button>
                    <Link to="/admin/add-institute" className="btn-outline flex items-center gap-2 py-3 px-6 border-blue-500/50 hover:bg-blue-500/10 text-white">
                        <Building2 size={18} className="text-blue-500" /> + Institute
                    </Link>
                    <Link to="/admin/add-department" className="btn-outline flex items-center gap-2 py-3 px-6 border-purple-500/50 hover:bg-purple-500/10 text-white">
                        <Layers size={18} className="text-purple-500" /> + Dept
                    </Link>
                    <Link to="/admin/add-event" className="btn-primary flex items-center gap-2 py-3 px-6 shadow-lg shadow-primary/20">
                        <Plus size={18} /> New Event
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                                <TrendingUp size={12} /> Active
                            </span>
                        </div>
                        <h4 className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">{stat.label}</h4>
                        <div className="text-4xl font-display font-bold text-white">
                            {loading ? "..." : stat.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Schedule Info */}
                <div className="lg:col-span-2 glass-dark p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                    <h3 className="text-2xl font-bold text-white mb-8">Event Scheduling</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Current Location</p>
                                    <p className="text-xl text-white font-semibold">{stats.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Scheduled Dates</p>
                                    <p className="text-xl text-white font-semibold">{stats.dates}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Quick Management</h4>
                            <div className="space-y-3">
                                <Link to="/admin/manage?tab=institutes" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                                    <span className="text-white">Institutes</span>
                                    <ArrowRight size={18} className="text-gray-500 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                </Link>
                                <Link to="/admin/manage?tab=departments" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                                    <span className="text-white">Departments</span>
                                    <ArrowRight size={18} className="text-gray-500 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                </Link>
                                <Link to="/admin/manage?tab=events" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                                    <span className="text-white">Events</span>
                                    <ArrowRight size={18} className="text-gray-500 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Mini-Card */}
                <div className="glass p-10 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Status</h3>
                    <div className="space-y-6">
                        <div className="relative pl-8 border-l-2 border-primary/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(233,30,99,0.5)]"></div>
                            <p className="text-xs text-gray-500 mb-1">Database Connected</p>
                            <p className="text-sm text-white font-medium">System operational</p>
                        </div>
                        <div className="relative pl-8 border-l-2 border-primary/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/30"></div>
                            <p className="text-xs text-gray-500 mb-1">Waitlist Active</p>
                            <p className="text-sm text-white font-medium">New participants joining</p>
                        </div>
                        <div className="relative pl-8 border-l-2 border-primary/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/30"></div>
                            <p className="text-xs text-gray-500 mb-1">Registration</p>
                            <p className="text-sm text-white font-medium">Closing in 14 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Location Modal */}
            {isEditingLocation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 glass-dark backdrop-blur-md">
                    <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border border-white/10">
                        <h2 className="text-3xl font-display font-bold text-white mb-8">Update Event Info</h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase ml-2">Location</label>
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase ml-2">Date Range</label>
                                <input
                                    type="text"
                                    value={newDates}
                                    onChange={(e) => setNewDates(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                onClick={() => setIsEditingLocation(false)}
                                className="flex-1 btn-outline py-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateLocation}
                                className="flex-1 btn-primary py-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
