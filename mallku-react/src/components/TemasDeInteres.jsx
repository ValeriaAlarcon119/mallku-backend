import React from 'react';
import { motion } from 'framer-motion';
import {
    Leaf, Info, ShieldCheck, Heart, Sparkles, Sprout, Wind, Droplets,
    ArrowRight, Star, Anchor, Flower, Beaker
} from 'lucide-react';

const TopicCard = ({ icon: Icon, title, subtitle, content, details, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        whileHover={{ y: -10 }}
        className="glass-card p-12 rounded-[3.5rem] bg-white border border-[var(--mallku-green)]/5 relative overflow-hidden group min-h-[550px] flex flex-col justify-between"
    >
        {/* Abstract Background Glow (Refined) */}
        <div
            className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20 translate-x-10 -translate-y-10"
            style={{ backgroundColor: color }}
        />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
                <div className="p-6 rounded-[2rem] bg-[var(--mallku-bone)] border border-[var(--mallku-green)]/5" style={{ color: color }}>
                    <Icon className="w-9 h-9" />
                </div>
                <div className="flex -space-x-4">
                    {[1, 2].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-white border border-[var(--mallku-green)]/5 shadow-sm" />
                    ))}
                </div>
            </div>

            <h3 className="text-[var(--mallku-gold)] text-[10px] font-black uppercase tracking-[6px] mb-5">{subtitle}</h3>
            <h2 className="text-4xl font-black text-[var(--mallku-emerald)] tracking-tighter mb-8 group-hover:text-[var(--mallku-green)] transition-colors uppercase leading-none">
                {title}
            </h2>
            <p className="text-[var(--mallku-text-muted)] text-lg leading-relaxed mb-10 font-light">
                "{content}"
            </p>

            <div className="space-y-5">
                {details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-5 group/item">
                        <div className="w-2.5 h-2.5 rounded-full transition-all group-hover/item:scale-150 shadow-sm" style={{ backgroundColor: color }} />
                        <span className="text-sm font-black text-[var(--mallku-emerald)] tracking-tight opacity-70 group-hover/item:opacity-100 transition-opacity">{detail}</span>
                    </div>
                ))}
            </div>
        </div>

        <button className="mt-16 flex items-center gap-5 text-[var(--mallku-emerald)] font-black text-[10px] uppercase tracking-[4px] group/btn transition-all">
            <span className="group-hover/btn:mr-3 transition-all">Esencia Profunda</span>
            <div className="p-3 rounded-full bg-[var(--mallku-bone)] border border-[var(--mallku-green)]/5 shadow-sm group-hover/btn:bg-[var(--mallku-green)] group-hover/btn:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
            </div>
        </button>
    </motion.div>
);

