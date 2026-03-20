import { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Users,
    Trophy,
    ArrowRight,
    Sparkles,
    Loader2,
    HelpCircle,
    ShieldCheck,
    Zap,
    Mail,
    Phone,
    Info,
    List,
    Link as LinkIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService, participantService, instituteService, departmentService } from '../../services/api';
import Modal from '../../components/Modal';
import EventRegistration from '../Events/EventRegistration';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const [events, setEvents] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('all');
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [stats, setStats] = useState({
        location: 'Darshan University',
        date: '22-24 March 2025',
        eventsCount: '0 Events',
        participantsCount: '0 Students'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, participantsData, institutesData, departmentsData] = await Promise.allSettled([
                    eventService.getAll(),
                    participantService.getAll(),
                    instituteService.getAll(),
                    departmentService.getAll()
                ]);

                const newStats = { ...stats };

                if (eventsData.status === 'fulfilled') {
                    setEvents(eventsData.value);
                    newStats.eventsCount = `${eventsData.value.length} Events`;
                }

                if (departmentsData.status === 'fulfilled') {
                    setDepartments(departmentsData.value);
                }

                if (participantsData.status === 'fulfilled') {
                    newStats.participantsCount = `${participantsData.value.length} Students`;
                }

                setStats(newStats);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = activeDept === 'all'
        ? events
        : events.filter(e => e.DepartmentID?._id === activeDept || e.DepartmentID === activeDept);

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsRegModalOpen(true);
    };

    return (
        <div className="space-y-24 pb-20 overflow-x-hidden -mt-24 md:-mt-32">
            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark border border-white/10 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 shadow-[0_0_15px_rgba(233,30,99,0.2)]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">Registration Live • Frolic 2025</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-8 tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            {user ? (
                                <>Welcome back, <br /><span className="text-gradient uppercase">{user.UserName}!</span></>
                            ) : (
                                <>CHALLENGE YOUR <br /><span className="text-gradient uppercase">POTENTIAL.</span></>
                            )}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 leading-relaxed font-sans font-light">
                            Join the ultimate technical and cultural symposium. Unleash your innovation, compete with the best, and redefine excellence in the heart of Frolic.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                            <button onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })} className="btn-primary py-5 px-12 text-lg flex items-center gap-3 group shadow-[0_10px_30px_rgba(233,30,99,0.4)]">
                                <Sparkles size={20} /> Explore Events <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                            {!user && (
                                <Link to="/login" className="btn-outline py-5 px-12 text-lg">
                                    Join the Community
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <MapPin className="text-primary" />, label: "Location", val: stats.location },
                        { icon: <Calendar className="text-primary" />, label: "Date", val: stats.date },
                        { icon: <Trophy className="text-primary" />, label: "Events", val: stats.eventsCount },
                        { icon: <Users className="text-primary" />, label: "Participants", val: stats.participantsCount }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-3xl text-center border border-white/5 hover:border-primary/30 transition-colors">
                            <div className="flex justify-center mb-4">{stat.icon}</div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-white font-display">{stat.val}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Departments Filter & Events List */}
            <section id="events" className="container mx-auto px-6 scroll-mt-32">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold text-white mb-6">Our Events</h2>

                    {/* Department Navigation (As per Photo) */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveDept('all')}
                            className={`text-sm md:text-base font-bold uppercase tracking-wider transition-all relative ${activeDept === 'all' ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Show All
                            {activeDept === 'all' && <div className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full"></div>}
                        </button>
                        {departments.map((dept) => (
                            <button
                                key={dept._id}
                                onClick={() => setActiveDept(dept._id)}
                                className={`text-sm md:text-base font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeDept === dept._id ? 'text-primary' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {dept.DepartmentName}
                                {activeDept === dept._id && <div className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[500px] glass rounded-3xl animate-pulse"></div>
                        ))
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div key={event._id} className="group flex flex-col glass-dark border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(233,30,99,0.15)] h-full">
                                {/* Event Card Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[1.5rem]">
                                    <img
                                        src={event.EventImage || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60`}
                                        alt={event.EventName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Event Type Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            {event.EventType || 'Technical'}
                                        </div>
                                    </div>
                                </div>

                                {/* Event Card Content */}
                                <div className="px-8 pb-8 pt-2 flex flex-col flex-grow text-left">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.EventName}</h3>

                                    <p className="text-gray-400 text-sm mb-4">Boys, Girls</p>
                                    <p className="text-gray-400 text-sm font-medium mb-6">{event.EventType || 'Technical'}</p>

                                    {/* Action Icons */}
                                    <div className="mt-auto flex items-center justify-between text-gray-500">
                                        <button className="hover:text-primary transition-colors">
                                            <List size={22} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={() => handleRegisterClick(event)}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <LinkIcon size={22} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass rounded-[2.5rem]">
                            <p className="text-gray-400 text-lg">No events found for this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Rules Section */}
            <section id="rules" className="container mx-auto px-6 scroll-mt-32">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-white mb-4">Event Rules & Guidelines</h2>
                        <p className="text-gray-400">Please read carefully to ensure a fair and exciting competition for everyone.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Registration", desc: "All participants must register through the official portal before the deadline." },
                            { title: "ID Cards", desc: "Students must carry their college ID cards at all times during the event." },
                            { title: "Conduct", desc: "Professional behavior is expected. Any form of malpractice will lead to disqualification." },
                            { title: "Team Size", desc: "Adhere to the specific team size mentioned for each event." },
                            { title: "Deadlines", desc: "Reporting time for events is 30 minutes prior to the scheduled start." },
                            { title: "Decision", desc: "The judge's decision will be final and binding for all participants." }
                        ].map((rule, i) => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/5 flex gap-5">
                                <div className="p-3 bg-primary/10 rounded-2xl h-fit">
                                    <ShieldCheck className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">{rule.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section id="faqs" className="container mx-auto px-6 scroll-mt-32">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Everything you need to know about Frolic 2025.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Who can participate in Frolic?", a: "Frolic is open to all university and college students across the country." },
                            { q: "How many events can I register for?", a: "You can register for as many events as long as their timings don't overlap." },
                            { q: "Is there a registration fee?", a: "Yes, each event has a specific registration fee mentioned in its details." },
                            { q: "Will I get a certificate?", a: "All participants will receive a certificate of participation. Winners get special merit certificates." },
                            { q: "How do I reach Darshan University?", a: "Bus facilities will be provided from major city points. Check the facilities section for details." }
                        ].map((faq, i) => (
                            <details key={i} className="glass-dark border border-white/10 rounded-2xl group overflow-hidden">
                                <summary className="p-6 cursor-pointer flex justify-between items-center text-white font-bold select-none list-none">
                                    {faq.q}
                                    <HelpCircle className="text-gray-500 group-open:text-primary transition-colors" size={20} />
                                </summary>
                                <div className="p-6 pt-0 text-gray-400 text-sm border-t border-white/5">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section id="facilities" className="container mx-auto px-6 scroll-mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Campus Facilities</h2>
                    <p className="text-gray-400">We ensure a comfortable and productive environment for all participants.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap className="text-yellow-400" />, title: "High-Speed Wi-Fi", desc: "Dedicated high-speed internet access across all event venues for participants." },
                        { icon: <Users className="text-green-400" />, title: "Food Courts", desc: "Multiple food stalls and a main cafeteria serving a variety of cuisines." },
                        { icon: <ShieldCheck className="text-blue-400" />, title: "Medical Support", desc: "24/7 medical assistance and on-campus clinic available for emergencies." },
                        { icon: <MapPin className="text-red-400" />, title: "Transport", desc: "Shuttle bus services from the city center to the campus and back." },
                        { icon: <Info className="text-purple-400" />, title: "Help Desk", desc: "Information centers at every major building to guide you through the event." },
                        { icon: <Trophy className="text-primary" />, title: "Rest Zones", desc: "Comfortable lounges and rest areas to recharge between your events." }
                    ].map((facility, i) => (
                        <div key={i} className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-center group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {facility.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{facility.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{facility.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="container mx-auto px-6 scroll-mt-32">
                <div className="glass-dark rounded-[3rem] p-12 border border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-white mb-6">Get in Touch</h2>
                            <p className="text-gray-400 mb-12">Have any questions? Our team is here to help you. Reach out through any of these channels.</p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Email Us</p>
                                        <p className="text-white font-semibold">frolic@darshan.ac.in</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Call Us</p>
                                        <p className="text-white font-semibold">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Location</p>
                                        <p className="text-white font-semibold">Darshan University, Rajkot-Morbi Highway, Rajkot.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2rem] border border-white/10">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Full Name</label>
                                        <input type="text" placeholder="Enter Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email</label>
                                        <input type="email" placeholder="Enter Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Subject</label>
                                    <input type="text" placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Message</label>
                                    <textarea rows="4" placeholder="Your message here..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
                                </div>
                                <button className="btn-primary w-full py-5 font-bold shadow-lg shadow-primary/20">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            <Modal
                isOpen={isRegModalOpen}
                onClose={() => setIsRegModalOpen(false)}
                title="Event Registration"
            >
                {selectedEvent && (
                    <EventRegistration
                        event={selectedEvent}
                        onSuccess={() => setIsRegModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
