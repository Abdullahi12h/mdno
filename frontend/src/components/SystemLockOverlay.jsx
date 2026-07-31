import { Lock } from 'lucide-react';

const SystemLockOverlay = ({ title, message, codeText }) => {
    const displayTitle = title || 'BISHA WAAYEE ISKA BIXI LACAGTA!';
    const displayMessage = message || 'Fadlan iska bixi lacagta bisha kuna tuur lambarkaan *712*616913269*#';
    const displayCode = codeText || '*712*616913269*#';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
            <div className="bg-white border-2 border-amber-200 rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
                {/* Red Circular Lock Icon Header */}
                <div className="w-24 h-24 rounded-full bg-red-100/80 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Lock className="w-12 h-12 text-red-600 stroke-[2.5]" />
                </div>

                {/* Main Red Heading */}
                <h2 className="text-red-600 font-extrabold text-xl md:text-2xl tracking-wide uppercase mb-6 leading-tight">
                    {displayTitle}
                </h2>

                {/* Light Yellow Text Box */}
                <div className="bg-[#FFFDF3] border border-amber-200/90 rounded-2xl p-5 mb-6 text-slate-700 font-semibold text-base md:text-lg leading-relaxed shadow-sm">
                    {displayMessage}
                </div>

                {/* Dark Green Code Button/Badge */}
                <div className="bg-[#165B33] text-white text-lg md:text-2xl font-bold py-4 px-6 rounded-2xl tracking-widest shadow-md flex items-center justify-center select-all">
                    {displayCode}
                </div>
            </div>
        </div>
    );
};

export default SystemLockOverlay;
