import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import CELLS from 'vanta/dist/vanta.cells.min.js';
import Resultados from './Resultados';
import logo from '../assets/HARDI LATAM logo Blanco.png';

const Encuesta = () => {
    const vantaRef = useRef(null);
    const vantaInstanceRef = useRef(null);

    // Estados del formulario
    const [nombre, setNombre] = useState(() => localStorage.getItem('encuesta_nombre') || '');
    const [email, setEmail] = useState(() => localStorage.getItem('encuesta_email') || '');
    const [telefono, setTelefono] = useState(() => localStorage.getItem('encuesta_telefono') || '');
    const [respuestas, setRespuestas] = useState(() => {
        const saved = localStorage.getItem('encuesta_respuestas');
        return saved ? JSON.parse(saved) : {};
    });
    const [enviado, setEnviado] = useState(false);
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Diagnóstico Integral del Negocio del Distribuidor HVACR
    const categorias = [
        {
            nombre: "Clientes y Mercado",
            preguntas: [
                "Se realizan estudios de mercado basados en datos",
                "Se entiende claramente qué valoran y prefieren los clientes",
                "Existe segmentación clara de clientes (A, B, C / rentables vs no rentables)",
                "Se conoce la rentabilidad por cliente",
                "Se mide el costo de servir por tipo de cliente",
                "Existe gestión de clientes clave (Key Accounts)",
                "Se controla la dependencia de pocos clientes grandes",
                "Se mide la experiencia del cliente (tiempos, fill rate, servicio)",
                "Existe generación activa de demanda (pull)",
                "Se gestionan reclamos y devoluciones de forma estructurada"
            ]
        },
        {
            nombre: "Estrategia y Gobierno del Negocio",
            preguntas: [
                "Existe una estrategia clara y documentada",
                "Hay un plan formal de sucesión (legal y operativo)",
                "Existe una propuesta de valor claramente diferenciada",
                "El modelo de negocio está claramente definido",
                "Existe un plan de crecimiento (orgánico, nuevas líneas, adquisiciones)",
                "Hay estructura de gobierno corporativo y toma de decisiones clara",
                "Las decisiones estratégicas se basan en datos",
                "Se gestionan riesgos clave (crédito, inventario, tipo de cambio)",
                "Existe alineación estratégica con los fabricantes clave"
            ]
        },
        {
            nombre: "Marketing y Generación de Demanda",
            preguntas: [
                "Existe departamento o responsable de marketing",
                "Hay una estrategia de marketing clara y medible",
                "Se ejecutan acciones de diferenciación de marca",
                "La página web se usa para información, generación de leads y/o venta",
                "Existe e-commerce B2B funcional",
                "Se gestionan redes sociales con objetivos claros",
                "Se ejecutan programas de co-marketing con fabricantes",
                "Se usa contenido técnico como herramienta comercial",
                "Existe un programa de fidelización (Dealer Program)",
                "Se mide el ROI de las acciones de marketing",
                "Se gestionan y califican los leads generados"
            ]
        },
        {
            nombre: "Ventas y Ejecución Comercial",
            preguntas: [
                "El modelo de ventas está claramente definido",
                "La venta no es solo reactiva (mostrador / llamadas entrantes)",
                "Existe venta proactiva telefónica estructurada",
                "Existen vendedores de calle con carteras definidas",
                "Hay planes de cuentas para clientes grandes",
                "Se utilizan CRM y herramientas de seguimiento",
                "Existe disciplina en cotizaciones y seguimiento",
                "Se vende por soluciones y no solo por producto",
                "Existe una estrategia clara de precios y descuentos",
                "Se mide la productividad por vendedor"
            ]
        },
        {
            nombre: "Portafolio de Producto y Soporte Técnico",
            preguntas: [
                "Existe una estrategia clara de portafolio",
                "Se conocen los productos estratégicos por margen y rotación",
                "Se gestiona activamente el mix de productos",
                "Se ofrece capacitación técnica a clientes",
                "El equipo domina el uso y aplicación de los productos",
                "Existe soporte postventa estructurado",
                "Se gestionan garantías de forma eficiente",
                "Se introducen nuevos productos de forma planificada",
                "Se cumple con regulaciones locales (A2L, eficiencia, normativas)"
            ]
        },
        {
            nombre: "Inventario y Supply Chain",
            preguntas: [
                "Existe sistema de pronóstico de demanda",
                "Hay políticas claras para productos de baja rotación",
                "Se mide rotación, fill rate y nivel de servicio",
                "Se controla inventario obsoleto",
                "Se utiliza GMROI para decisiones de compra",
                "Existe integración fabricante–distribuidor en forecast",
                "Los lead times reales están controlados",
                "La logística y entrega al cliente es confiable",
                "Existe WMS o control estructurado de almacén"
            ]
        },
        {
            nombre: "Tecnología y Digitalización",
            preguntas: [
                "Existe ERP integrado y actualizado",
                "El ERP permite reportes y BI para toma de decisiones",
                "ERP, CRM y WMS están integrados",
                "Existe analítica para clientes, ventas e inventario",
                "Se han automatizado procesos repetitivos",
                "Existe madurez digital en la organización",
                "Se está preparando el uso de IA y analítica predictiva"
            ]
        },
        {
            nombre: "Finanzas y Control de Gestión",
            preguntas: [
                "La gerencia conoce claramente el P&L",
                "Se dominan los KPIs financieros clave del distribuidor",
                "Se mide rentabilidad por producto, cliente y vendedor",
                "Se realizan evaluaciones financieras para expansión",
                "Existe control del flujo de caja",
                "Existe política clara de crédito y cobranza",
                "Se controla el DSO",
                "Se gestiona el impacto del tipo de cambio",
                "Se usan finanzas para la toma de decisiones"
            ]
        },
        {
            nombre: "Benchmarking y Mejores Prácticas",
            preguntas: [
                "Se comparan KPIs contra la industria",
                "Se utilizan benchmarks de distribuidores similares",
                "Se identifican brechas claras de desempeño",
                "Se participa activamente en asociaciones de la industria",
                "Se implementan mejores prácticas aprendidas"
            ]
        },
        {
            nombre: "Talento, Cultura y Organización",
            preguntas: [
                "Existe estudio salarial por país o región",
                "Existe estructura clara de roles y responsabilidades",
                "Hay planes de capacitación continua",
                "Se mide productividad por empleado",
                "Existen esquemas de incentivos basados en datos",
                "Las comisiones se pagan por margen y/o GMROI",
                "Existe plan de retención de talento clave",
                "Existe cultura de datos en la organización",
                "Existe plan de sucesión operativa"
            ]
        },
        {
            nombre: "Relación Fabricante–Distribuidor",
            preguntas: [
                "Expectativas y objetivos están claramente definidos",
                "Existen reglas claras de precios y políticas",
                "Hay transparencia en la relación",
                "Existe protección real de canal",
                "El fabricante aporta valor más allá del producto",
                "Existe alineación en estrategia digital",
                "Se realizan evaluaciones periódicas de la relación",
                "Existen planes conjuntos de crecimiento"
            ]
        }
    ];

    // Opciones de respuesta
    const opcionesRespuesta = [
        { valor: 'NE', label: 'NE - No existe', color: 'red' },
        { valor: 'B', label: 'B - Básico', color: 'orange' },
        { valor: 'ED', label: 'ED - En desarrollo', color: 'yellow' },
        { valor: 'A', label: 'A - Avanzado', color: 'blue' },
        { valor: 'BC', label: 'BC - Best in class', color: 'green' }
    ];

    // Cálculo de progreso
    const totalPreguntas = categorias.reduce((acc, cat) => acc + cat.preguntas.length, 0);
    const preguntasRespondidas = Object.keys(respuestas).length;
    const porcentajeProgreso = Math.round((preguntasRespondidas / totalPreguntas) * 100);

    // Persistencia en localStorage
    useEffect(() => {
        localStorage.setItem('encuesta_nombre', nombre);
        localStorage.setItem('encuesta_email', email);
        localStorage.setItem('encuesta_telefono', telefono);
        localStorage.setItem('encuesta_respuestas', JSON.stringify(respuestas));
    }, [nombre, email, telefono, respuestas]);

    useEffect(() => {
        if (vantaRef.current && !vantaInstanceRef.current) {
            try {
                vantaInstanceRef.current = CELLS({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    color1: 0x0a0a1a, // Más oscuro
                    color2: 0x1e3a8a, // Azul navy más formal
                    size: 4.00,      // Un poco más pequeñas
                    speed: 0.50       // Más lento para mayor elegancia
                });
            } catch (error) {
                console.error("Error al iniciar Vanta:", error);
            }
        }
        return () => {
            if (vantaInstanceRef.current) {
                vantaInstanceRef.current.destroy();
                vantaInstanceRef.current = null;
            }
        };
    }, []);


    const calcularResultados = () => {
        // Conversión de respuestas a puntos
        const valorPuntos = {
            'NE': 0,
            'B': 25,
            'ED': 50,
            'A': 75,
            'BC': 100
        };

        // Calcular puntuación por categoría
        const categoriasConPuntuacion = categorias.map((categoria, catIndex) => {
            const preguntasCategoria = categoria.preguntas.length;
            let sumaPuntos = 0;

            categoria.preguntas.forEach((_, pregIndex) => {
                const preguntaId = `cat${catIndex}_preg${pregIndex}`;
                const respuesta = respuestas[preguntaId];
                sumaPuntos += valorPuntos[respuesta] || 0;
            });

            const puntuacion = Math.round(sumaPuntos / preguntasCategoria);
            const nivel = obtenerNivel(puntuacion);

            return {
                nombre: categoria.nombre,
                puntuacion,
                nivel
            };
        });

        // Calcular puntuación total
        const puntuacionTotal = Math.round(
            categoriasConPuntuacion.reduce((acc, cat) => acc + cat.puntuacion, 0) / categoriasConPuntuacion.length
        );

        const nivelMadurez = obtenerNivel(puntuacionTotal);

        // Identificar fortalezas (top 3)
        const fortalezas = [...categoriasConPuntuacion]
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 3);

        // Identificar oportunidades (bottom 3)
        const oportunidades = [...categoriasConPuntuacion]
            .sort((a, b) => a.puntuacion - b.puntuacion)
            .slice(0, 3);

        // Generar diagnóstico automático
        const diagnostico = generarDiagnostico(puntuacionTotal, nivelMadurez, oportunidades);

        return {
            puntuacionTotal,
            nivelMadurez,
            categorias: categoriasConPuntuacion,
            fortalezas,
            oportunidades,
            diagnostico
        };
    };

    const obtenerNivel = (puntuacion) => {
        if (puntuacion >= 81) return 'Best in Class';
        if (puntuacion >= 61) return 'Avanzado';
        if (puntuacion >= 41) return 'En Desarrollo';
        if (puntuacion >= 21) return 'Básico';
        return 'Inicial';
    };

    const generarDiagnostico = (puntuacion, nivel, oportunidades) => {
        let diagnostico = '';

        // Diagnóstico general basado en nivel
        if (nivel === 'Best in Class') {
            diagnostico = `¡Felicidades! Tu empresa se encuentra en un nivel de madurez excepcional (${puntuacion}/100). Has implementado las mejores prácticas de la industria HVACR y estás posicionado como líder en el mercado.\n\n`;
            diagnostico += `Recomendaciones:\n• Mantener y documentar las mejores prácticas actuales\n• Convertirse en referente de la industria compartiendo conocimiento\n• Explorar innovaciones disruptivas y nuevas tecnologías\n• Considerar expansión a nuevos mercados o segmentos`;
        } else if (nivel === 'Avanzado') {
            diagnostico = `Excelente trabajo. Tu empresa ha alcanzado un nivel avanzado de madurez (${puntuacion}/100). Tienes procesos sólidos y estás bien posicionado en el mercado.\n\n`;
            diagnostico += `Recomendaciones:\n• Optimizar los procesos existentes para alcanzar nivel Best in Class\n• Implementar analítica avanzada y automatización\n• Fortalecer las áreas de oportunidad identificadas\n• Desarrollar ventajas competitivas sostenibles`;
        } else if (nivel === 'En Desarrollo') {
            diagnostico = `Tu empresa está en un buen camino (${puntuacion}/100). Has establecido bases sólidas y estás desarrollando capacidades importantes.\n\n`;
            diagnostico += `Recomendaciones:\n• Priorizar la implementación de sistemas y procesos estructurados\n• Invertir en tecnología y capacitación del equipo\n• Establecer métricas claras de desempeño\n• Fortalecer la relación con fabricantes clave`;
        } else if (nivel === 'Básico') {
            diagnostico = `Tu empresa tiene oportunidades significativas de mejora (${puntuacion}/100). Es momento de estructurar procesos y establecer bases sólidas.\n\n`;
            diagnostico += `Recomendaciones:\n• Implementar sistemas básicos de gestión (ERP, CRM)\n• Definir estrategia clara de negocio\n• Establecer procesos comerciales estructurados\n• Invertir en capacitación y desarrollo del equipo`;
        } else {
            diagnostico = `Tu empresa está en una etapa inicial (${puntuacion}/100). Hay un gran potencial de crecimiento implementando mejores prácticas.\n\n`;
            diagnostico += `Recomendaciones:\n• Comenzar con lo básico: definir estrategia y modelo de negocio\n• Implementar controles financieros y de inventario\n• Estructurar el equipo comercial\n• Buscar asesoría especializada en distribución HVACR`;
        }

        // Agregar áreas específicas de oportunidad
        if (oportunidades.length > 0) {
            diagnostico += `\n\nÁreas prioritarias a trabajar:\n`;
            oportunidades.forEach((cat, idx) => {
                diagnostico += `${idx + 1}. ${cat.nombre} (${cat.puntuacion}/100) - ${cat.nivel}\n`;
            });
        }

        return diagnostico;
    };

    const handleRespuesta = (preguntaId, valor) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: valor
        }));

        // Autoscroll a la siguiente pregunta
        setTimeout(() => {
            // Extraer cat y preg del ID actual (e.g., cat0_preg0)
            const match = preguntaId.match(/cat(\d+)_preg(\d+)/);
            if (!match) return;

            const catIndex = parseInt(match[1]);
            const pregIndex = parseInt(match[2]);

            // Intentar buscar la siguiente pregunta en la misma categoría
            let nextPregId = `cat${catIndex}_preg${pregIndex + 1}`;
            let nextElement = document.getElementById(nextPregId);

            // Si no hay más en esta categoría, buscar la primera de la siguiente categoría
            if (!nextElement && catIndex < categorias.length - 1) {
                nextPregId = `cat${catIndex + 1}_preg0`;
                nextElement = document.getElementById(nextPregId);
            }

            if (nextElement) {
                const headerOffset = 100; // Espacio para que no quede pegado arriba
                const elementPosition = nextElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 300); // Pequeño delay para que el usuario vea su selección
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validar que todas las preguntas estén respondidas
        const totalPreguntas = categorias.reduce((acc, cat) => acc + cat.preguntas.length, 0);
        const respuestasCount = Object.keys(respuestas).length;

        if (respuestasCount < totalPreguntas) {
            setError(`Por favor responde todas las preguntas (${respuestasCount}/${totalPreguntas} respondidas)`);
            setLoading(false);
            return;
        }

        // Simular un pequeño procesamiento para feedback visual
        setTimeout(async () => {
            // Calcular resultados localmente
            const resultadosCalculados = calcularResultados();

            // Enviar por correo vía FormSubmit (AJAX)
            try {
                const emailContent = {
                    Subject: `Nuevo Diagnóstico: ${nombre}`,
                    Empresa: nombre,
                    Email: email,
                    Telefono: telefono,
                    "Puntuación Total": `${resultadosCalculados.puntuacionTotal}/100`,
                    "Nivel de Madurez": resultadosCalculados.nivelMadurez,
                    Diagnóstico: resultadosCalculados.diagnostico,
                    "Fortalezas": resultadosCalculados.fortalezas.map(f => `${f.nombre} (${f.puntuacion})`).join(', '),
                    "Oportunidades": resultadosCalculados.oportunidades.map(o => `${o.nombre} (${o.puntuacion})`).join(', '),
                    "Detalle por Categoría": resultadosCalculados.categorias.map(c => `${c.nombre}: ${c.puntuacion}`).join('\n')
                };

                await fetch("https://formsubmit.co/ajax/cesar@updm.mx", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(emailContent)
                });
            } catch (err) {
                console.error("Error enviando email:", err);
                // No detenemos el flujo si falla el correo, seguimos mostrando los resultados
            }

            setResultados(resultadosCalculados);
            setEnviado(true);

            // Limpiar localStorage al finalizar con éxito
            localStorage.removeItem('encuesta_nombre');
            localStorage.removeItem('encuesta_email');
            localStorage.removeItem('encuesta_telefono');
            localStorage.removeItem('encuesta_respuestas');

            setLoading(false);
        }, 800);
    };

    if (enviado && resultados) {
        return (
            <Resultados
                resultados={resultados}
                onNuevaEncuesta={() => window.location.reload()}
            />
        );
    }

    return (
        <>
            {/* Fondo fijo animado */}
            <div ref={vantaRef} className="fixed inset-0 w-full h-full -z-10"></div>

            {/* Indicador de Progreso Sutil (Flotante) */}
            <div className="fixed bottom-6 right-6 z-50 bg-black/60 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 group hidden md:block">
                <div className="flex flex-col gap-2 min-w-[120px]">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Progreso</span>
                        <span className="text-xs font-bold text-white">{porcentajeProgreso}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
                            style={{ width: `${porcentajeProgreso}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Contenido con scroll */}
            <div className="min-h-screen px-4 py-12 relative pt-8">
                <div className="z-10 w-full max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16 pt-8">
                        <div className="flex justify-center mb-8">
                            <img
                                src={logo}
                                alt="HARDI LATAM Logo"
                                className="w-full h-auto max-w-[400px] drop-shadow-2xl brightness-110"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg leading-tight">
                            Diagnóstico Integral del Negocio
                        </h1>
                        <div className="inline-block px-4 py-1.5 bg-blue-600/20 border border-blue-400/30 rounded-full mb-6">
                            <p className="text-blue-300 text-sm font-bold tracking-[0.2em] uppercase">
                                Distribuidor HVACR
                            </p>
                        </div>
                        <p className="max-w-2xl mx-auto text-blue-100/80 text-lg font-light leading-relaxed drop-shadow">
                            Identificando brechas estratégicas para acelerar la <span className="text-blue-300 font-semibold">eficiencia, rentabilidad</span> y <span className="text-blue-300 font-semibold">ejecución comercial</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Datos personales */}
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white">Información del Consultante</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:bg-white/10"
                                    placeholder="Juan Pérez García"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:bg-white/10"
                                    placeholder="contacto@empresa.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-1">Teléfono (Opcional)</label>
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:bg-white/10"
                                    placeholder="+52 555-1234"
                                />
                            </div>
                        </div>

                        {/* Leyenda de opciones */}
                        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                            <h4 className="text-base font-semibold text-blue-200 mb-4">Escala de Evaluación:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                                {opcionesRespuesta.map(opcion => (
                                    <div key={opcion.valor} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full bg-${opcion.color}-500 shadow-lg`}></div>
                                        <span className="text-gray-200 font-medium">{opcion.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categorías y Preguntas */}
                        <div className="space-y-8">
                            {categorias.map((categoria, catIndex) => (
                                <div key={catIndex} className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-600/40 to-blue-500/30 backdrop-blur-md border border-blue-400/40 rounded-2xl p-5 shadow-2xl">
                                        <h3 className="text-xl md:text-2xl font-bold text-white">
                                            {catIndex + 1}. {categoria.nombre}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {categoria.preguntas.map((pregunta, pregIndex) => {
                                            const preguntaId = `cat${catIndex}_preg${pregIndex}`;
                                            return (
                                                <div key={preguntaId} id={preguntaId} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-black/30 hover:border-white/20 transition shadow-lg scroll-mt-24">
                                                    <label className="block text-sm md:text-base text-white mb-4 font-medium">
                                                        {pregunta}
                                                    </label>

                                                    <div className="flex flex-wrap gap-2">
                                                        {opcionesRespuesta.map(opcion => {
                                                            const isSelected = respuestas[preguntaId] === opcion.valor;
                                                            const colorClasses = {
                                                                red: isSelected ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 ring-2 ring-red-400' : 'bg-red-500/20 text-red-200 hover:bg-red-500/40 border border-red-500/30',
                                                                orange: isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400' : 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/40 border border-orange-500/30',
                                                                yellow: isSelected ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50 ring-2 ring-yellow-400' : 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/40 border border-yellow-500/30',
                                                                blue: isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400' : 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/40 border border-blue-500/30',
                                                                green: isSelected ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 ring-2 ring-green-400' : 'bg-green-500/20 text-green-200 hover:bg-green-500/40 border border-green-500/30'
                                                            };

                                                            return (
                                                                <button
                                                                    key={opcion.valor}
                                                                    type="button"
                                                                    onClick={() => handleRespuesta(preguntaId, opcion.valor)}
                                                                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${colorClasses[opcion.color]} ${isSelected ? 'scale-110' : 'scale-100'}`}
                                                                >
                                                                    {opcion.valor}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/30 backdrop-blur-md border border-red-500/50 text-red-100 px-5 py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl">
                                <span>🚫</span> {error}
                            </div>
                        )}

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-5 rounded-xl transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? 'Enviando...' : 'Enviar Encuesta'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Encuesta;

