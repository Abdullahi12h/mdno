import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Lock, Unlock, ShieldAlert, CheckCircle2, Save, RefreshCw, Eye } from 'lucide-react';
import SystemLockOverlay from '../components/SystemLockOverlay';

const SuperAdminDashboard = () => {
    const [systemStatus, setSystemStatus] = useState({
        isLocked: false,
        title: 'BISHA WAAYEE ISKA BIXI LACAGTA!',
        message: 'Fadlan iska bixi lacagta bisha kuna tuur lambarkaan *712*616913269*#',
        codeText: '*712*616913269*#',
    });
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [formTitle, setFormTitle] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [formCodeText, setFormCodeText] = useState('');

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/system/status');
            setSystemStatus(data);
            setFormTitle(data.title || 'BISHA WAAYEE ISKA BIXI LACAGTA!');
            setFormMessage(data.message || 'Fadlan iska bixi lacagta bisha kuna tuur lambarkaan *712*616913269*#');
            setFormCodeText(data.codeText || '*712*616913269*#');
        } catch (err) {
            console.error('Failed to fetch system status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleToggleLock = async () => {
        try {
            setToggling(true);
            setFeedback(null);
            const nextLocked = !systemStatus.isLocked;
            const { data } = await api.post('/system/toggle', {
                isLocked: nextLocked,
            });
            setSystemStatus((prev) => ({ ...prev, isLocked: data.isLocked }));
            setFeedback({
                type: data.isLocked ? 'error' : 'success',
                text: data.isLocked ? 'System-ka waa la XIRAY! Adminka iyo dadka kale oo dhan waa lagu xiray.' : 'System-ka waa la FURAY! Adminka iyo isticmaalayaasha oo dhan dib ayay u isticmaali karaan.'
            });
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err.response?.data?.message || 'Hawshu way fashilantay!'
            });
        } finally {
            setToggling(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setFeedback(null);
            const { data } = await api.post('/system/toggle', {
                title: formTitle,
                message: formMessage,
                codeText: formCodeText,
            });
            setSystemStatus((prev) => ({
                ...prev,
                title: data.title,
                message: data.messageText || data.message,
                codeText: data.codeText
            }));
            setFeedback({
                type: 'success',
                text: 'Qoraalka qufulka iyo lambarka waa la cusboonaysiiyay!'
            });
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err.response?.data?.message || 'Cusboonaysiintu way fashilantay!'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12">
            {/* Header Title */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <ShieldAlert className="w-8 h-8 text-amber-400" />
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Super Admin Dashboard
                        </h1>
                    </div>
                    <p className="text-blue-200/90 text-sm md:text-base font-medium">
                        Maamulka Guud ee Xiridda iyo Furidda System-ka (Control Panel)
                    </p>
                </div>
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all border border-white/20 self-start md:self-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Cusboonaysii</span>
                </button>
            </div>

            {/* Notification Feedback */}
            {feedback && (
                <div className={`p-4 rounded-2xl border text-sm font-semibold flex items-center space-x-3 animate-in fade-in duration-200 ${
                    feedback.type === 'error'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                    {feedback.type === 'error' ? <ShieldAlert className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* Main Action Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/80 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Xaaladda Present-ka ah ee System-ka
                        </span>
                        <div className="flex items-center space-x-3 mt-2">
                            {systemStatus.isLocked ? (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
                                    <Lock className="w-5 h-5 mr-2" />
                                    SYSTEM-KU WAA XIRAN YAHAY (LOCKED)
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    SYSTEM-KU WAA FURAN YAHAY (ACTIVE)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Master Lock / Unlock Button */}
                    <button
                        onClick={handleToggleLock}
                        disabled={toggling}
                        className={`py-4 px-8 rounded-2xl text-lg font-black tracking-wide shadow-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95 text-white ${
                            systemStatus.isLocked
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
                                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-red-500/30'
                        }`}
                    >
                        {systemStatus.isLocked ? (
                            <>
                                <Unlock className="w-6 h-6" />
                                <span>FURA SYSTEM-KA</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-6 h-6" />
                                <span>XIR SYSTEM-KA</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <p className="font-semibold text-slate-800 mb-1">ℹ️ Sida ay u shaqaynayso:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs md:text-sm">
                        <li>Markaad taabato <strong>"XIR SYSTEM-KA"</strong>, dhammaan Adminka kale, Macallimiinta, iyo Ardayda waa lagu xirayaa.</li>
                        <li>Waxay si toos ah u arki doonaan bogga lacag bixinta ku qoran tahay oo leh sawirka aad u dejasay.</li>
                        <li>Inta uu xiran yahay, Super Admin-ka kaliya ayaa maamuli kara dashboard-kan si uu mar kale ugu taabo <strong>"FURA SYSTEM-KA"</strong>.</li>
                    </ul>
                </div>
            </div>

            {/* Customization Form & Preview */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <Save className="w-5 h-5 text-blue-600" />
                        <span>Beddel Qoraalka iyo Lambarka Qufulka</span>
                    </h3>
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span>{showPreview ? 'Qari Sawirka' : 'Angli Sawirka (Preview)'}</span>
                    </button>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            Cinwaanka Cas (Red Title)
                        </label>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold text-slate-800"
                            placeholder="BISHA WAAYEE ISKA BIXI LACAGTA!"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            Fariinta Sharraxaadda (Yellow Box Message)
                        </label>
                        <textarea
                            value={formMessage}
                            onChange={(e) => setFormMessage(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium text-slate-800"
                            placeholder="Fadlan iska bixi lacagta bisha kuna tuur lambarkaan *712*616913269*#"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            Lambarka/USSD Code-ka (Green Box Text)
                        </label>
                        <input
                            type="text"
                            value={formCodeText}
                            onChange={(e) => setFormCodeText(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold text-emerald-800"
                            placeholder="*712*616913269*#"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{saving ? 'Cusboonaysiinayaa...' : 'Kaydi Qoraallada'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Live Preview Modal Overlay */}
            {showPreview && (
                <div className="relative">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Live Preview:</span>
                        <button onClick={() => setShowPreview(false)} className="text-xs font-bold text-red-600">Close Preview</button>
                    </div>
                    <SystemLockOverlay
                        title={formTitle}
                        message={formMessage}
                        codeText={formCodeText}
                    />
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
