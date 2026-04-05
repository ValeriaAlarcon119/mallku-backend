import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, DollarSign, Users, Package, Store, Activity, ShoppingCart, Zap,
    BarChart3, AlertTriangle, ExternalLink, Bell, Target, TrendingDown, Eye,
    MessageCircle, ShoppingBag, X, Mail, Phone, Calendar, CreditCard, ChevronRight,
    Search, Filter, Play, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const MetricCard = ({ title, value, subtext, icon: Icon, trend, color, onClick }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        onClick={onClick}
        className="glass-card p-8 rounded-[2.5rem] cursor-pointer relative overflow-hidden group border border-[var(--mallku-green)]/5"
    >
        <div className={`absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20`} style={{ background: color }} />

        <div className="flex justify-between items-start mb-8">
            <div className={`p-5 rounded-2xl bg-[var(--mallku-bone)] border border-[var(--mallku-green)]/5`}>
                <Icon className="w-7 h-7" style={{ color: color }} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${trend > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>

        <h3 className="text-[var(--mallku-text-muted)] text-[10px] font-black uppercase tracking-[3px] mb-3">{title}</h3>
        <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-[var(--mallku-emerald)] tracking-tighter">{value}</span>
            <span className="text-gray-400 text-[10px] font-black uppercase">{subtext}</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [stock, setStock] = useState([]);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes, heatmapRes, aiRes, stockRes] = await Promise.all([
                    fetch('/api/stats'),
                    fetch('/api/activity'),
                    fetch('/api/products/heatmap'),
                    fetch('/api/ai/recommendation'),
                    fetch('/api/stock')
                ]);

                setStats(await statsRes.json());
                setActivity(await activityRes.json());
                setHeatmap(await heatmapRes.json());
                setAiRecommendation(await aiRes.json());
                setStock(await stockRes.json());
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="relative">
                <div className="w-20 h-20 border-8 border-[var(--mallku-green)]/5 rounded-full animate-pulse" />
                <div className="w-20 h-20 border-t-8 border-[var(--mallku-green)] rounded-full animate-spin absolute top-0 left-0" />
            </div>
        </div>
    );

    return (
        <div className="space-y-12 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black text-[var(--mallku-emerald)] tracking-tighter mb-4 uppercase">Inteligencia <br /><span className="font-light lowercase opacity-30">de productos naturales</span></h1>
                    <div className="flex items-center gap-4">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--mallku-green)] animate-ping" />
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[4px]">Sincronización Activa</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="p-5 bg-white shadow-xl rounded-2xl hover:bg-gray-50 transition-all border border-black/5 relative">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-4 border-white" />
                    </button>
                    <div className="h-12 w-[1px] bg-black/5 mx-2" />
                    <div className="flex items-center gap-5 bg-white px-5 py-3 rounded-2xl shadow-xl border border-black/5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--mallku-green)] to-[var(--mallku-gold)] p-[2px] shadow-lg overflow-hidden">
                            <img src="/dashboard/logo-mallku.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-[var(--mallku-emerald)] leading-none italic uppercase">Admin</span>
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-[3px] mt-1">Mallku Inteligencia</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight (Light Version) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-[1px] rounded-[3rem] bg-gradient-to-r from-[var(--mallku-green)]/20 via-[var(--mallku-gold)]/20 to-[var(--mallku-green)]/20 shadow-2xl"
            >
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.9rem] flex flex-col lg:flex-row items-center gap-8 border-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-[var(--mallku-green)]/5 flex items-center justify-center relative flex-shrink-0 shadow-inner">
                        <Zap className="w-8 h-8 md:w-10 md:h-10 text-[var(--mallku-green)]" />
                        <div className="absolute inset-0 bg-[var(--mallku-green)]/10 blur-2xl rounded-full" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h4 className="text-[var(--mallku-gold)] text-[10px] font-black uppercase tracking-[5px] mb-2">Consultor de Origen Mallku</h4>
                        <p className="text-[var(--mallku-emerald)] text-xl md:text-2xl font-black tracking-tight leading-relaxed max-w-3xl">
                            "{aiRecommendation?.message || "Interpretando el alma de tus ventas para guiar tus próximos pasos..."}"
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-[var(--mallku-gold)] text-white rounded-full font-black text-[10px] uppercase tracking-[4px] hover:scale-105 transition-all flex items-center gap-3 group shadow-[0_20px_40px_-10px_rgba(180,83,9,0.3)] flex-shrink-0">
                        {aiRecommendation?.action || "Optimizar Flujo"}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    title="Ventas del Ciclo"
                    value={`$${stats?.totalRevenue.toLocaleString()}`}
                    subtext="COP"
                    icon={DollarSign}
                    trend={+12.5}
                    color="var(--mallku-green)"
                />
                <MetricCard
                    title="Guardianes"
                    value={stats?.activeCustomers}
                    subtext="Clientes Fieles"
                    icon={Users}
                    trend={+8.2}
                    color="var(--mallku-gold)"
                />
                <MetricCard
                    title="Efectividad"
                    value={`${stats?.conversionRate}%`}
                    subtext="Conversión"
                    icon={Target}
                    trend={-2.4}
                    color="#0EA5E9"
                />
                <MetricCard
                    title="Presencia Total"
                    value={stats?.totalVisits || 0}
                    subtext="Sesiones"
                    icon={Eye}
                    trend={+15.7}
                    color="#F43F5E"
                />
            </div>

            {/* Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] bg-white border border-[var(--mallku-green)]/5">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter text-[var(--mallku-emerald)] uppercase">Deseo Botánico</h3>
                            <p className="text-gray-400 text-[10px] uppercase font-black tracking-[3px] mt-1">Nivel de atracción por producto</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-[var(--mallku-green)] opacity-20" />
                    </div>
                    <div className="space-y-8">
                        {heatmap.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[var(--mallku-emerald)] text-base font-black tracking-tight flex items-center gap-4">
                                        <span className="text-gray-300 font-black">0{idx + 1}</span>
                                        {item.product}
                                    </span>
                                    <span className="text-gray-400 text-[10px] uppercase font-black">{item.clicks} Intenciones</span>
                                </div>
                                <div className="w-full h-4 bg-[var(--mallku-bone)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.clicks / heatmap[0].clicks) * 100}%` }}
                                        transition={{ duration: 1.2, delay: idx * 0.1 }}
                                        className="h-full rounded-full bg-gradient-to-r from-[var(--mallku-green)]/50 to-[var(--mallku-green)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] bg-white border border-[var(--mallku-green)]/5">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black tracking-tighter text-[var(--mallku-emerald)] uppercase">Vibración Live</h3>
                        <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {activity.slice(0, 10).map((act, idx) => (
                            <div key={idx} className="flex gap-6 p-5 rounded-[2rem] bg-[var(--mallku-bone)]/50 hover:bg-[var(--mallku-bone)] transition-all border border-transparent hover:border-[var(--mallku-green)]/5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${act.action === 'checkout' ? 'bg-emerald-500 text-white' : 'bg-white text-[var(--mallku-green)]'
                                    }`}>
                                    {act.action === 'checkout' ? <ShoppingBag className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-base font-black text-[var(--mallku-emerald)] leading-none mb-1.5">{act.product}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">{act.action === 'added_to_cart' ? 'Seleccionado' : 'Ritual de Pago'}</span>
                                        <span className="text-[9px] text-[var(--mallku-green)] font-black uppercase">Ahora</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inventory Alerts (Light Refined) */}
            <div className="p-10 rounded-[3rem] bg-[var(--mallku-bone)] border border-rose-500/10 relative overflow-hidden">
                <div className="flex items-center gap-6 mb-10">
                    <div className="p-4 rounded-2xl bg-white shadow-xl text-rose-500">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[var(--mallku-emerald)] uppercase leading-none">Agotamiento de Origen</h3>
                        <p className="text-rose-500/60 text-[10px] font-black uppercase tracking-[4px] mt-2">Reposición Requerida</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {stock.filter(s => s.status === 'low').map((item, idx) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-white border border-rose-500/5 shadow-sm">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">{item.product}</p>
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-black text-rose-500 tracking-tighter">{item.quantity}</span>
                                <span className="text-[9px] font-black text-white uppercase px-3 py-1.5 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/20">Crítico</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
