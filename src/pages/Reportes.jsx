import React, { useState } from 'react';
import { 
  Calendar, Download, Car, ArrowUpRight, 
  ArrowDownLeft, ShieldAlert, Clock, Filter,
  BarChart3, TrendingUp
} from 'lucide-react';

const Reportes = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    // Datos simulados basados en tu petición
    const [data] = useState({
        entradas: 142,
        salidas: 128,
        dentro: 14,
        denegados: 5,
        horaPico: "07:15 AM - 08:30 AM",
        eficiencia: "98.2%"
    });

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
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                        <Download size={18} />
                        <span className="font-black text-[10px] uppercase tracking-widest">Exportar PDF</span>
                    </button>
                </div>
            </div>

            {/* MÉTRICAS PRINCIPALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard label="Total Entradas" value={data.entradas} icon={<ArrowUpRight size={20}/>} color="emerald" />
                <MetricCard label="Total Salidas" value={data.salidas} icon={<ArrowDownLeft size={20}/>} color="blue" />
                <MetricCard label="Vehículos en Plantel" value={data.dentro} icon={<Car size={20}/>} color="purple" />
                <MetricCard label="Accesos Denegados" value={data.denegados} icon={<ShieldAlert size={20}/>} color="red" />
            </div>

            {/* SECCIÓN DETALLADA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* HORAS PICO Y ESTADÍSTICAS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
                        <Clock size={150} className="absolute -right-10 -top-10 text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-500" />
                                Horas Pico de Entrada
                            </h3>
                            <p className="text-3xl font-black text-white italic uppercase leading-none">{data.horaPico}</p>
                            <p className="text-[10px] font-bold text-emerald-500/60 uppercase mt-3 tracking-widest">Carga máxima detectada</p>
                            
                            <div className="mt-8 space-y-4">
                                <ProgressBar label="Alumnos" percentage="75%" color="bg-emerald-500" />
                                <ProgressBar label="Docentes" percentage="20%" color="bg-blue-500" />
                                <ProgressBar label="Externos" percentage="5%" color="bg-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <BarChart3 size={20} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Eficiencia de Registro</p>
                                <p className="text-xl font-black text-white tracking-tighter italic uppercase">{data.eficiencia}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LISTADO DE MOVIMIENTOS RECIENTES (Auditoría) */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Log de Movimientos Autorizados</h4>
                            <Filter size={14} className="text-slate-600" />
                        </div>
                        <div className="p-4 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                        <th className="px-6 pb-2">Vehículo</th>
                                        <th className="px-6 pb-2">Placa</th>
                                        <th className="px-6 pb-2">Hora</th>
                                        <th className="px-6 pb-2">Tipo</th>
                                        <th className="px-6 pb-2 text-right">Estatus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ReportRow v="Mazda 3" p="ABC-12-34" h="07:45 AM" t="Entrada" s="Correcto" />
                                    <ReportRow v="Toyota Tacoma" p="VNK-92-26" h="08:12 AM" t="Entrada" s="Correcto" />
                                    <ReportRow v="Honda Civic" p="XYZ-55-11" h="08:20 AM" t="Denegado" s="Error" color="text-red-400" />
                                    <ReportRow v="Nissan Versa" p="LMN-88-22" h="08:45 AM" t="Salida" s="Correcto" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENTES ---

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
            <p className="text-3xl font-black text-white leading-none mt-1 italic uppercase">{value}</p>
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
            <div className={`h-full ${color} rounded-full`} style={{ width: percentage }}></div>
        </div>
    </div>
);

const ReportRow = ({ v, p, h, t, s, color="text-emerald-400" }) => (
    <tr className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
        <td className="px-6 py-4 rounded-l-2xl text-[11px] font-black text-white uppercase">{v}</td>
        <td className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400">{p}</td>
        <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{h}</td>
        <td className={`px-6 py-4 text-[10px] font-black uppercase italic ${color}`}>{t}</td>
        <td className="px-6 py-4 rounded-r-2xl text-right">
            <span className="text-[8px] font-black px-2 py-1 bg-white/5 rounded-md text-slate-500 uppercase">{s}</span>
        </td>
    </tr>
);

export default Reportes;