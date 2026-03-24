import React, { useState, useEffect } from 'react';
import { 
    Clock, User, MapPin, 
    ChevronRight, ArrowUpRight, 
    AlertCircle, CheckCircle2 
} from 'lucide-react';

const Dashboard = () => {
    // 1. Estado para almacenar los movimientos reales de la BD
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Función para traer datos de IONOS
    const fetchMovimientos = async () => {
        try {
            const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=get_movimientos');
            const result = await response.json();
            if (result.success) {
                setRegistros(result.data);
            }
        } catch (error) {
            console.error("Error al cargar movimientos:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Cargar datos al montar el componente
    useEffect(() => {
        fetchMovimientos();
        // Opcional: Recargar cada 10 segundos para efecto "Live"
        const interval = setInterval(fetchMovimientos, 10000);
        return () => clearInterval(interval);
    }, []);

    // 4. Formateador de fecha/hora sencillo
    const formatHora = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-900/20 backdrop-blur-md rounded-[2.5rem] border border-white/5">
            
            {/* Cabecera del Listado */}
            <div className="p-8 pb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-black text-sm uppercase italic tracking-widest">
                        Registros <span className="text-emerald-500">Recientes</span>
                    </h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Actividad en tiempo real de la pluma</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Live</span>
                </div>
            </div>

            {/* Lista de Movimientos */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
                {loading ? (
                    <p className="text-center text-slate-500 text-[10px] uppercase font-black animate-pulse">Sincronizando con Servidor...</p>
                ) : registros.length === 0 ? (
                    <p className="text-center text-slate-500 text-[10px] uppercase font-black">No hay movimientos registrados hoy</p>
                ) : registros.map((r) => (
                    <div 
                        key={r.id} 
                        className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-[2rem] transition-all duration-300 hover:scale-[1.01] hover:shadow-xl shadow-black/20"
                    >
                        <div className="flex items-center gap-5">
                            {/* Estado Dinámico basado en el tipo (Entrada/Salida) */}
                            <div className={`p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${
                                r.tipo === 'Entrada' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-blue-500/10 text-blue-500'
                            }`}>
                                {r.tipo === 'Entrada' ? <CheckCircle2 size={22} /> : <ArrowUpRight size={22} />}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-black text-white text-sm uppercase italic tracking-tight">Placa: {r.placa}</h4>
                                    <span className={`text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest ${
                                        r.tipo === 'Entrada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
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

                        {/* Indicador de Acción */}
                        <div className="flex items-center gap-4">
                            <div className={`hidden md:block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-colors ${
                                r.tipo === 'Entrada' 
                                ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                                : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
                            }`}>
                                Autorizado
                            </div>
                            <div className="p-2 text-slate-700 group-hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer del Dashboard */}
            <div className="mt-auto p-6 bg-white/5 border-t border-white/5 text-center">
                <button 
                    onClick={fetchMovimientos}
                    className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.2em] transition-all"
                >
                    Refrescar ahora
                </button>
            </div>
        </div>
    );
};

export default Dashboard;