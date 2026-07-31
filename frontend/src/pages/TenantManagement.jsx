import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Building2,
    Plus,
    Lock,
    Unlock,
    GraduationCap,
    Users,
    Calendar,
    RotateCw,
    Trash2,
    Search,
    CheckCircle,
    AlertTriangle,
    X
} from 'lucide-react';

const TenantManagement = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    // Form state for creating tenant
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        logo: '',
        adminName: '',
        adminUsername: '',
        adminPassword: '',
        subscriptionDays: 30,
    });

    const [extendDays, setExtendDays] = useState(30);
    const [submitting, setSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/tenants');
            setTenants(data);
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'Failed to fetch tenants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const showAlert = (type, text) => {
        setAlertMessage({ type, text });
        setTimeout(() => setAlertMessage({ type: '', text: '' }), 5000);
    };

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/tenants', formData);
            showAlert('success', 'Dugsiga cusub/Tenant waa la abuuray si guul leh!');
            setIsCreateModalOpen(false);
            setFormData({
                name: '',
                code: '',
                email: '',
                phone: '',
                address: '',
                logo: '',
                adminName: '',
                adminUsername: '',
                adminPassword: '',
                subscriptionDays: 30,
            });
            fetchTenants();
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'Eror ayaa dhacay marka dugsiga la abuurayay');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (tenant) => {
        const newStatus = tenant.status === 'active' ? 'locked' : 'active';
        try {
            await api.put(`/tenants/${tenant._id}`, { status: newStatus });
            showAlert('success', `Status-ka dugsiga ${tenant.name} waxaa loo badalay ${newStatus.toUpperCase()}`);
            fetchTenants();
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'Update failed');
        }
    };

    const handleExtendSubscription = async (e) => {
        e.preventDefault();
        if (!selectedTenant) return;
        setSubmitting(true);
        try {
            await api.put(`/tenants/${selectedTenant._id}`, { subscriptionDays: extendDays });
            showAlert('success', `Rukumada dugsiga ${selectedTenant.name} waxaa la kordhiyay ${extendDays} maalmood!`);
            setIsExtendModalOpen(false);
            setSelectedTenant(null);
            fetchTenants();
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'Kordhinta rukumada waa fashilantay');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTenant = async (id, name) => {
        if (!window.confirm(`Ma hubtaa inaad tiraysid dugsiga/tenant-ka "${name}"? Xogtiisa oo dhan waa la tirayaa.`)) return;
        try {
            await api.delete(`/tenants/${id}`);
            showAlert('success', `Tenant "${name}" waa la tiray`);
            fetchTenants();
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'Deletion failed');
        }
    };

    const filteredTenants = tenants.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 rounded-2xl text-white shadow-xl">
                <div>
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-8 h-8 text-blue-400" />
                        <h1 className="text-2xl font-bold tracking-tight">Maamulka Dugsiyada (Multi-Tenancy)</h1>
                    </div>
                    <p className="text-blue-200 mt-1 text-sm">
                        Ka maamul dhamaan Dugsiyada/Organizations-ka nidaamka ku jira, rukumadooda iyo awoodaha maamul.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Abuur Dugsi Cusub (Tenant)
                </button>
            </div>

            {/* Notification Alert */}
            {alertMessage.text && (
                <div
                    className={`p-4 rounded-xl flex items-center justify-between shadow-md text-sm font-medium ${
                        alertMessage.type === 'success'
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    }`}
                >
                    <div className="flex items-center space-x-2">
                        {alertMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span>{alertMessage.text}</span>
                    </div>
                    <button onClick={() => setAlertMessage({ type: '', text: '' })}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Dhamaan Dugsiyada</p>
                        <p className="text-2xl font-bold text-white">{tenants.length}</p>
                    </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Dugsiyada Shaqaynaya</p>
                        <p className="text-2xl font-bold text-white">
                            {tenants.filter((t) => t.status === 'active').length}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-rose-500/20 text-rose-400 rounded-lg">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Dugsiyada Xiran (Locked/Suspended)</p>
                        <p className="text-2xl font-bold text-white">
                            {tenants.filter((t) => t.status !== 'active').length}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Wadarta Ardayda Dhamaan</p>
                        <p className="text-2xl font-bold text-white">
                            {tenants.reduce((acc, t) => acc + (t.studentCount || 0), 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Raadi magaca ama ID-ga dugsiga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={fetchTenants}
                    className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <RotateCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Tenants Cards Grid */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading tenants...</div>
            ) : filteredTenants.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/50 text-slate-400">
                    Sidoo kale ma jiraan dugsiyo laga helay raadintaada.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenants.map((tenant) => {
                        const isExpired = new Date(tenant.subscriptionExpiry) < new Date();
                        return (
                            <div
                                key={tenant._id}
                                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all duration-200"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            {tenant.logo ? (
                                                <img
                                                    src={tenant.logo}
                                                    alt={tenant.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-slate-600"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                    {tenant.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-tight">
                                                    {tenant.name}
                                                </h3>
                                                <span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-blue-300 mt-1">
                                                    Code: {tenant.code}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                                tenant.status === 'active' && !isExpired
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            }`}
                                        >
                                            {isExpired ? 'Expired' : tenant.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                                        <div className="flex items-center space-x-2 text-slate-300">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span>Ardayda: {tenant.studentCount || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-slate-300">
                                            <GraduationCap className="w-4 h-4 text-indigo-400" />
                                            <span>Macallimiinta: {tenant.teacherCount || 0}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center space-x-2 text-slate-300 mt-1">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span>
                                                Rukumadu waxay ka dhacaysaa:{' '}
                                                {new Date(tenant.subscriptionExpiry).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {tenant.adminUser && (
                                        <div className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30">
                                            <p className="font-semibold text-slate-300">Maamulaha Dugsiga:</p>
                                            <p>{tenant.adminUser.name} ({tenant.adminUser.username})</p>
                                            {tenant.adminUser.phone && <p>Phone: {tenant.adminUser.phone}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(tenant)}
                                        className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                                            tenant.status === 'active'
                                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        }`}
                                    >
                                        {tenant.status === 'active' ? (
                                            <>
                                                <Lock className="w-4 h-4 mr-1.5" /> Lock/Pause
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="w-4 h-4 mr-1.5" /> Unlock
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedTenant(tenant);
                                            setIsExtendModalOpen(true);
                                        }}
                                        className="flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
                                    >
                                        <Calendar className="w-4 h-4 mr-1" /> +Rukumada
                                    </button>

                                    <button
                                        onClick={() => handleDeleteTenant(tenant._id, tenant.name)}
                                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        title="Delete Tenant"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Tenant Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl text-white my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <Building2 className="w-6 h-6 text-blue-400" />
                                <span>Abuur Dugsi Cusub (New Tenant)</span>
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)}>
                                <X className="w-6 h-6 text-slate-400 hover:text-white" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTenant} className="space-y-4 mt-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Magaca Dugsiga *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mogadishu Academy"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Code / Slug (Unique) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. mogadishu-academy"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        placeholder="+25261..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="info@school.so"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4 mt-2">
                                <h4 className="font-semibold text-blue-400 mb-2">Maamulaha Dugsiga (Initial Admin)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Magaca Admin-ka</label>
                                        <input
                                            type="text"
                                            placeholder="Admin Full Name"
                                            value={formData.adminName}
                                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Username *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="admin_username"
                                            value={formData.adminUsername}
                                            onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="******"
                                            value={formData.adminPassword}
                                            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Subscription Initial Duration (Maalmood)
                                </label>
                                <input
                                    type="number"
                                    value={formData.subscriptionDays}
                                    onChange={(e) => setFormData({ ...formData, subscriptionDays: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                                >
                                    Baqsi (Cancel)
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md"
                                >
                                    {submitting ? 'Abuurayaa...' : 'Abuur Dugsi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Extend Subscription Modal */}
            {isExtendModalOpen && selectedTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                            <h3 className="text-lg font-bold">Kordhi Rukumada: {selectedTenant.name}</h3>
                            <button onClick={() => setIsExtendModalOpen(false)}>
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleExtendSubscription} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Maalmaha la kordhinayo (Days to Add)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={extendDays}
                                    onChange={(e) => setExtendDays(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsExtendModalOpen(false)}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm"
                                >
                                    {submitting ? 'Kordhinayaa...' : 'Kordhi Rukumada'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantManagement;
