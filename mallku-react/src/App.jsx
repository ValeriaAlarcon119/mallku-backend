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
    Heart,
    BarChart3
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TemasDeInteres from './components/TemasDeInteres';
import './index.css';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <motion.button
        whileHover={{ x: 6, backgroundColor: "rgba(6, 78, 59, 0.05)" }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 relative group ${active
                ? 'bg-[var(--mallku-green)]/10 text-[var(--mallku-green)] font-bold shadow-sm'
                : 'text-[var(--mallku-text-muted)] font-medium hover:text-[var(--mallku-green)]'
            }`}
    >
        <div className="flex items-center gap-4 relative z-10">
            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-[var(--mallku-green)]' : 'text-gray-400'}`} />
            <span className="text-sm tracking-tight">{label}</span>
        </div>

        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1.5 h-6 bg-[var(--mallku-green)] rounded-r-full shadow-[0_0_15px_rgba(6,78,59,0.3)]"
            />
        )}

        {badge && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${active ? 'bg-[var(--mallku-green)]/20 text-[var(--mallku-green)]' : 'bg-gray-100 text-gray-500'}`}>
                {badge}
            </span>
        )}
    </motion.button>
);

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    // Sidebar cerrado por defecto en móvil, abierto solo en pantallas grandes
    const [sidebarOpen, setSidebarOpen] = useState(
        typeof window !== 'undefined' && window.innerWidth >= 1024
    );

    const menuItems = [
        { id: 'dashboard', label: 'Centro de Comando', icon: LayoutDashboard, badge: 'Live IA' },
        { id: 'temas', label: 'Sabores Mallku', icon: BookOpen },
        { id: 'tienda', label: 'Catálogo Vivo', icon: ShoppingBag },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'temas':
                return <TemasDeInteres />;
            case 'tienda':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-8">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-10 border border-[var(--mallku-green)]/5 shadow-2xl">
                            <ShoppingBag className="w-10 h-10 text-[var(--mallku-green)] opacity-80" />
                        </div>
                        <h2 className="text-5xl font-black text-[var(--mallku-emerald)] mb-6 uppercase tracking-tighter">Catálogo <br /><span className="font-light lowercase opacity-40">en vivo</span></h2>
                        <p className="text-[var(--mallku-text-muted)] max-w-lg mb-12 text-lg leading-relaxed font-light">
                            La interfaz de cliente se sincroniza con el inventario sagrado en tiempo real.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                onClick={() => window.open('https://tienda-mallku.netlify.app', '_blank')}
                                className="bg-[var(--mallku-green)] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.3)] transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Abrir Catálogo
                            </button>
                        </div>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--mallku-bone)] text-[var(--mallku-text)] flex overflow-hidden">
            {/* Background Glows (Refined) */}
            <div className="bg-glow glow-green top-[-300px] right-[-100px] opacity-[0.05]" />
            <div className="bg-glow glow-gold bottom-[-300px] left-[-200px] opacity-[0.02]" />

            {/* Sidebar toggle for mobile */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-6 right-6 z-[100] p-4 bg-white shadow-xl rounded-2xl border border-black/5"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[var(--mallku-green)]" />}
            </button>

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.aside
                        initial={{ x: -activeTab === 'dashboard' ? 0 : 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        className={`fixed lg:relative z-[90] w-80 h-screen bg-white/80 backdrop-blur-3xl border-r border-black/5 p-10 flex flex-col transition-all duration-300 ${sidebarOpen ? 'flex' : 'hidden lg:flex'
                            }`}
                    >
                        {/* Logo Redux */}
                        <div className="flex items-center gap-5 mb-20 px-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--mallku-green)] to-[var(--mallku-gold)] p-[2px] shadow-2xl">
                                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/dashboard/logo-mallku.jpg" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-[var(--mallku-emerald)] tracking-tighter leading-none uppercase">Mallku</span>
                            </div>
                        </div>

                        {/* Navigation Section */}
                        <nav className="flex-1 space-y-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-[6px] mb-8 px-4 opacity-50">Ecosistema Vivo</p>
                            {menuItems.map(item => (
                                <SidebarItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.id}
                                    badge={item.badge}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                />
                            ))}
                        </nav>

                        {/* Pro Upgrade Light Section */}
                        <div className="mt-auto pt-10 border-t border-black/5">
                            <div className="p-8 bg-[var(--mallku-bone)] rounded-[2.5rem] border border-black/5 mb-10 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--mallku-green)]/5 blur-3xl" />
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Zap className="w-5 h-5 text-[var(--mallku-green)]" />
                                    </div>
                                    <span className="text-sm font-black text-[var(--mallku-emerald)] tracking-tighter">V. 2.5 LIVE</span>
                                </div>
                                <p className="text-[11px] text-[var(--mallku-text-muted)] mb-6 leading-relaxed">Modelos de lenguaje afinados con la herencia botánica de Mallku.</p>
                                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '96%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-[var(--mallku-green)] to-[var(--mallku-green-light)]"
                                    />
                                </div>
                            </div>
                            <SidebarItem icon={Settings} label="Global Config" />
                            <SidebarItem icon={LogOut} label="Salir del Nexus" />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Area */}
            <main className="flex-1 h-screen overflow-y-auto relative px-8 md:px-16 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full max-w-7xl mx-auto"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App;
