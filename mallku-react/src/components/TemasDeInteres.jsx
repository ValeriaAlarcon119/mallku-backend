import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, Heart, Sparkles, ArrowRight, Beaker, TrendingUp, Users,
    Brain, Linkedin, Code2, Dog, FlaskConical, Smile, Wind,
    Star, BookOpen, ShoppingBag, Palette, Zap, Shield, Sun,
    MessageCircle, Target, Award, Globe, ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Componentes de UI ────────────────────────────────────────────────────────

const SectionHeader = ({ eyebrow, title, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 md:mb-16"
    >
        <p className="text-[var(--mallku-gold)] text-[9px] font-black uppercase tracking-[10px] mb-4">{eyebrow}</p>
        <h2 className="text-3xl md:text-5xl font-black text-[var(--mallku-emerald)] tracking-tighter uppercase leading-none mb-5">{title}</h2>
        <p className="text-[var(--mallku-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">{subtitle}</p>
    </motion.div>
);

const TopicCard = ({ icon: Icon, title, subtitle, content, details, color, badge, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay }}
        whileHover={{ y: -6 }}
        className="bg-white border border-[var(--mallku-green)]/5 relative overflow-hidden group flex flex-col rounded-[2.5rem] p-7 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500"
    >
        <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity translate-x-8 -translate-y-8" style={{ backgroundColor: color }} />

        <div className="relative z-10 flex-1">
            <div className="flex items-start justify-between mb-7">
                <div className="p-4 rounded-2xl bg-[var(--mallku-bone)] border border-[var(--mallku-green)]/5" style={{ color }}>
                    <Icon className="w-7 h-7" />
                </div>
                {badge && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border" style={{ color, borderColor: color + '50', backgroundColor: color + '15' }}>
                        {badge}
                    </span>
                )}
            </div>

            <p className="text-[var(--mallku-gold)] text-[8px] font-black uppercase tracking-[5px] mb-3">{subtitle}</p>
            <h3 className="text-2xl font-black text-[var(--mallku-emerald)] tracking-tight mb-5 uppercase leading-tight group-hover:text-[var(--mallku-green)] transition-colors">
                {title}
            </h3>
            <p className="text-[var(--mallku-text-muted)] text-sm leading-relaxed mb-7 font-light">"{content}"</p>

            <div className="space-y-2.5">
                {details.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm text-[var(--mallku-emerald)] font-medium opacity-75">{d}</span>
                    </div>
                ))}
            </div>
        </div>

        <button className="mt-8 flex items-center gap-3 text-[var(--mallku-emerald)] font-black text-[8px] uppercase tracking-[4px] group/btn">
            <span className="group-hover/btn:mr-1 transition-all">Explorar</span>
            <div className="p-2 rounded-full bg-[var(--mallku-bone)] group-hover/btn:bg-[var(--mallku-green)] group-hover/btn:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
            </div>
        </button>
    </motion.div>
);

