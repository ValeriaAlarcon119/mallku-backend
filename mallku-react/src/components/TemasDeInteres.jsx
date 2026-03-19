import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info, ShieldCheck, Heart, Sparkles, Sprout, Wind, Droplets } from 'lucide-react';

const TemasDeInteres = () => {
    const topics = [
        {
            icon: Leaf,
            title: "Cannabis Medicinal",
            subtitle: "Medicina Viva",
            content: "Nuestros aceites esenciales de cannabis son procesados artesanalmente en las montañas de Nariño. Ayudan efectivamente en el tratamiento de ansiedad, agitación, insomnio y dolores crónicos musculares. El cuerpo los asimila rápidamente por ser liposolubles.",
            details: ["Control de Ansiedad", "Dolor Crónico", "Trastornos del Sueño"],
            color: "text-[#39FF14]",
            bg: "bg-[#39FF14]/10"
        },
        {
            icon: Heart,
            title: "Salud Holística",
            subtitle: "Mente & Cuerpo",
            content: "Mejorar la mente, el espíritu y el cuerpo es posible a través de la naturaleza. Los aceites esenciales penetran profundamente en los tejidos debido a sus micro-moléculas, permitiendo una sanación desde adentro hacia afuera.",
            details: ["Psoriasis & Piel", "Salud Menstrual", "Estrés Crónico"],
            color: "text-[#A855F7]",
            bg: "bg-[#A855F7]/10"
        },
        {
            icon: Sprout,
            title: "Origen Ancestral",
            subtitle: "De la Chagra a su Mesa",
            content: "Cultivamos manzanilla, caléndula, tomillo, orégano y lavanda siguiendo tradiciones autóctonas. Respetamos los procesos artesanales de macerados y conservas para preservar la energía vital de cada planta.",
            details: ["Cultivo Orgánico", "Sur de Colombia", "Procesos Manuales"],
            color: "text-[#F59E0B]",
            bg: "bg-[#F59E0B]/10"
        },
        {
            icon: ShieldCheck,
            title: "Conservación Premium",
            subtitle: "Calidad en Vidrio",
            content: "Nuestros productos se presentan en envases de vidrio ámbar de alta calidad. Esto protege las propiedades fotosensibles de los macerados, garantizando que los beneficios terapéuticos se mantengan intactos por más tiempo.",
            details: ["Vidrio Ámbar", "Sin Químicos", "Protección UV"],
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Temas de Interés <span className="text-[#39FF14]">Mallku</span></h1>
                <p className="text-gray-400">Información real y científica sobre nuestra medicina ancestral</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topics.map((topic, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#39FF14]/30 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl ${topic.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <topic.icon className={`w-8 h-8 ${topic.color}`} />
                            </div>
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${topic.color} opacity-70`}>{topic.subtitle}</span>
                                <h3 className="text-2xl font-bold text-white mb-3">{topic.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">{topic.content}</p>
                                <div className="flex flex-wrap gap-2">
                                    {topic.details.map((detail, dIdx) => (
                                        <span key={dIdx} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-tighter border border-white/5">
                                            {detail}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Science Highlight Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#39FF14]/5 to-transparent border border-[#39FF14]/20 rounded-3xl p-8 mt-12 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10">
                    <Droplets className="w-64 h-64 text-[#39FF14]" />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-[#39FF14]" />
                        Ciencia & Absorción
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        La efectividad de Mallku reside en la pureza. Nuestros aceites esenciales se asimilan eficientemente 
                        por dos razones fundamentales comprobadas: sus compuestos son extremadamente pequeños (pasan membranas) 
                        y son liposolubles (afines a las grasas del cuerpo humano).
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h4 className="text-[#39FF14] font-bold text-sm mb-1 uppercase tracking-tighter">Penetración profunda</h4>
                            <p className="text-xs text-gray-500">Actúa a nivel celular en menos de 5 minutos.</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h4 className="text-[#39FF14] font-bold text-sm mb-1 uppercase tracking-tighter">Sin residuos</h4>
                            <p className="text-xs text-gray-500">100% natural, sin químicos sintéticos añadidos.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TemasDeInteres;
