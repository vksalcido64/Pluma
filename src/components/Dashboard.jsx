import React, { useState, useEffect, useCallback } from 'react';
import { 
    Clock, User, MapPin, 
    ChevronRight, ArrowUpRight, 
    AlertCircle, CheckCircle2,
    RefreshCw
} from 'lucide-react';

const Dashboard = () => {
    // 1. Estados iniciales
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Función para traer datos de IONOS
    const fetchMovimientos = useCallback(async () => {
        try {
            const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=get_movimientos');
            const result = await response.json();
            
            if (result.success) {
                // LÓGICA "ANTIBUG": Extrae los datos sin importar si vienen en .data o .data.data
                const dataRaw = result.data?.data || result.data || [];
                const dataFinal = Array.isArray(dataRaw) ? dataRaw : [];
                setRegistros(dataFinal);
            }
        } catch (error) {
            console.error("Error al cargar movimientos:", error);
            setRegistros([]); 
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Auto-refresh cada 10 segundos para efecto "En Vivo"
    useEffect(() => {
        fetchMovimientos();
        const interval = setInterval(fetchMovimientos, 10000);
        return () => clearInterval(interval);
    }, [fetchMovimientos]);

    // 4. Formateador de tiempo (HH:MM AM/PM)
    const formatHora = (fechaStr) => {
        if (!fechaStr) return "--:--";
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch(e) { return "--:--"; }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-900/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl">
            
            {/* Cabecera */}
            <div className="p-8 pb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-black text-sm uppercase italic tracking-widest">
                        Registros <span className="text-emerald-500">Recientes</span>
                    </h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">
                        Actividad en tiempo real del plantel
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* Lista de Movimientos */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar scroll-smooth">
                {loading && registros.length === 0 ? (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic text-center">
                            Sincronizando con <br/> Terminal Alpha...
                        </p>
                    </div>
                ) : (registros.length > 0) ? (
                    registros.map((r) => (
                        <div 
                            key={r.id} 
                            className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-[2rem] transition-all duration-300 hover:scale-[1.01] hover:shadow-xl shadow-black/20"
                        >
                            <div className="flex items-center gap-5">
                                {/* Icono dinámico: Entrada (Check) / Salida (Flecha) */}
                                <div className={`p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${
                                    r.tipo === 'Entrada' 
                                    ? 'bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/5' 
                                    : 'bg-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/5'
                                }`}>
                                    {r.tipo === 'Entrada' ? <CheckCircle2 size={22} /> : <ArrowUpRight size={22} />}
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-white text-sm uppercase italic tracking-tight">
                                            {r.placa || 'S/N'}
                                        </h4>
                                        <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border ${
                                            r.tipo === 'Entrada' 
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                        }`}>
                                            {r.tipo}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Clock size={12} className="text-emerald-500/50"/>
                                            <span className="text-[10px] font-bold uppercase">{formatHora(r.fecha)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 border-l border-white/10 pl-4">
                                            <MapPin size={12} className="text-blue-500/50"/>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Acceso Alpha</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle Lateral */}
                            <div className="flex items-center gap-4">
                                <div className={`hidden md:block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                                    r.tipo === 'Entrada' 
                                    ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 group-hover:bg-emerald-500/20' 
                                    : 'border-blue-500/20 text-blue-400 bg-blue-500/5 group-hover:bg-blue-500/20'
                                }`}>
                                    Registro OK
                                </div>
                                <div className="p-2 text-slate-700 group-hover:text-emerald-400 transition-all transform group-hover:translate-x-1">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center opacity-40">
                        <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic">
                            Sin movimientos registrados hoy
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto p-6 bg-white/5 border-t border-white/5 flex justify-between items-center px-8">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
                    Sync: IONOS Database Engine
                </p>
                <button 
                    onClick={() => { setLoading(true); fetchMovimientos(); }}
                    className="text-[10px] font-black text-emerald-500 hover:text-white uppercase tracking-[0.2em] transition-all bg-emerald-500/5 px-4 py-2 rounded-lg hover:bg-emerald-500 active:scale-95"
                >
                    Forzar Refresh
                </button>
            </div>
        </div>
    );
};

export default Dashboard;