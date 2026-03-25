import React, { useState, useEffect, useCallback } from 'react';
import { 
  Car, Clock, ArrowLeftRight, Plus, 
  ShieldCheck, RefreshCcw, Loader2,
  Trash2, MapPin, Calendar, LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const MiVehiculo = () => {
    // Extraemos la matrícula del usuario logueado
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const miMatricula = user.matricula || '';
    
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        horasMes: '0 hrs',
        ultimoMov: '---',
        fechaMov: 'Sin registros',
        ubicacion: 'Fuera'
    });

    // --- FETCH DE DATOS ---
    const fetchData = useCallback(async () => {
        if (!miMatricula) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://yanelaplumz.com.mx/api_pluma/api.php?action=get_mis_vehiculos&id=${miMatricula}`
            );
            const data = await res.json();

            if (data.success) {
                setVehiculos(data.data || []);
                // Los KPIs ahora toman datos reales del backend
                setStats({
                    horasMes: data.horas || '0 hrs',
                    ubicacion: data.ubicacion || 'Fuera',
                    ultimoMov: data.ultimoMov || 'Sin movimientos',
                    fechaMov: data.fechaMov || '---'
                });
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
            setLoading(false);
        }
    }, [miMatricula]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- FUNCIÓN PARA ELIMINAR VEHÍCULO ---
    const handleEliminarVehiculo = async (placa) => {
        const result = await Swal.fire({
            title: '<span style="color:white; font-family:inherit; font-weight:900;">¿ELIMINAR UNIDAD?</span>',
            html: `<p style="color:#94a3b8; font-size:14px;">La placa <b style="color:#ef4444;">${placa}</b> será desvinculada de tu cuenta.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ELIMINAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ef4444',
            background: '#0f172a',
            color: '#fff',
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/10 backdrop-blur-xl',
                confirmButton: 'rounded-2xl font-black px-6 py-3',
                cancelButton: 'rounded-2xl font-black px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=delete_vehiculo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ placa, matricula: miMatricula })
                });
                const data = await res.json();

                if (data.success) {
                    Swal.fire({ title: 'ELIMINADO', icon: 'success', background: '#0f172a', color: '#fff' });
                    fetchData(); // Recargar datos
                } else {
                    Swal.fire('Error', data.message || 'No se pudo eliminar', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Problema de conexión', 'error');
            }
        }
    };

    // --- FUNCIÓN AGREGAR (Mantiene tu estructura) ---
    const handleNuevoVehiculo = () => {
        Swal.fire({
            title: 'NUEVA UNIDAD',
            text: 'Contacta a seguridad para vincular una nueva placa a tu matrícula.',
            icon: 'info',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#10b981'
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            
            {/* HEADER */}
            <div className="flex justify-between items-center bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                            <Car size={18} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                            Mis <span className="text-emerald-500 font-black">Vehículos</span>
                        </h2>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] ml-1">
                        Gestión de unidades y flujo de acceso
                    </p>
                </div>
                <button 
                    onClick={fetchData}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all active:scale-90"
                >
                    <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* KPIs FUNCIONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat 
                    icon={<Clock size={20}/>} 
                    label="Uso del Mes" 
                    value={stats.horasMes} 
                    sub="Tiempo en plantel"
                    color="emerald" 
                />
                <Stat 
                    icon={<MapPin size={20}/>} 
                    label="Estado Actual" 
                    value={stats.ubicacion} 
                    sub="Localización"
                    color={stats.ubicacion === 'Dentro' ? 'emerald' : 'orange'} 
                />
                <Stat 
                    icon={<ArrowLeftRight size={20}/>} 
                    label="Último Flujo" 
                    value={stats.ultimoMov} 
                    sub={stats.fechaMov}
                    color="blue" 
                />
                <Stat 
                    icon={<ShieldCheck size={20}/>} 
                    label="Unidades" 
                    value={vehiculos.length} 
                    sub="Registradas"
                    color="purple" 
                />
            </div>

            {/* LISTADO DE CARROS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehiculos.map((v, i) => (
                    <div key={i} className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/20 transition-all relative overflow-hidden backdrop-blur-sm">
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                                <Car size={24}/>
                            </div>
                            <button 
                                onClick={() => handleEliminarVehiculo(v.placa)}
                                className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                            >
                                <Trash2 size={18}/>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                {v.modelo || 'Sin Modelo'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10 tracking-widest uppercase">
                                    {v.placa}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    {v.color || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-slate-600"/>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Año: {v.anio || '---'}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-800 group-hover:text-emerald-500 transition-colors"/>
                        </div>
                    </div>
                ))}

                {/* BOTON AGREGAR - Estilizado como Card */}
                <div 
                    onClick={handleNuevoVehiculo}
                    className="group border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all min-h-[200px]"
                >
                    <div className="p-4 bg-white/5 rounded-full text-slate-700 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all mb-4">
                        <Plus size={30}/>
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-emerald-500/50 transition-all">Añadir Unidad</p>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 className="text-emerald-500 animate-spin" size={40} />
                </div>
            )}
        </div>
    );
};

// COMPONENTE KPI MEJORADO
const Stat = ({ icon, label, value, sub, color }) => {
    const colors = {
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    };

    return (
        <div className={`p-8 rounded-[2.5rem] bg-slate-900/40 border backdrop-blur-md transition-all hover:scale-[1.02] ${colors[color]}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    {icon}
                </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">{label}</p>
            <h4 className="text-2xl font-black text-white italic tracking-tighter mb-1 uppercase">{value}</h4>
            <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">{sub}</p>
        </div>
    );
};

export default MiVehiculo;