const TipCard = ({ icon: Icon, title, tip, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="bg-white rounded-2xl p-6 border border-[var(--mallku-green)]/5 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: color + '15', color }}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-black text-[var(--mallku-emerald)] uppercase tracking-tight mb-2">{title}</h4>
                <p className="text-xs text-[var(--mallku-text-muted)] leading-relaxed font-light">{tip}</p>
            </div>
        </div>
    </motion.div>
);

const StatBadge = ({ value, label, color }) => (
    <div className="p-5 bg-[var(--mallku-bone)] rounded-2xl border border-black/5 text-center">
        <span className="block text-3xl font-black mb-1 leading-none" style={{ color }}>{value}</span>
        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{label}</span>
    </div>
);

// ─── Datos de contenido ───────────────────────────────────────────────────────

const secciones = {
    cbd_mascotas: [
        {
            icon: Dog,
            title: "CBD & Mascotas 2025",
            subtitle: "Estudios Recientes",
            badge: "Verificado",
            content: "Cornell University (2024): el 89% de perros con OA mostraron reducción de dolor con CBD. El sistema endocannabinoide existe en todos los mamíferos, validando su uso veterinario.",
            details: [
                "Reduce ansiedad por separación en gatos (estudio Frontiers, 2024)",
                "Antiinflamatorio natural para displasia de cadera",
                "Sin toxicidad hepática en dosis de 2mg/kg",
                "Colorado State Univ. confirma reducción de convulsiones"
            ],
            color: "#10b981", delay: 0.1
        },
        {
            icon: Shield,
            title: "Aceite de Mascotas Mallku",
            subtitle: "Full Spectrum Artesanal",
            badge: "Mallku",
            content: "Formulación con aceite de coco orgánico y extracto full spectrum. Dosificación exacta por peso en cada gota para máxima seguridad.",
            details: [
                "Base de aceite de coco (MCT puro)",
                "0.5mg/mL dosificación precisa",
                "Sin pesticidas · Sin aditivos",
                "Sabor neutro aceptado por animales"
            ],
            color: "#059669", delay: 0.2
        },
        {
            icon: Star,
            title: "Cómo Aplicarlo",
            subtitle: "Guía Práctica",
            badge: "Tips",
            content: "Protocolos de aplicación comprobados para lograr resultados visibles en las primeras 2 semanas de uso continuo en mascotas.",
            details: [
                "Iniciar con dosis mínima (baja y sube)",
                "Aplicar directo bajo la lengua o en comida",
                "Perros < 10kg: 1-2mg/día · > 10kg: 2-5mg/día",
                "Registrar cambios de comportamiento"
            ],
            color: "#f59e0b", delay: 0.3
        }
    ],

    cbd_humanos: [
        {
            icon: Brain,
            title: "Neurología & CBD",
            subtitle: "Ciencia 2024-2025",
            badge: "Evidencia Fuerte",
            content: "El estudio de Harvard Medical (2024) demuestra que el CBD modula los receptores GABA, reduciendo ansiedad generalizada sin sedación excesiva.",
            details: [
                "Reduce cortisol hasta 37% en pruebas de estrés",
                "Mejora latencia de sueño (estudio JAMA, 2024)",
                "Compatible con ansiedad, TEPT y TOC",
                "No genera dependencia física (OMS 2023)"
            ],
            color: "#6366f1", delay: 0.1
        },
        {
            icon: Heart,
            title: "Dolor Crónico & CBD",
            subtitle: "Tratamiento Natural",
            badge: "Clínico",
            content: "Meta-análisis de 32 estudios (Lancet, 2024): el CBD ofrece alivio estadísticamente significativo en dolor musculoesquelético, fibromialgia y artritis.",
            details: [
                "Inhibe COX-2 (como el ibuprofeno, sin efectos GI)",
                "Fibromialgia: 64% reportó mejoría sostenida",
                "Artritis reumatoide: reduce marcadores inflamatorios",
                "Sin interacciones graves con AINE moderados"
            ],
            color: "#e11d48", delay: 0.2
        },
        {
            icon: Sun,
            title: "Bienestar Diario",
            subtitle: "Uso Preventivo",
            badge: "Rutina",
            content: "El uso preventivo del CBD en dosis bajas (10-25mg/día) está asociado a menor inflamación sistémica y mejor regulación del estado de ánimo.",
            details: [
                "En ayunas para máxima absorción",
                "Full spectrum > isolate (efecto entourage)",
                "Aceite de oliva o coco como base ideal",
                "Resultados sostenidos desde semana 3-4"
            ],
            color: "#d97706", delay: 0.3
        }
    ],

    salud_emocional: [
        {
            icon: Smile,
            title: "CBD & Emociones",
            subtitle: "Salud Mental Natural",
            badge: "Nuevo",
            content: "El sistema endocannabinoide regula directamente el miedo, la alegría y la empatía. El CBD potencia los endocannabinoides naturales sin alterar la mente.",
            details: [
                "Regula amígdala (centro del miedo)",
                "Aumenta anandamida ('molécula de la felicidad')",
                "Reduce pensamientos rumiativos",
                "Sin 'high' ni efectos psicoactivos"
            ],
            color: "#ec4899", delay: 0.1
        },
        {
            icon: Wind,
            title: "Aromáticas & Emoción",
            subtitle: "Aromaterapia Andina",
            badge: "Mallku",
            content: "Las aromáticas de Mallku potencian el bienestar emocional a través del sistema límbico. Manzanilla calma, Lavanda relaja, Cannabis equilibra.",
            details: [
                "Lavanda: reduce ansiedad en 68% (Journal Biol Chem)",
                "Manzanilla: efecto antidepresivo demostrado",
                "Cannabis aromática: equilibrio del humor",
                "Ritual de 10 min. al día transforma el estado mental"
            ],
            color: "#8b5cf6", delay: 0.2
        },
        {
            icon: BookOpen,
            title: "Rutinas de Bienestar",
            subtitle: "Protocolo Mallku",
            badge: "Guía",
            content: "Combinar CBD con plantas medicinales andinas y rituales conscientes crea un estado de coherencia corporal que ciencia y tradición respaldan.",
            details: [
                "Mañana: CBD + respiración + aromática cítrica",
                "Tarde: tintura de plantas adaptógenas",
                "Noche: aceite de lavanda + CBD sublingual",
                "Resultados en 21 días de consistencia"
            ],
            color: "#0891b2", delay: 0.3
        }
    ],

    mallku_productos: [
        {
            icon: FlaskConical,
            title: "Hidrolatos Vivos",
            subtitle: "Botánica de Aire",
            badge: "Artesanal",
            content: "Destilados al vapor en pequeños lotes, capturando el 'agua floral' de lavanda, manzanilla y romero andino. Propiedades que van directo a la piel.",
            details: [
                "pH balanceado para piel sensible",
                "Lavanda: sedante, cicatrizante",
                "Manzanilla: antiinflamatorio suave",
                "Romero: estimulante capilar probado"
            ],
            color: "#06b6d4", delay: 0.1
        },
        {
            icon: Leaf,
            title: "Tinturas & Ungüentos",
            subtitle: "Formulaciones Potentes",
            badge: "Ancestral",
            content: "Maceración de 60 días en alcohol medicinal con hierbas seleccionadas a mano. Concentración 1:5 planta-solvente para máxima potencia.",
            details: [
                "Cúrcuma + pimienta negra: biodisponibilidad x20",
                "Árnica + cannabis: recuperación muscular",
                "Ungüento de caléndula: cicatrización acelerada",
                "Sin parabenos · Sin BHT · Sin SLS"
            ],
            color: "#84cc16", delay: 0.2
        },
        {
            icon: Sparkles,
            title: "Aromáticas Premium",
            subtitle: "Plantas Andinas",
            badge: "Exclusivo",
            content: "Recolectadas en las estribaciones de los Andes a más de 2800msnm, donde la concentración de fitocompuestos es naturalmente más alta.",
            details: [
                "Cannabis, Stevia, Manzanilla y Caléndula",
                "Secado solar tradicional (no industrial)",
                "Presentación granel y frasco premium",
                "Certificado libre de agroquímicos"
            ],
            color: "#f97316", delay: 0.3
        }
    ]
};

const tipsVenta = [
    { icon: Target, title: "Storytelling de Ingredientes", tip: "Nombra el origen de cada planta. 'Manzanilla de los páramos de Nariño' vende 3x más que 'Manzanilla'.", color: "#10b981" },
    { icon: MessageCircle, title: "Antes & Después en Historias", tip: "Publica testimonios reales de clientes con fotos de la transformación. El CBD en mascotas genera compartidos virales.", color: "#6366f1" },
    { icon: ShoppingBag, title: "Kits Temáticos", tip: "Crea bundles: 'Kit Sueño' (lavanda + CBD + manzanilla). El ticket promedio aumenta 60% con kits vs. productos individuales.", color: "#f59e0b" },
    { icon: Globe, title: "SEO Local Nariño", tip: "Usa palabras clave como 'aceite CBD Pasto', 'aromáticas naturales Nariño'. La competencia SEO local es muy baja.", color: "#e11d48" },
    { icon: Award, title: "Certificados Visibles", tip: "Muestra tu proceso artesanal en video. La transparencia genera confianza. Añade sellos de 'Sin pesticidas' en cada empaque.", color: "#0891b2" },
    { icon: Zap, title: "WhatsApp Business Catálogo", tip: "Activa el catálogo de WhatsApp Business con precios y fotos. El 78% de tus compradores prefieren cerrar ventas por chat.", color: "#8b5cf6" },
    { icon: Sun, title: "Lives de Educación", tip: "Un live semanal de 20 min sobre beneficios del CBD genera 5x más ventas que publicidad pagada para marcas naturales.", color: "#d97706" },
    { icon: Star, title: "Programa de Referidos", tip: "Ofrece un descuento del 10% por cada amigo referido. Los clientes naturistas son muy leales y comunidad-driven.", color: "#ec4899" }
];

const tipsDiseno = [
    { icon: Palette, title: "Fondos Botánicos Sutiles", tip: "Usa texturas de hojas o degradados en verde esmeralda y blanco hueso. Evita fondos blancos puros — se ven hospitalarios, no premium.", color: "#10b981" },
    { icon: Code2, title: "Glassmorphism para CBD", tip: "Cards con `backdrop-blur` y bordes translúcidos comunican pureza y transparencia — exacto para marcas naturales y de bienestar.", color: "#6366f1" },
    { icon: Brain, title: "Tipografía de Lujo + Sans", tip: "Combina una fuente serif de lujo (títulos) con Plus Jakarta Sans (cuerpo). Comunica artesanal y moderno al mismo tiempo.", color: "#f59e0b" },
    { icon: Zap, title: "Micro-animaciones de Entrada", tip: "Las animaciones de fade-up al hacer scroll aumentan el tiempo en página un 35%. Con Framer Motion, se logran en 5 líneas.", color: "#e11d48" },
    { icon: Shield, title: "Sección de Certificados", tip: "Una sección visual con íconos de 'Sin pesticidas', 'Artesanal', '100% Natural' duplica la tasa de conversión en sitios CBD.", color: "#0891b2" },
    { icon: Globe, title: "Mobile First Siempre", tip: "El 73% del tráfico de marcas naturales viene de móvil. Diseña primero para pantalla de 390px, luego escala a desktop.", color: "#8b5cf6" }
];

const tipsRRHH = [
    { icon: Linkedin, title: "Boolean Search Cannabis", tip: "Busca en LinkedIn: 'químico farmacéutico' AND ('cannabis' OR 'CBD') AND 'Colombia'. Filtra por Nariño o Bogotá.", color: "#0077b5" },
    { icon: Users, title: "Cultura de Bienestar Real", tip: "Las empresas de productos naturales que ofrecen acceso a sus productos como beneficio retienen 2x más talento joven comprometido.", color: "#10b981" },
    { icon: Award, title: "Perfiles Clave para Mallku", tip: "Prioriza: Químico/Bioquímico, Comunicador con enfoque wellness, y un Diseñador UX con portfolio de marcas orgánicas.", color: "#f59e0b" },
    { icon: Brain, title: "Entrevistas por Valores", tip: "Pregunta: '¿Qué planta medicinal usarías si te sintieras agotado y por qué?' Los mejores perfiles para Mallku tienen sensibilidad natural.", color: "#8b5cf6" },
    { icon: Target, title: "Employer Branding Natural", tip: "Comparte el proceso de producción en LinkedIn. Las marcas auténticas atraen candidatos alineados que trabajan con mayor motivación.", color: "#ec4899" },
    { icon: Zap, title: "Freelancers CBD Especializados", tip: "Plataformas como Workana y Upwork tienen nutricionistas y terapeutas naturistas que pueden crear contenido técnico de alta calidad por proyecto.", color: "#0891b2" }
];

// ─── Componente Principal ─────────────────────────────────────────────────────

const TemasDeInteres = () => {
    const [openSection, setOpenSection] = useState(null);

    return (
        <div className="space-y-20 md:space-y-28 pb-16">

            {/* Hero */}
            <div className="relative text-center py-16">
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[500px] h-[500px] bg-[var(--mallku-green)]/5 blur-[120px] rounded-full" />
                </div>
                <p className="text-[var(--mallku-gold)] text-[9px] font-black uppercase tracking-[10px] mb-6">O r i g e n • S a b e r • S a n a c i ó n</p>
                <h1 className="text-4xl sm:text-5xl md:text-[6rem] font-black text-[var(--mallku-emerald)] tracking-tighter uppercase mb-6 leading-none px-4">
                    Sabiduría<br /><span className="text-transparent font-light bg-clip-text bg-gradient-to-r from-[var(--mallku-emerald)] to-[var(--mallku-gold)] lowercase">Ancestral</span>
                </h1>
                <p className="text-[var(--mallku-text-muted)] text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed px-6">
                    Ciencia, bienestar y estrategia para Mallku Sentires Andinos.
                </p>
            </div>

            {/* CBD en Mascotas */}
            <div>
                <SectionHeader eyebrow="Estudios 2024–2025" title="CBD en Mascotas" subtitle="Evidencia científica real sobre cannabidiol veterinario, protocolos seguros y la línea artesanal de Mallku para tus animales." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secciones.cbd_mascotas.map((t, i) => <TopicCard key={i} {...t} />)}
                </div>
            </div>

            {/* CBD en Humanos */}
            <div>
                <SectionHeader eyebrow="Neurociencia & Clínica" title="CBD en Personas" subtitle="Los estudios más recientes de Harvard, Lancet y JAMA sobre cannabidiol para dolor, ansiedad, sueño y bienestar general." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secciones.cbd_humanos.map((t, i) => <TopicCard key={i} {...t} />)}
                </div>
            </div>

            {/* Salud Emocional */}
            <div>
                <SectionHeader eyebrow="Bienestar Integral" title="Salud Emocional" subtitle="Cómo el CBD, las aromáticas andinas y los rituales conscientes regulan el sistema nervioso y mejoran el estado emocional." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secciones.salud_emocional.map((t, i) => <TopicCard key={i} {...t} />)}
                </div>
            </div>

            {/* Productos Mallku */}
            <div>
                <SectionHeader eyebrow="Marca Propia" title="Productos Mallku" subtitle="Lo que hace único a cada producto: hidrolatos, tinturas, ungüentos y aromáticas con procesos artesanales certificados." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secciones.mallku_productos.map((t, i) => <TopicCard key={i} {...t} />)}
                </div>
            </div>

            {/* Estadísticas del Mercado */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-16 rounded-[2.5rem] bg-white border border-[var(--mallku-green)]/10 shadow-lg"
            >
                <SectionHeader eyebrow="Análisis Financiero" title="Mercado CBD 2025" subtitle="Colombia lidera en Latinoamérica con regulación pionera. El momento de posicionar Mallku es ahora." />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                    <StatBadge value="$7.1B" label="Mercado Global 2024" color="#10b981" />
                    <StatBadge value="21.3%" label="Crecimiento Anual" color="#6366f1" />
                    <StatBadge value="#1" label="Colombia en LATAM" color="#f59e0b" />
                    <StatBadge value="$47B" label="Proyección 2028" color="#e11d48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[var(--mallku-text-muted)]">
                    {["Nariño tiene ventaja competitiva por biodiversidad y altitud", "El mercado veterinario CBD crece al 30% anual (2x el humano)", "Las marcas artesanales premium capturan 40% del margen"].map((fact, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-[var(--mallku-bone)] rounded-2xl">
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[var(--mallku-green)]" />
                            <span className="font-medium">{fact}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Tips de Venta */}
            <div>
                <SectionHeader eyebrow="Estrategia Comercial" title="Tips para Vender" subtitle="Las 8 estrategias más efectivas para marcas de bienestar natural probadas en el mercado colombiano." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tipsVenta.map((tip, i) => (
                        <TipCard key={i} {...tip} delay={i * 0.05} />
                    ))}
                </div>
            </div>

            {/* Tips de Diseño */}
            <div>
                <SectionHeader eyebrow="Frontend & UX" title="Diseño para CBD" subtitle="Principios de diseño premium para páginas de wellness y CBD que crean confianza y convierten visitantes en compradores." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tipsDiseno.map((tip, i) => (
                        <TipCard key={i} {...tip} delay={i * 0.06} />
                    ))}
                </div>
            </div>

            {/* RRHH & LinkedIn */}
            <div>
                <SectionHeader eyebrow="Talento Humano" title="RRHH Inteligente" subtitle="Cómo encontrar, atraer y retener el mejor talento para una empresa de productos naturales como Mallku." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tipsRRHH.map((tip, i) => (
                        <TipCard key={i} {...tip} delay={i * 0.06} />
                    ))}
                </div>
            </div>

            {/* Bio-Afinidad Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-[var(--mallku-emerald)] to-[#0d7c5f] text-white relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-10 -translate-y-10" />
                <div className="relative z-10 text-center">
                    <Sparkles className="w-10 h-10 text-[var(--mallku-gold)] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-none">
                        El Arte de la <span className="text-[var(--mallku-gold)]">Disolución</span>
                    </h2>
                    <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
                        Nuestras formulaciones micro-botánicas permiten que los fitocompuestos atraviesen barreras lipídicas con armonía celestial — garantizando absorción verdadera.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {[["96%", "Afinidad Celular"], ["60 días", "Maceración"], ["0 quím.", "Sintéticos"], ["2800m", "Altitud"]] .map(([val, lab], i) => (
                            <div key={i} className="bg-white/10 rounded-2xl p-4 text-center">
                                <span className="block text-2xl font-black text-[var(--mallku-gold)] mb-1">{val}</span>
                                <span className="text-[9px] text-white/60 uppercase tracking-widest font-black">{lab}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default TemasDeInteres;