const TemasDeInteres = () => {
    const topics = [
        {
            icon: Leaf,
            title: "Cannabis de Ritual",
            subtitle: "Ciencia Sagrada",
            content: "Nuestro enfoque se centra en la extracción pura y holística, respetando la planta como medicina sagrada para el equilibrio del alma.",
            details: [
                "Full Spectrum (Espectro Completo)",
                "Paz Interna Profunda",
                "Alivio Cordillerano",
                "Conciencia Molecular"
            ],
            color: "var(--mallku-green)",
            delay: 0.1
        },
        {
            icon: Flower,
            title: "Hidrolatos Vivos",
            subtitle: "Botánica de Aire",
            content: "Capturamos el aliento de las flores andinas a través de destilación manual, concentrando propiedades etéreas.",
            details: [
                "Lavanda: Ritual de Sueño",
                "Manzanilla: Suavidad de Nube",
                "Eucalipto: Aliento de Montaña",
                "Sin Síntesis Química"
            ],
            color: "var(--mallku-gold)",
            delay: 0.2
        },
        {
            icon: Beaker,
            title: "Ciclos de Ámbar",
            subtitle: "Alquimia Lenta",
            content: "Maceraciones que duran hasta 60 días en oscuridad sagrada, garantizando que cada gota conserve la vibración vital.",
            details: [
                "Protección de Rayos UV",
                "Cristal de Pureza Mineral",
                "Aceites Base Orgánicos",
                "Sello de Calidad Mallku"
            ],
            color: "#0891B2",
            delay: 0.3
        }
    ];

    return (
        <div className="space-y-28 pb-24">
            {/* Hero Section */}
            <div className="relative text-center py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center -z-10"
                >
                    <div className="w-[800px] h-[800px] bg-[var(--mallku-green)]/5 blur-[150px] rounded-full" />
                </motion.div>

                <h4 className="text-[var(--mallku-gold)] text-[10px] font-black uppercase tracking-[10px] mb-10">O r i g e n • S a b e r • S a n a c i ó n</h4>
                <h1 className="text-6xl md:text-[7rem] font-black text-[var(--mallku-emerald)] tracking-tighter uppercase mb-10 leading-none">
                    Sabiduría <br /><span className="text-transparent font-light bg-clip-text bg-gradient-to-r from-[var(--mallku-emerald)] to-[var(--mallku-gold)] lowercase">Ancestral</span>
                </h1>
                <p className="text-[var(--mallku-text-muted)] text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                    Descubre los pilares botánicos y la ciencia consciente que definen el camino de Mallku.
                </p>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {topics.map((topic, index) => (
                    <TopicCard key={index} {...topic} />
                ))}
            </div>

            {/* Science Highlight Section */}
            <div className="p-16 md:p-24 rounded-[4rem] bg-white border border-[var(--mallku-green)]/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--mallku-green)]/5 to-transparent" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <div className="flex items-center gap-5 mb-10">
                            <Beaker className="w-12 h-12 text-[var(--mallku-green)]" />
                            <h4 className="text-3xl font-black text-[var(--mallku-emerald)] uppercase leading-none">Bio-Afinidad</h4>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-[var(--mallku-emerald)] tracking-tighter uppercase mb-10 leading-none">
                            EL ARTE DE LA <span className="text-[var(--mallku-gold)]">DISOLUCIÓN</span>
                        </h2>
                        <p className="text-[var(--mallku-text-muted)] text-xl leading-relaxed mb-12 font-light">
                            Nuestras formulaciones micro-botánicas permiten que los fitocompuestos atraviesen las barreras lipídicas con una armonía celestial, garantizando una absorción verdadera.
                        </p>
                        <div className="grid grid-cols-2 gap-12">
                            <div className="p-8 bg-[var(--mallku-bone)] rounded-3xl border border-black/5">
                                <span className="block text-5xl font-black text-[var(--mallku-emerald)] mb-3 leading-none">96%</span>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Afinidad Celular</span>
                            </div>
                            <div className="p-8 bg-[var(--mallku-bone)] rounded-3xl border border-black/5">
                                <span className="block text-5xl font-black text-[var(--mallku-green)] mb-3 leading-none">0.05μ</span>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sutileza</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[4rem] bg-[var(--mallku-bone)] border border-[var(--mallku-green)]/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-1000 shadow-inner">
                            <div className="w-64 h-64 rounded-full border-[2px] border-[var(--mallku-green)]/10 animate-spin-slow flex items-center justify-center">
                                <div className="w-48 h-48 rounded-full border-[1px] border-[var(--mallku-gold)]/40 flex items-center justify-center relative">
                                    <Sparkles className="w-16 h-16 text-[var(--mallku-gold)] animate-pulse" />
                                    <div className="absolute inset-0 bg-[var(--mallku-gold)]/10 blur-3xl rounded-full" />
                                </div>
                            </div>
                        </div>
                        {/* Decorative orbits */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 border border-[var(--mallku-green)]/5 rounded-full" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-[var(--mallku-green)]/5 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemasDeInteres;
