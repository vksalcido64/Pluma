import React, { useState, useEffect, useCallback } from 'react';
import RegistroAcceso from '../components/RegistroAcceso';
import Dashboard from '../components/Dashboard';
import { 
  ShieldCheck, Activity, Radio, 
  ArrowUpRight, Zap 
} from 'lucide-react';

const TerminalAcceso = () => {
    const [stats, setStats] = useState({
        entradasHoy: 0,
        denegados: 0,
        activos: 0
    });

    // Nuevo: Estado para forzar que el Dashboard se actualice
    const [refreshSignal, setRefreshSignal] = useState(0);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=get_stats');
            const data = await response.json();
            if (data.success) {
                setStats({
                    entradasHoy: data.entradasHoy || 0,
                    denegados: data.denegados || 0,
                    activos: data.activos || 0
                });
            }
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        }
    }, []);

    // Esta función se dispara cuando RegistroAcceso termina con éxito
    const handleActionSuccess = () => {
        fetchStats(); // Actualiza los numeritos de arriba
        setRefreshSignal(prev => prev + 1); // Avisa al Dashboard que debe recargar
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000); 
        return () => clearInterval(interval);
    }, [fetchStats]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* HEADER CON STATS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                        <Zap size={14} className="fill-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema en Línea</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Terminal <span className="text-emerald-500">Alpha</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Punto de Control: Acceso Principal</p>
                </div>

                <div className="flex flex-wrap gap-8 items-center bg-black/20 p-6 rounded-[2rem] border border-white/5">
                    <SimpleStat label="Flujo Hoy" value={stats.entradasHoy} icon={<ArrowUpRight size={14}/>} color="text-blue-400" />
                    <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                    <SimpleStat label="Bloqueados" value={stats.denegados} icon={<ShieldCheck size={14}/>} color="text-red-400" />
                    <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                    <SimpleStat label="En Plantel" value={stats.activos} icon={<Activity size={14}/>} color="text-emerald-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* CONSOLA DE ACCIÓN */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900/60 border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                Consola de Registro
                            </h3>
                            {/* Le pasamos la nueva función de éxito */}
                            <RegistroAcceso onRegistroExitoso={handleActionSuccess} />
                        </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-dashed border-emerald-500/20 p-6 rounded-[2rem]">
                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Radio size={12}/> Estado del Nodo
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Sincronización activa con base de datos central.
                        </p>
                    </div>
                </div>

                {/* MONITOR EN TIEMPO REAL */}
                <div className="xl:col-span-8">
                    <div className="h-full bg-slate-900/20 border border-white/5 rounded-[3rem] p-2 shadow-inner">
                        <div className="p-4 flex items-center justify-between">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6">Monitor de Tráfico</span>
                        </div>
                        {/* El Dashboard ahora recibe la señal de refresco */}
                        <Dashboard key={refreshSignal} />
                    </div>
                </div>

            </div>
        </div>
    );
};

const SimpleStat = ({ label, value, icon, color }) => (
    <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
        <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-white leading-none">
                {String(value || 0).padStart(2, '0')}
            </p>
        </div>
    </div>
);

export default TerminalAcceso;