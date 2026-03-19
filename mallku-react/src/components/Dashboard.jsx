import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, DollarSign, Users, Package, Store, Activity, ShoppingCart, Zap,
    BarChart3, AlertTriangle, ExternalLink, Bell, Target, TrendingDown, Eye,
    MessageCircle, ShoppingBag, X, Mail, Phone, Calendar, CreditCard
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [ltv, setLtv] = useState([]);
    const [funnel, setFunnel] = useState([]);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [stock, setStock] = useState([]);
    const [abandonedCarts, setAbandonedCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [lastVisitCount, setLastVisitCount] = useState(0);

    // Modal state
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes, heatmapRes, ltvRes, funnelRes, aiRes, stockRes, abandonedRes] = await Promise.all([
                    fetch('http://localhost:3000/api/stats'),
                    fetch('http://localhost:3000/api/activity'),
                    fetch('http://localhost:3000/api/products/heatmap'),
                    fetch('http://localhost:3000/api/customers/ltv'),
                    fetch('http://localhost:3000/api/funnel'),
                    fetch('http://localhost:3000/api/ai/recommendation'),
                    fetch('http://localhost:3000/api/stock'),
                    fetch('http://localhost:3000/api/abandoned-carts')
                ]);

                const statsData = await statsRes.json();
                setStats(statsData);
                setActivity(await activityRes.json());
                setHeatmap(await heatmapRes.json());
                setLtv(await ltvRes.json());
                setFunnel(await funnelRes.json());
                setAiRecommendation(await aiRes.json());
                setStock(await stockRes.json());
                setAbandonedCarts(await abandonedRes.json());
                setLoading(false);

                if (lastVisitCount > 0 && statsData.totalVisits > lastVisitCount) {
                    showNotification('👁️ Nueva visita a la tienda!', 'success');
                }
                setLastVisitCount(statsData.totalVisits);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [lastVisitCount]);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const openStore = () => {
        window.open('https://tienda-mallku.netlify.app', '_blank');
    };

    // Modal handlers
    const openModal = async (type) => {
        setActiveModal(type);
        setModalLoading(true);
        try {
            let res;
            switch (type) {
                case 'revenue':
                    res = await fetch('http://localhost:3000/api/sales/details');
                    break;
                case 'customers':
                    res = await fetch('http://localhost:3000/api/customers/details');
                    break;
                case 'orders':
                    res = await fetch('http://localhost:3000/api/orders/monthly');
                    break;
                case 'conversion':
                    res = await fetch('http://localhost:3000/api/funnel');
                    break;
                default:
                    return;
            }
            const data = await res.json();
            setModalData(data);
        } catch (error) {
            console.error('Error fetching modal data:', error);
        }
        setModalLoading(false);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // Modal content renderers
    const renderRevenueModal = () => {
        if (!modalData) return null;
        return (
            <>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#39FF14]/20 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-[#39FF14]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Resumen de Ingresos</h3>
                        <p className="text-gray-400">Desglose completo de ventas por cliente</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total General</p>
                        <p className="text-2xl font-bold text-[#39FF14]">${modalData.grandTotal?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total Pedidos</p>
                        <p className="text-2xl font-bold text-white">{modalData.totalOrders}</p>
                    </div>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {modalData.summary?.map((client, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#39FF14]/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white text-lg">{client.name}</h4>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Mail className="w-3 h-3" />
                                        <span>{client.email}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#39FF14] font-bold text-lg">${client.total?.toLocaleString()}</p>
                                    <p className="text-gray-500 text-xs">{client.orders} pedidos</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {client.products?.map((prod, pIdx) => (
                                    <span key={pIdx} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                                        {prod}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        );
    };

    const renderCustomersModal = () => {
        if (!modalData) return null;
        return (
            <>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Clientes Activos</h3>
                        <p className="text-gray-400">{modalData.length} clientes registrados con sus datos de contacto</p>
                    </div>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {modalData.map((client, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white text-lg mb-1">{client.name}</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <Phone className="w-3.5 h-3.5 text-green-400" />
                                            <span>{client.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Última compra: {new Date(client.lastPurchase).toLocaleDateString('es-CO')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-400 font-bold text-lg">${client.totalSpent?.toLocaleString()}</p>
                                    <p className="text-gray-500 text-xs">{client.orders} pedidos</p>
                                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 rounded-full text-blue-300 mt-1 inline-block">
                                        ❤️ {client.favoriteProduct}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        );
    };

    const renderOrdersModal = () => {
        if (!modalData) return null;
        return (
            <>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Pedidos del Mes</h3>
                        <p className="text-gray-400">Febrero 2026 — Detalle de cada pedido</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                        <p className="text-gray-400 text-sm">Total del Mes</p>
                        <p className="text-2xl font-bold text-purple-400">${modalData.totalMonth?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                        <p className="text-gray-400 text-sm">Cantidad de Pedidos</p>
                        <p className="text-2xl font-bold text-white">{modalData.count}</p>
                    </div>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                    {modalData.orders?.map((order, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white">{order.customerName}</h4>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Mail className="w-3 h-3" />
                                        <span>{order.customerEmail}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-purple-400 font-bold text-lg">${order.amount?.toLocaleString()}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.channel === 'online' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                        {order.channel === 'online' ? '🌐 Online' : '🏪 Física'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex flex-wrap gap-1">
                                    {order.products?.map((prod, pIdx) => (
                                        <span key={pIdx} className="text-xs px-2 py-1 bg-purple-500/10 rounded-full text-purple-200">
                                            {prod}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(order.timestamp).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        );
    };

    const renderConversionModal = () => {
        if (!modalData) return null;
        return (
            <>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Embudo de Conversión</h3>
                        <p className="text-gray-400">Análisis detallado de cada etapa</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {modalData.map((stage, idx) => {
                        const colors = ['from-blue-500 to-cyan-400', 'from-yellow-500 to-orange-400', 'from-green-500 to-emerald-400', 'from-purple-500 to-pink-400'];
                        const bgColors = ['bg-blue-500/10 border-blue-500/30', 'bg-yellow-500/10 border-yellow-500/30', 'bg-green-500/10 border-green-500/30', 'bg-purple-500/10 border-purple-500/30'];
                        const textColors = ['text-blue-400', 'text-yellow-400', 'text-green-400', 'text-purple-400'];
                        const icons = ['👁️', '🛒', '📱', '💰'];
                        const descriptions = [
                            'Personas que visitaron tu tienda online',
                            'Visitantes que agregaron productos al carrito',
                            'Clientes que hicieron clic en WhatsApp para contactarte',
                            'Personas que completaron una compra'
                        ];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`rounded-xl p-5 border ${bgColors[idx]}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{icons[idx]}</span>
                                        <div>
                                            <h4 className="font-semibold text-white text-lg">{stage.stage}</h4>
                                            <p className="text-gray-400 text-xs">{descriptions[idx]}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-3xl font-bold ${textColors[idx]}`}>{stage.count}</p>
                                        <p className="text-gray-500 text-xs">{stage.rate}% del anterior</p>
                                    </div>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stage.rate}%` }}
                                        transition={{ duration: 1, delay: 0.3 + idx * 0.15 }}
                                        className={`h-full bg-gradient-to-r ${colors[idx]} rounded-full`}
                                    />
                                </div>
                                {idx < modalData.length - 1 && (
                                    <div className="flex items-center justify-center mt-3 text-gray-500">
                                        <TrendingDown className="w-4 h-4 mr-1" />
                                        <span className="text-xs">
                                            Pierdes {stage.count - (modalData[idx + 1]?.count || 0)} ({(100 - parseFloat(modalData[idx + 1]?.rate || 0)).toFixed(1)}%)
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-[#39FF14] flex items-center gap-3">
                    <Activity className="w-6 h-6 animate-pulse" />
                    <span className="text-xl">Cargando Central de Inteligencia...</span>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'Ingresos Totales', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'text-[#39FF14]', modalType: 'revenue' },
        { label: 'Clientes Activos', value: stats?.activeCustomers || 0, trend: '+8.2%', icon: Users, color: 'text-blue-400', modalType: 'customers' },
        { label: 'Pedidos del Mes', value: stats?.monthlyOrders || 0, trend: '+18.7%', icon: Package, color: 'text-purple-400', modalType: 'orders' },
        { label: 'Conversión', value: `${stats?.conversionRate || 0}%`, trend: stats?.conversionRate > 20 ? '+0.5%' : '-2.3%', icon: Store, color: stats?.conversionRate > 20 ? 'text-orange-400' : 'text-red-400', modalType: 'conversion' }
    ];

    const getAlertColor = (type) => {
        switch (type) {
            case 'urgente': return 'border-red-500 bg-red-500/10';
            case 'alerta': return 'border-orange-500 bg-orange-500/10';
            case 'oportunidad': return 'border-yellow-500 bg-yellow-500/10';
            case 'recuperación': return 'border-purple-500 bg-purple-500/10';
            default: return 'border-green-500 bg-green-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 relative">
            {/* Toast Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-[#39FF14] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="font-medium">{notification.message}</span>
                        <button onClick={() => setNotification(null)}>
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-[#111111] rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Modal Body */}
                            {modalLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Activity className="w-6 h-6 text-[#39FF14] animate-pulse" />
                                    <span className="ml-3 text-gray-400">Cargando datos...</span>
                                </div>
                            ) : (
                                <>
                                    {activeModal === 'revenue' && renderRevenueModal()}
                                    {activeModal === 'customers' && renderCustomersModal()}
                                    {activeModal === 'orders' && renderOrdersModal()}
                                    {activeModal === 'conversion' && renderConversionModal()}
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating "Ver Tienda" Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={openStore}
                className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold transition-all hover:scale-105"
            >
                <ExternalLink className="w-5 h-5" />
                Ver Tienda en Vivo
            </motion.button>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Central de Inteligencia <span className="text-[#39FF14]">Mallku</span>
                        </h1>
                        <p className="text-gray-400">Growth Analytics + IA Consultant</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Activity className="w-4 h-4 text-[#39FF14] animate-pulse" />
                        <span className="text-sm text-gray-300">En vivo</span>
                    </div>
                </div>
            </motion.div>

            {/* AI Recommendation Alert */}
            {aiRecommendation && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-7xl mx-auto mb-8 p-6 rounded-2xl border-2 ${getAlertColor(aiRecommendation.type)} backdrop-blur-lg`}
                >
                    <div className="flex items-start gap-4">
                        <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0 animate-pulse" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">IA Sales Consultant</h3>
                            <p className="text-gray-200 mb-3">{aiRecommendation.message}</p>
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                                {aiRecommendation.action}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Metrics Grid - CLICKABLE */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    const isNegative = metric.trend.startsWith('-');
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => openModal(metric.modalType)}
                            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-[#39FF14]/30 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
                                    <h3 className="text-3xl font-bold text-white mb-2">{metric.value}</h3>
                                    <div className="flex items-center gap-1">
                                        {isNegative ? <TrendingDown className="w-4 h-4 text-red-400" /> : <TrendingUp className={`w-4 h-4 ${metric.color}`} />}
                                        <span className={`text-sm font-medium ${isNegative ? 'text-red-400' : metric.color}`}>{metric.trend}</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500">Click para ver detalle →</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Conversion Funnel (RADAR DE INTENCIÓN) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-7xl mx-auto mb-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-bold">🎯 Radar de Intención (Funnel Sales)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {funnel.map((stage, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-4xl font-bold text-white mb-1">{stage.count}</div>
                            <div className="text-sm text-gray-400 mb-2">{stage.stage}</div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stage.rate}%` }}
                                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{stage.rate}% del anterior</div>
                        </div>
                    ))}
                </div>
                {stats?.funnelConversion && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-yellow-300">
                            ⚠️ De {stats.funnelConversion.visits} visitas, solo {stats.funnelConversion.purchases} compraron.
                            <strong className="text-white"> Estás perdiendo {((1 - stats.funnelConversion.purchases / stats.funnelConversion.visits) * 100).toFixed(0)}% de ventas potenciales.</strong>
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Stock Monitor & Abandoned Carts */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Stock Monitor */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-400" />
                            <h2 className="text-xl font-bold">Monitor de Stock</h2>
                        </div>
                        <button className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30">
                            Actualizar Inventario
                        </button>
                    </div>
                    <div className="space-y-3">
                        {stock.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                                <div className="flex items-center gap-3">
                                    {item.status === 'low' && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
                                    <span className="text-sm text-gray-300">{item.product}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${item.status === 'low' ? 'text-red-400' : item.status === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {item.quantity}
                                    </span>
                                    <span className="text-xs text-gray-500">unidades</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Abandoned Carts */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-purple-400" />
                            <h2 className="text-xl font-bold">Carritos Abandonados</h2>
                        </div>
                        <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                            {abandonedCarts.length} oportunidades
                        </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {abandonedCarts.map((cart, idx) => (
                            <motion.div
                                key={cart.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-white">${cart.totalAmount.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500">{new Date(cart.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="text-xs text-gray-400">{cart.products.join(', ')}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Product Heatmap & Real-time Activity */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-[#39FF14]" />
                        <h2 className="text-xl font-bold">Top Products (Heatmap)</h2>
                    </div>
                    <div className="space-y-3">
                        {heatmap.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">{item.product}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.clicks / (heatmap[0]?.clicks || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                            className="h-full bg-[#39FF14]"
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-white w-8 text-right">{item.clicks}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Eye className="w-5 h-5 text-orange-400" />
                        <h2 className="text-xl font-bold">Actividad en Tiempo Real</h2>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {activity.slice(0, 10).map((act, idx) => (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm text-white">{act.product}</p>
                                    <p className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleTimeString()}</p>
                                </div>
                                <ShoppingCart className="w-4 h-4 text-gray-400" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Customer LTV */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
                <h2 className="text-xl font-bold mb-4">Top Customers (Lifetime Value)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Cliente</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Gastado</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Pedidos</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Promedio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ltv.map((customer, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white font-medium">{customer.name}</td>
                                    <td className="py-3 px-4 text-[#39FF14] font-semibold">${customer.totalSpent.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-gray-300">{customer.orders}</td>
                                    <td className="py-3 px-4 text-gray-300">${customer.avgOrder.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm">
                <p>🧠 Central de Inteligencia con IA · Node.js Backend · React + Framer Motion</p>
            </div>
        </div>
    );
};

export default Dashboard;
