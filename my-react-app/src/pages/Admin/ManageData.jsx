import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { instituteService, departmentService, eventService, participantService } from '../../services/api';
import { Trash2, Building2, Layers, Calendar, Search, Loader2, Plus, Users as UsersIcon } from 'lucide-react';

const ManageData = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('institutes');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['institutes', 'departments', 'events', 'participants'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const [data, setData] = useState({ institutes: [], departments: [], events: [], participants: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [insts, depts, evts, parts] = await Promise.all([
                instituteService.getAll(),
                departmentService.getAll(),
                eventService.getAll(),
                participantService.getAll()
            ]);
            
            setData({ 
                institutes: insts || [], 
                departments: depts || [], 
                events: evts || [],
                participants: parts || []
            });
        } catch (err) {
            console.error("Failed to fetch management data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (type, id, name) => {
        if (window.confirm(`Permanently remove "${name}" and all its related data?`)) {
            try {
                if (type === 'institute') await instituteService.delete(id);
                if (type === 'department') await departmentService.delete(id);
                if (type === 'event') await eventService.delete(id);
                if (type === 'participant') await participantService.delete(id);
                fetchData();
            } catch (err) {
                alert("Deletion failed: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const tabs = [
        { id: 'institutes', label: 'Institutes', icon: <Building2 size={18} /> },
        { id: 'departments', label: 'Departments', icon: <Layers size={18} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
        { id: 'participants', label: 'Participants', icon: <UsersIcon size={18} /> },
    ];

    const currentList = data[activeTab].filter(item => {
        const query = searchTerm.toLowerCase();
        return (
            (item.InstituteName && item.InstituteName.toLowerCase().includes(query)) ||
            (item.DepartmentName && item.DepartmentName.toLowerCase().includes(query)) ||
            (item.EventName && item.EventName.toLowerCase().includes(query)) ||
            (item.ParticipantName && item.ParticipantName.toLowerCase().includes(query)) ||
            (item.ParticipantEmail && item.ParticipantEmail.toLowerCase().includes(query))
        );
    });

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage and monitor all institutes, departments, and events.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link to="/admin/add-institute" className="flex-1 md:flex-none btn-outline flex items-center justify-center gap-2 py-3 px-6 border-blue-500/30 hover:bg-blue-500/10 text-white">
                            <Plus size={18} className="text-blue-500" /> Institute
                        </Link>
                        <Link to="/admin/add-department" className="flex-1 md:flex-none btn-outline flex items-center justify-center gap-2 py-3 px-6 border-purple-500/30 hover:bg-purple-500/10 text-white">
                            <Plus size={18} className="text-purple-500" /> Dept
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-8 max-w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.icon} {tab.label}
                        <span className="bg-black/20 px-2 py-0.5 rounded-md text-[10px] ml-1">
                            {data[tab.id].length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="animate-spin text-primary w-12 h-12" />
                </div>
            ) : (
                <div className="glass-dark border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {activeTab === 'events' ? 'Department' : 
                                         activeTab === 'departments' ? 'Institute' : 
                                         activeTab === 'participants' ? 'Enrollment' : 'Description'}
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentList.length > 0 ? currentList.map((item) => (
                                    <tr key={item._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {(item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName)[0]}
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-400">
                                            {activeTab === 'events' ? (item.DepartmentID?.DepartmentName || 'N/A') :
                                             activeTab === 'departments' ? (item.InstituteID?.InstituteName || 'N/A') :
                                             activeTab === 'participants' ? (item.ParticipantEnrollmentNumber || 'N/A') :
                                             (item.InstituteDescription || 'University Campus')}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(
                                                    activeTab === 'events' ? 'event' : 
                                                    activeTab === 'departments' ? 'department' : 
                                                    activeTab === 'participants' ? 'participant' : 'institute',
                                                    item._id,
                                                    item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName
                                                )}
                                                className="p-3 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                                                title="Delete permanently"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center text-gray-500 italic">
                                            No {activeTab} found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageData;
