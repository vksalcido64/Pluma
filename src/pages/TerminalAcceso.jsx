import React, { useState } from 'react';
import RegistroAcceso from '../components/RegistroAcceso';
import Dashboard from '../components/Dashboard';
import { 
  ShieldCheck, Activity, Radio, 
  ArrowUpRight, ArrowDownLeft, Zap 
} from 'lucide-react';

const TerminalAcceso = () => {
    const [stats] = useState({
        entradasHoy: 45,
        denegados: 3,
        activos: 12
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* HEADER CON STATS INTEGRADAS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                        <Zap size={14} className="fill-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema en Línea</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Terminal <span className="text-emerald-500">Alpha</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nodos de acceso: Entrada Principal / Estacionamiento</p>
                </div>

                <div className="flex flex-wrap gap-8 items-center bg-black/20 p-6 rounded-[2rem] border border-white/5">
                    <SimpleStat label="Flujo Hoy" value={stats.entradasHoy} icon={<ArrowUpRight size={14}/>} color="text-blue-400" />
                    <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                    <SimpleStat label="Bloqueados" value={stats.denegados} icon={<ShieldCheck size={14}/>} color="text-red-400" />
                    <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                    <SimpleStat label="En Plantel" value={stats.activos} icon={<Activity size={14}/>} color="text-emerald-400" />
                </div>
            </div>

            {/* CUERPO PRINCIPAL: GRID DINÁMICO */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LADO IZQUIERDO: ACCIÓN (Panel de Control) */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900/60 border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        {/* Efecto de luz ambiental */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                Consola de Registro
                            </h3>
                            <RegistroAcceso />
                        </div>
                    </div>

                    {/* Widget de Info Rápida */}
                    <div className="bg-emerald-500/5 border border-dashed border-emerald-500/20 p-6 rounded-[2rem]">
                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Radio size={12}/> Nota del Servidor
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Los accesos denegados por el <span className="text-emerald-400">Trigger SQL</span> se notifican automáticamente al administrador del sistema.
                        </p>
                    </div>
                </div>

                {/* LADO DERECHO: MONITOREO (Dashboard) */}
                <div className="xl:col-span-8">
                    <div className="h-full bg-slate-900/20 border border-white/5 rounded-[3rem] p-2 shadow-inner group">
                        <div className="p-4 flex items-center justify-between">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6">Monitor de Tráfico Reciente</span>
                             <div className="flex gap-1 mr-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                             </div>
                        </div>
                        <Dashboard />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Componente pequeño para stats limpias
const SimpleStat = ({ label, value, icon, color }) => (
    <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
        <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-white leading-none">{value}</p>
        </div>
    </div>
);

export default TerminalAcceso;