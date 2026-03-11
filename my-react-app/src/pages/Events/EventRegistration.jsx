import { useState } from 'react';
import FormField from '../../components/Form/FormField';
import { groupService, participantService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContext';
import { Users, UserPlus, Loader2, CheckCircle, Info, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

const EventRegistration = ({ event, onSuccess }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        GroupName: '',
        ParticipantName: user?.UserName || '',
        ParticipantEmail: user?.EmailAddress || '',
        ParticipantEnrollmentNumber: '',
        ParticipantInstituteName: '',
        ParticipantCity: '',
        ParticipantMobile: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.GroupName.trim()) tempErrors.GroupName = "Team name is required";
        if (!formData.ParticipantName.trim()) tempErrors.ParticipantName = "Your name is required";
        if (!formData.ParticipantEnrollmentNumber.trim()) tempErrors.ParticipantEnrollmentNumber = "Enrollment/ID is required";
        if (!formData.ParticipantInstituteName.trim()) tempErrors.ParticipantInstituteName = "Institute name is required";
        if (!formData.ParticipantMobile.trim() || formData.ParticipantMobile.length < 10) tempErrors.ParticipantMobile = "Valid mobile number is required";
        if (!formData.ParticipantEmail.trim() || !/^\S+@\S+\.\S+$/.test(formData.ParticipantEmail)) tempErrors.ParticipantEmail = "Valid email is required";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // 1. Create the Group
            // In many events, the first person is the group leader and the group name is required.
            const groupResponse = await groupService.create({
                GroupName: formData.GroupName,
                EventID: event._id
            });
            const groupId = groupResponse.group._id;

            // 2. Create the Lead Participant with all requested fields
            await participantService.create({
                ParticipantName: formData.ParticipantName,
                ParticipantEnrollmentNumber: formData.ParticipantEnrollmentNumber,
                ParticipantEmail: formData.ParticipantEmail,
                ParticipantMobile: formData.ParticipantMobile,
                ParticipantInstituteName: formData.ParticipantInstituteName,
                ParticipantCity: formData.ParticipantCity,
                IsGroupLeader: true,
                GroupID: groupId
            });

            addToast(`Successfully registered for ${event.EventName}!`, 'success');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setErrors({ submit: err.response?.data?.message || "Registration failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
                    <Info size={18} />
                    {errors.submit}
                </div>
            )}

            {/* Event Header Card */}
            <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors duration-500"></div>
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                        <Users className="text-primary" size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">Official Registration</p>
                        <h4 className="text-2xl font-display font-bold text-white leading-tight">{event.EventName}</h4>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h5 className="text-white font-bold uppercase text-xs tracking-widest">Team Identity</h5>
                </div>
                <FormField
                    label="Team Name"
                    name="GroupName"
                    value={formData.GroupName}
                    onChange={handleChange}
                    error={errors.GroupName}
                    placeholder="Enter a unique name for your team"
                    icon={<Users size={18} />}
                    required
                />
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-secondary rounded-full"></div>
                    <h5 className="text-white font-bold uppercase text-xs tracking-widest">Personal Details</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Full Name"
                        name="ParticipantName"
                        value={formData.ParticipantName}
                        onChange={handleChange}
                        error={errors.ParticipantName}
                        placeholder="Lead participant name"
                        icon={<UserPlus size={18} />}
                        required
                    />
                    <FormField
                        label="Enrollment / ID Number"
                        name="ParticipantEnrollmentNumber"
                        value={formData.ParticipantEnrollmentNumber}
                        onChange={handleChange}
                        error={errors.ParticipantEnrollmentNumber}
                        placeholder="Your university ID"
                        icon={<GraduationCap size={18} />}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Email Address"
                        name="ParticipantEmail"
                        value={formData.ParticipantEmail}
                        onChange={handleChange}
                        error={errors.ParticipantEmail}
                        placeholder="active@email.com"
                        icon={<Mail size={18} />}
                        required
                    />
                    <FormField
                        label="Contact Number"
                        name="ParticipantMobile"
                        value={formData.ParticipantMobile}
                        onChange={handleChange}
                        error={errors.ParticipantMobile}
                        placeholder="10 digit mobile"
                        icon={<Phone size={18} />}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Institute Name"
                        name="ParticipantInstituteName"
                        value={formData.ParticipantInstituteName}
                        onChange={handleChange}
                        error={errors.ParticipantInstituteName}
                        placeholder="e.g. Darshan University"
                        icon={<GraduationCap size={18} />}
                        required
                    />
                    <FormField
                        label="City"
                        name="ParticipantCity"
                        value={formData.ParticipantCity}
                        onChange={handleChange}
                        placeholder="Your current city"
                        icon={<MapPin size={18} />}
                    />
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(233,30,99,0.3)] hover:shadow-[0_15px_40px_rgba(233,30,99,0.4)] transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg">Confirm Registration</span>
                        </>
                    )}
                </button>
                <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-6">
                    By confirming, you agree to our event rules and code of conduct.
                </p>
            </div>
        </form>
    );
};

export default EventRegistration;
