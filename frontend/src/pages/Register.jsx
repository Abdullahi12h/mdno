import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, ArrowLeft, Shield, User, GraduationCap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'Admin', 
        phone: '',
        whatsapp: '',
        classId: '',
        batchId: '',
        skillId: '',
        registrationFee: 'Standard',
        amount: '',
        motherName: '',
        age: '',
        subjectId: '',
        educationLevel: '',
        specialization: '',
        experience: '',
        gender: 'Male',
        address: ''
    });

    const [classes, setClasses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [skills, setSkills] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [classRes, batchRes, skillRes, subjectRes] = await Promise.all([
                    api.get('/core/classes'),
                    api.get('/core/batches'),
                    api.get('/core/skills'),
                    api.get('/core/subjects')
                ]);
                setClasses(classRes.data);
                setBatches(batchRes.data);
                setSkills(skillRes.data);
                setSubjects(subjectRes.data);
            } catch (err) {
                console.error('Error fetching registration options', err);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const dataToSend = {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                role: formData.role,
                phone: formData.phone,
                whatsapp: formData.whatsapp
            };

            if (formData.role === 'Student') {
                Object.assign(dataToSend, {
                    classId: formData.classId,
                    batchId: formData.batchId,
                    skillId: formData.skillId,
                    registrationFee: formData.registrationFee,
                    amount: formData.amount,
                    motherName: formData.motherName,
                    age: formData.age
                });
            } else if (formData.role === 'Teacher') {
                Object.assign(dataToSend, {
                    subjectId: formData.subjectId,
                    educationLevel: formData.educationLevel,
                    specialization: formData.specialization,
                    experience: formData.experience,
                    gender: formData.gender,
                    address: formData.address
                });
            }

            ['classId', 'batchId', 'skillId', 'subjectId'].forEach(key => {
                if (dataToSend[key] === '') delete dataToSend[key];
            });

            await api.post('/auth/register', dataToSend);
            setSuccess(`${formData.role} registered successfully! Redirecting to login...`);
            setFormData(prev => ({
                ...prev,
                name: '', username: '', password: '', phone: '', whatsapp: '',
                amount: '', motherName: '', age: ''
            }));
            window.scrollTo(0, 0);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
            <div className="max-w-xl w-full">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 font-semibold text-sm transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <UserPlus className="h-5 w-5" /> Registeer Cusub
                        </h2>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                            {formData.role}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-bold border border-red-100">{error}</div>}
                        {success && <div className="p-3 rounded bg-green-50 text-green-600 text-sm font-bold border border-green-100">{success}</div>}

                        {/* Common Fields Table-like layout */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Full Name</label>
                                <input name="name" type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" value={formData.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Username</label>
                                <input name="username" type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" value={formData.username} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Password</label>
                                <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" value={formData.password} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Role</label>
                                <select name="role" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none bg-white font-bold" value={formData.role} onChange={handleChange} disabled>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Phone</label>
                                <input name="phone" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Role Specific */}
                        {formData.role === 'Student' && (
                            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div className="col-span-2 text-xs font-bold text-blue-600 uppercase">Student Details</div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Class</label>
                                    <select name="classId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={formData.classId} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Batch</label>
                                    <select name="batchId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={formData.batchId} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Skill</label>
                                    <select name="skillId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={formData.skillId} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Fee ($)</label>
                                    <input name="amount" type="number" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={formData.amount} onChange={handleChange} placeholder="0.00" />
                                </div>
                            </div>
                        )}

                        {formData.role === 'Teacher' && (
                            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div className="col-span-2 text-xs font-bold text-blue-600 uppercase">Teacher Details</div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Subject</label>
                                    <select name="subjectId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={formData.subjectId} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Gender</label>
                                    <select name="gender" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={formData.gender} onChange={handleChange}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all disabled:bg-gray-400"
                        >
                            {loading ? 'Processing...' : 'Save User'}
                        </button>

                    </form>

                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-100 relative z-10">
                        <span className="text-sm text-gray-500">Already have an account?</span>
                        <Link to="/login" className="ml-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
