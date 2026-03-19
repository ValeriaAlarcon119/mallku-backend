import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    BookOpen, 
    ShoppingBag, 
    ExternalLink, 
    Settings, 
    LogOut, 
    Zap,
    Menu,
    X,
    Heart
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TemasDeInteres from './components/TemasDeInteres';
import './index.css';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
            active 
            ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_20px_rgba(57,255,20,0.3)]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="text-sm tracking-tight">{label}</span>
        </div>
        {badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-black/20 text-black' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                {badge}
            </span>
        )}
    </motion.button>
);

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Inteligencia Mallku', icon: LayoutDashboard, badge: 'IA' },
        { id: 'temas', label: 'Temas de Interés', icon: BookOpen },
        { id: 'tienda', label: 'Tienda Oficial', icon: ShoppingBag },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'temas':
                return <TemasDeInteres />;
            case 'tienda':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
                        <ShoppingBag className="w-16 h-16 text-[#39FF14] mb-6 opacity-40" />
                        <h2 className="text-3xl font-bold text-white mb-4">MALLKU STORE <span className="text-[#39FF14]">LEGACY</span></h2>
                        <p className="text-gray-400 max-w-md mb-8">
                            Actualmente estás viendo la plataforma de inteligencia. Tu tienda de cliente está operativa en una URL aparte para máxima estabilidad.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => window.open('https://tienda-mallku.netlify.app', '_blank')}
                                className="bg-[#39FF14] text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ir a Tienda Online
                            </button>
                            <button 
                                onClick={() => window.open('/', '_self')}
                                className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
                            >
                                Ver Tienda Local
                            </button>
                        </div>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden">
            {/* Sidebar toggle for mobile */}
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 right-4 z-[100] p-2 bg-white/5 rounded-lg backdrop-blur-md"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#39FF14]" />}
            </button>

            {/* Sidebar Overlay for mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -activeTab === 'dashboard' ? 0 : 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        className={`fixed lg:relative z-[90] w-72 h-screen bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col transition-all duration-300 ${
                            sidebarOpen ? 'flex' : 'hidden lg:flex'
                        }`}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#39FF14] to-[#A855F7] p-[1.5px]">
                                <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-[#39FF14] group-hover:scale-110 transition-transform" fill="#39FF14" fillOpacity="0.2" />
                                </div>
                            </div>
                            <span className="text-xl font-bold tracking-tighter">MALLKU <span className="text-gray-500 font-light">SYSTEM</span></span>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2">
                            <p className="text-[10px] uppercase font-bold text-gray-600 tracking-[3px] mb-4 px-3">Ecosistema</p>
                            {menuItems.map(item => (
                                <SidebarItem 
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.id}
                                    badge={item.badge}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        // Auto-close on small screens
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                />
                            ))}
                        </nav>

                        {/* Footer / Account */}
                        <div className="mt-auto pt-6 border-t border-white/5">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-[#39FF14]" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-300">Mallku AI Pro</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mb-3">Tu sistema de análisis inteligente está activo y procesando datos.</p>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        className="h-full bg-[#39FF14]"
                                    />
                                </div>
                            </div>
                            <SidebarItem icon={Settings} label="Configuración" />
                            <SidebarItem icon={LogOut} label="Cerrar Sesión" />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
                {/* Subtle Background Glow */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.25 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App;
