import { useState } from 'react';
import FormField from '../../components/Form/FormField';
import { groupService, participantService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContext';
import { Users, UserPlus, Loader2, CheckCircle } from 'lucide-react';

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
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // 1. Create the Group
            const groupResponse = await groupService.create({
                GroupName: formData.GroupName,
                EventID: event._id
            });
            const groupId = groupResponse.group._id;

            // 2. Create the Lead Participant
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
                    {errors.submit}
                </div>
            )}

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                </div>
                <div>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Registering for</p>
                    <h4 className="text-lg font-bold text-white leading-tight">{event.EventName}</h4>
                </div>
            </div>

            <FormField
                label="Team Name"
                name="GroupName"
                value={formData.GroupName}
                onChange={handleChange}
                error={errors.GroupName}
                placeholder="Unique name for your team"
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    label="Lead Participant Name"
                    name="ParticipantName"
                    value={formData.ParticipantName}
                    onChange={handleChange}
                    error={errors.ParticipantName}
                    placeholder="Full name"
                    required
                />
                <FormField
                    label="Enrollment Number"
                    name="ParticipantEnrollmentNumber"
                    value={formData.ParticipantEnrollmentNumber}
                    onChange={handleChange}
                    error={errors.ParticipantEnrollmentNumber}
                    placeholder="e.g. 21010101001"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    label="Institute Name"
                    name="ParticipantInstituteName"
                    value={formData.ParticipantInstituteName}
                    onChange={handleChange}
                    error={errors.ParticipantInstituteName}
                    placeholder="e.g. Darshan University"
                    required
                />
                <FormField
                    label="Mobile Number"
                    name="ParticipantMobile"
                    value={formData.ParticipantMobile}
                    onChange={handleChange}
                    error={errors.ParticipantMobile}
                    placeholder="10 digit number"
                    required
                />
            </div>

            <FormField
                label="City"
                name="ParticipantCity"
                value={formData.ParticipantCity}
                onChange={handleChange}
                placeholder="Your city"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
                {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Complete Registration</>}
            </button>
        </form>
    );
};

export default EventRegistration;
