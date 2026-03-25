import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Download, Car, ArrowUpRight, 
  ArrowDownLeft, ShieldAlert, Clock, Filter,
  BarChart3, TrendingUp, RefreshCcw
} from 'lucide-react';

const Reportes = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [horaPico, setHoraPico] = useState("Sin registros");
    const [stats, setStats] = useState({
        entradas: 0,
        salidas: 0,
        dentro: 0,
        denegados: 0,
        eficiencia: "0%"
    });

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        try {
            const resMov = await fetch(`https://yanelaplumz.com.mx/api_pluma/api.php?action=get_movimientos&fecha=${fechaSeleccionada}`);
            const dataMov = await resMov.json();

            if (dataMov.success) {
                const logs = dataMov.data || [];
                setMovimientos(logs);

                // 1. Cálculo de Métricas Básicas
                const entradas = logs.filter(m => m.tipo === 'Entrada').length;
                const salidas = logs.filter(m => m.tipo === 'Salida').length;
                const denegados = logs.filter(m => m.tipo === 'Denegado').length;
                const totalIntentos = entradas + denegados;
                
                // 2. Lógica Dinámica de Hora Pico
                if (logs.length > 0) {
                    const conteoHoras = {};
                    logs.forEach(mov => {
                        const hora = new Date(mov.fecha).getHours();
                        conteoHoras[hora] = (conteoHoras[hora] || 0) + 1;
                    });

                    const horaMasAlta = Object.keys(conteoHoras).reduce((a, b) => 
                        conteoHoras[a] > conteoHoras[b] ? a : b
                    );

                    const h = parseInt(horaMasAlta);
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const displayH = h % 12 || 12;
                    const nextH = (h + 1) % 12 || 12;
                    const nextAmpm = (h + 1) >= 12 && (h + 1) < 24 ? 'PM' : 'AM';
                    
                    setHoraPico(`${displayH}:00 ${ampm} - ${nextH}:00 ${nextAmpm}`);
                } else {
                    setHoraPico("Sin tráfico");
                }

                setStats({
                    entradas,
                    salidas,
                    dentro: Math.max(0, entradas - salidas),
                    denegados,
                    eficiencia: totalIntentos > 0 ? `${((entradas / totalIntentos) * 100).toFixed(1)}%` : "100%"
                });
            }
        } catch (error) {
            console.error("Error cargando reporte:", error);
        } finally {
            setLoading(false);
        }
    }, [fechaSeleccionada]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* CABECERA Y FILTRO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Análisis <span className="text-emerald-500 text-3xl">de Tráfico</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Auditoría de Acceso Vehicular</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 rounded-2xl border border-white/5">
                        <Calendar size={16} className="text-emerald-500" />
                        <input 
                            type="date" 
                            value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.target.value)}
                            className="bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest"
                        />
                    </div>
                    <button 
                        onClick={fetchReportData}
                        className={`p-3 rounded-2xl bg-white/5 text-emerald-500 hover:bg-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            {/* MÉTRICAS PRINCIPALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard label="Total Entradas" value={stats.entradas} icon={<ArrowUpRight size={20}/>} color="emerald" />
                <MetricCard label="Total Salidas" value={stats.salidas} icon={<ArrowDownLeft size={20}/>} color="blue" />
                <MetricCard label="En Plantel" value={stats.dentro} icon={<Car size={20}/>} color="purple" />
                <MetricCard label="Denegados" value={stats.denegados} icon={<ShieldAlert size={20}/>} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* HORAS PICO Y EFICIENCIA */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
                        <Clock size={150} className="absolute -right-10 -top-10 text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-500" />
                                Horas Pico Detectadas
                            </h3>
                            <p className="text-2xl font-black text-white italic uppercase leading-tight">{horaPico}</p>
                            <p className="text-[10px] font-bold text-emerald-500/60 uppercase mt-3 tracking-widest italic">Basado en registros reales</p>
                            
                            <div className="mt-8 space-y-6">
                                <ProgressBar label="Eficiencia Operativa" percentage={stats.eficiencia} color="bg-emerald-500" />
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Punto de Control Activo</p>
                                    <p className="text-xs font-bold text-white uppercase italic">Terminal Alpha - Principal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <BarChart3 size={20} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tasa de Éxito</p>
                                <p className="text-xl font-black text-white tracking-tighter italic uppercase">{stats.eficiencia}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOG DE AUDITORÍA REAL */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] overflow-hidden min-h-[400px]">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Log de Movimientos - {fechaSeleccionada}</h4>
                            <Filter size={14} className="text-slate-600" />
                        </div>
                        <div className="p-4 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                        <th className="px-6 pb-2">Placa</th>
                                        <th className="px-6 pb-2">Hora</th>
                                        <th className="px-6 pb-2">Tipo</th>
                                        <th className="px-6 pb-2">Punto</th>
                                        <th className="px-6 pb-2 text-right">Estatus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.length > 0 ? (
                                        movimientos.map((m, i) => (
                                            <ReportRow 
                                                key={m.id || i}
                                                p={m.placa} 
                                                h={new Date(m.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                                t={m.tipo} 
                                                punto={m.punto || 'Acceso Gral'}
                                                s="Validado"
                                                color={m.tipo === 'Entrada' ? "text-emerald-400" : m.tipo === 'Salida' ? "text-blue-400" : "text-red-400"}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-20 text-slate-600 font-black uppercase text-[10px] tracking-widest italic">
                                                Sin movimientos registrados para esta fecha
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTES AUXILIARES ---

const MetricCard = ({ label, value, icon, color }) => {
    const colors = {
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
        red: "text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/5"
    };

    return (
        <div className={`p-6 rounded-[2.5rem] border ${colors[color]} backdrop-blur-sm group hover:scale-[1.02] transition-transform`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
            <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">{label}</p>
            <p className="text-3xl font-black text-white leading-none mt-1 italic uppercase">
                {String(value || 0).padStart(2, '0')}
            </p>
        </div>
    );
};

const ProgressBar = ({ label, percentage, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-slate-500">{label}</span>
            <span className="text-white">{percentage}</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: percentage }}></div>
        </div>
    </div>
);

const ReportRow = ({ p, h, t, punto, s, color }) => (
    <tr className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
        <td className="px-6 py-4 rounded-l-2xl text-[12px] font-mono font-black text-white uppercase">{p}</td>
        <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{h}</td>
        <td className={`px-6 py-4 text-[10px] font-black uppercase italic ${color}`}>{t}</td>
        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{punto}</td>
        <td className="px-6 py-4 rounded-r-2xl text-right">
            <span className="text-[8px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md uppercase border border-emerald-500/20">
                {s}
            </span>
        </td>
    </tr>
);

export default Reportes;