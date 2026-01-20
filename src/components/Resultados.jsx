import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CELLS from 'vanta/dist/vanta.cells.min.js';
import logo from '../assets/HARDI LATAM logo Blanco.png';

const Resultados = ({ resultados, onNuevaEncuesta }) => {
    const vantaRef = useRef(null);
    const vantaInstanceRef = useRef(null);

    // Scroll al inicio cuando se muestran los resultados
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Inicializar Vanta.js
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
                    color1: 0x0a0a1a, // Formal oscuro
                    color2: 0x1e3a8a, // Formal navy
                    size: 4.00,
                    speed: 0.50
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

    const getColorByScore = (score) => {
        if (score >= 81) return 'green';
        if (score >= 61) return 'blue';
        if (score >= 41) return 'yellow';
        if (score >= 21) return 'orange';
        return 'red';
    };

    const getColorClasses = (color) => {
        const colors = {
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500'
        };
        return colors[color] || colors.blue;
    };

    const getNivelIcon = (nivel) => {
        const icons = {
            'Best in Class': '🏆',
            'Avanzado': '🚀',
            'En Desarrollo': '📈',
            'Básico': '🔧',
            'Inicial': '🌱'
        };
        return icons[nivel] || '📊';
    };

    return (
        <>
            {/* Fondo fijo animado */}
            <div ref={vantaRef} className="fixed inset-0 w-full h-full -z-10"></div>

            {/* Contenido con scroll */}
            <div className="min-h-screen px-4 py-12 relative">
                <div className="z-10 w-full max-w-6xl mx-auto space-y-12">

                    {/* Logo and Header */}
                    <div className="text-center mb-12 pt-4">
                        <div className="flex justify-center mb-8">
                            <img
                                src={logo}
                                alt="HARDI LATAM Logo"
                                className="w-full h-auto max-w-[300px] drop-shadow-2xl brightness-110"
                            />
                        </div>
                        <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">●</span>
                                <span className="text-green-100 text-sm font-bold uppercase tracking-widest">Diagnóstico Completado</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Informe de Madurez del Negocio</h1>
                        <p className="max-w-2xl mx-auto text-blue-200/80 text-lg font-light leading-relaxed">
                            Si quieres mejorar tu score contacta a este correo: <a href="mailto:gmessina@hardinet.org" className="text-blue-400 hover:text-blue-300 transition-colors font-bold underline decoration-blue-400/30 underline-offset-4">gmessina@hardinet.org</a>
                        </p>
                    </div>

                    {/* Puntuación Total */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="text-8xl p-6 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                                    {getNivelIcon(resultados.nivelMadurez)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-blue-300 uppercase tracking-[0.2em] mb-1">Nivel Alcanzado</h2>
                                    <p className="text-4xl md:text-5xl font-black text-white">{resultados.nivelMadurez}</p>
                                </div>
                            </div>

                            <div className="bg-blue-600/10 border border-blue-400/20 p-8 rounded-3xl min-w-[240px]">
                                <div className="text-8xl font-black text-white mb-2 leading-none flex items-baseline justify-center">
                                    {resultados.puntuacionTotal}
                                    <span className="text-2xl text-blue-400 font-bold ml-1">/100</span>
                                </div>
                                <p className="text-blue-200 font-bold uppercase tracking-widest text-sm">Puntuación General</p>
                            </div>
                        </div>
                    </div>

                    {/* Fortalezas y Oportunidades */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Fortalezas */}
                        <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-[2rem] p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="bg-green-500/20 p-2 rounded-lg">💪</span> Fortalezas Clave
                            </h3>
                            <div className="space-y-4">
                                {resultados.fortalezas.map((cat, idx) => (
                                    <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-black/30 transition shadow-lg">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-white font-bold text-lg">{cat.nombre}</span>
                                            <span className="text-green-400 font-black text-2xl">{cat.puntuacion}</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                                style={{ width: `${cat.puntuacion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Áreas de Oportunidad */}
                        <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-[2rem] p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="bg-orange-500/20 p-2 rounded-lg">🎯</span> Oportunidades de Mejora
                            </h3>
                            <div className="space-y-4">
                                {resultados.oportunidades.map((cat, idx) => (
                                    <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-black/30 transition shadow-lg">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-white font-bold text-lg">{cat.nombre}</span>
                                            <span className="text-orange-400 font-black text-2xl">{cat.puntuacion}</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <div
                                                className={`${getColorClasses(getColorByScore(cat.puntuacion))} h-2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.3)]`}
                                                style={{ width: `${cat.puntuacion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Diagnóstico Automático */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
                        <h3 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-4">
                            <span className="bg-blue-600/20 p-3 rounded-2xl text-blue-400">🔍</span>Diagnóstico Estratégico
                        </h3>
                        <div className="bg-black/20 rounded-3xl p-8 border border-white/5">
                            <p className="text-blue-100 text-xl leading-relaxed whitespace-pre-line font-light">
                                {resultados.diagnostico}
                            </p>
                        </div>
                    </div>

                    {/* Detalle por Categoría */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
                            <span className="bg-purple-600/20 p-2 rounded-xl text-purple-400">📊</span> Análisis por Pilar del Negocio
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {resultados.categorias.map((cat, idx) => {
                                const color = getColorByScore(cat.puntuacion);
                                return (
                                    <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-white font-bold text-lg mb-1">{cat.nombre}</h4>
                                                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-${color}-500/20 text-${color}-400 border border-${color}-400/30`}>
                                                    {cat.nivel}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className={`text-3xl font-black ${color === 'green' ? 'text-green-400' : color === 'blue' ? 'text-blue-400' : color === 'yellow' ? 'text-yellow-400' : color === 'orange' ? 'text-orange-400' : 'text-red-400'}`}>
                                                    {cat.puntuacion}
                                                </span>
                                                <span className="text-blue-400 text-sm ml-1 font-bold">/100</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <div
                                                className={`${getColorClasses(color)} h-2 rounded-full transition-all duration-1000 shadow-md`}
                                                style={{ width: `${cat.puntuacion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="grid md:grid-cols-2 gap-6 pb-12">
                        <button
                            onClick={onNuevaEncuesta}
                            className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-black py-6 rounded-2xl transition-all duration-300 shadow-2xl transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest"
                        >
                            📝 Reiniciar Diagnóstico
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-white/5 border border-white/20 hover:bg-white/10 text-white font-black py-6 rounded-2xl transition-all duration-300 shadow-2xl transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <span>🖨️</span> Generar Reporte
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Resultados;
