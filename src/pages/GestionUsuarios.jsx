import React, { useState, useEffect, useCallback } from 'react';
import { 
    UserPlus, Search, UserCheck, ShieldAlert, 
    Car, ChevronLeft, ChevronRight,
    Info, Clock, MapPin, X, Lock
} from 'lucide-react';
import Swal from 'sweetalert2';
import NuevoUsuarioModal from '../components/NuevoUsuarioModal'; 

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 8; 

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            const url = `https://yanelaplumz.com.mx/api_pluma/api.php?action=get_usuarios&page=${paginaActual}&limit=${limite}&search=${busqueda}`;
            const response = await fetch(url);
            const data = await response.json();
            
            // --- CONSOLE LOG 1: Ver qué llega de la API ---
            console.log("Respuesta completa de IONOS:", data);

            if (data.success) {
                setUsuarios(data.data);
                setTotalPaginas(data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
    }, [paginaActual, busqueda]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    // Función para abrir detalle con Log
    const abrirDetalle = (u) => {
        // --- CONSOLE LOG 2: Ver el objeto específico al hacer clic ---
        console.log("Datos del usuario seleccionado:", u);
        setUsuarioDetalle(u);
    };

    const toggleEstado = async (id, nombre, estatusActual) => {
        const nuevoEstatus = estatusActual === 'Activo' ? 'Suspendido' : 'Activo';
        const result = await Swal.fire({
            title: `<span style="color:white italic font-black">¿${nuevoEstatus.toUpperCase()}?</span>`,
            html: `<p style="color:#94a3b8">Vas a cambiar el estado de acceso para <b>${nombre}</b></p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: nuevoEstatus === 'Activo' ? 'Activar Acceso' : 'Cortar Acceso',
            confirmButtonColor: nuevoEstatus === 'Activo' ? '#10b981' : '#ef4444',
            background: '#0f172a',
            color: '#fff',
            customClass: { popup: 'rounded-[2rem] border border-white/10' }
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=update_status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, estatus: nuevoEstatus })
                });
                if ((await response.json()).success) {
                    setUsuarios(usuarios.map(u => u.id === id ? { ...u, estatus: nuevoEstatus } : u));
                    Swal.fire({ title: 'Actualizado', icon: 'success', background: '#0f172a', color: '#fff' });
                }
            } catch (e) { Swal.fire('Error', 'No se pudo conectar con IONOS', 'error'); }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Pro */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Comunidad <span className="text-emerald-500 font-black">Pluma</span>
                    </h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                        <UserCheck size={12} className="text-emerald-500"/> Control de Acceso y Padrón
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] text-[10px] uppercase tracking-widest active:scale-95 flex items-center gap-3 group"
                >
                    <UserPlus size={16} className="group-hover:rotate-12 transition-transform"/> Nuevo Registro
                </button>
            </div>

            {/* Buscador */}
            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                    placeholder="Buscar por nombre o matrícula..." 
                    className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-bold outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-700 placeholder:font-medium text-sm"
                />
            </div>

            {/* Tabla */}
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] text-slate-500 text-[9px] uppercase tracking-[0.3em] font-black border-b border-white/5">
                                <th className="px-8 py-6">Usuario / Matrícula</th>
                                <th className="px-8 py-6 text-center">Unidad Principal</th>
                                <th className="px-8 py-6 text-center">Estatus</th>
                                <th className="px-8 py-6 text-right">Gestión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-24 text-emerald-500 font-black animate-pulse uppercase tracking-widest text-xs">Sincronizando Base de Datos...</td></tr>
                            ) : usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.03] transition-all group cursor-pointer border-transparent" onClick={() => abrirDetalle(u)}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-slate-950/50 rounded-xl flex items-center justify-center text-emerald-500 font-black text-xs border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                                {u.rol === 'admin' ? 'AD' : 'AL'}
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-sm group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{u.nombre}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                    {u.matricula} <span className="mx-1 text-slate-700">•</span> {u.rol}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            {u.placas_registradas ? (
                                                <span className="bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[10px] text-slate-300 font-mono font-black flex items-center gap-2 uppercase tracking-tighter">
                                                    <Car size={12} className="text-emerald-500"/> {u.placas_registradas.split(',')[0]}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] text-slate-700 font-black uppercase italic tracking-widest">Sin Placas</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                            u.estatus === 'Activo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                            {u.estatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => abrirDetalle(u)} className="p-2.5 bg-slate-950/50 rounded-xl text-slate-500 hover:text-white hover:border-white/20 border border-white/5 transition-all">
                                                <Info size={16} />
                                            </button>
                                            <button 
                                                onClick={() => toggleEstado(u.id, u.nombre, u.estatus)}
                                                className={`p-2.5 rounded-xl border border-transparent transition-all ${u.estatus === 'Activo' ? 'text-red-400 bg-red-500/5 hover:bg-red-500/20 hover:border-red-500/30' : 'text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20 hover:border-emerald-500/30'}`}
                                            >
                                                {u.estatus === 'Activo' ? <ShieldAlert size={16} /> : <UserCheck size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="bg-black/20 p-6 flex items-center justify-between border-t border-white/5">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] italic">Seguimiento de Registros {paginaActual} — {totalPaginas}</p>
                    <div className="flex gap-2">
                        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)} className="p-3 bg-slate-950/50 rounded-xl text-emerald-500 disabled:opacity-10 hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><ChevronLeft size={18} /></button>
                        <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)} className="p-3 bg-slate-950/50 rounded-xl text-emerald-500 disabled:opacity-10 hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* MODAL DETALLE */}
            {usuarioDetalle && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setUsuarioDetalle(null)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                        </div>
                        
                        <div className="p-12">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.3)] rotate-3">
                                    <UserCheck size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{usuarioDetalle.nombre}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{usuarioDetalle.rol}</span>
                                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID {usuarioDetalle.matricula}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-5">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-2">
                                        <Car size={14} className="text-emerald-500"/> Garaje Vinculado
                                    </h3>
                                    <div className="space-y-3">
                                        {usuarioDetalle.placas_registradas ? usuarioDetalle.placas_registradas.split(',').map((p, i) => (
                                            <div key={i} className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5 flex flex-col gap-2 group hover:border-emerald-500/20 transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white font-mono font-black text-lg tracking-tight group-hover:text-emerald-400 transition-colors">{p.trim()}</span>
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                </div>
                                                {/* CAMBIO AQUÍ: Ahora muestra el modelo real si existe */}
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">
                                                    {usuarioDetalle.modelo || "Unidad Activa en Sistema"}
                                                </p>
                                            </div>
                                        )) : (
                                            <div className="bg-black/20 p-5 rounded-[1.5rem] border border-dashed border-white/5 text-center">
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Sin unidades registradas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-2">
                                        <Clock size={14} className="text-emerald-500"/> Posición Actual
                                    </h3>
                                    <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center gap-4 transition-all ${
                                        usuarioDetalle.ubicacion === 'Dentro' 
                                        ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_20px_40px_rgba(16,185,129,0.05)]' 
                                        : 'bg-slate-950/40 border-white/5'
                                    }`}>
                                        <div className="relative">
                                            <MapPin className={usuarioDetalle.ubicacion === 'Dentro' ? 'text-emerald-500' : 'text-slate-700'} size={32} />
                                            {usuarioDetalle.ubicacion === 'Dentro' && <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>}
                                        </div>
                                        <div>
                                            <p className={`font-black text-sm uppercase italic ${usuarioDetalle.ubicacion === 'Dentro' ? 'text-white' : 'text-slate-500'}`}>
                                                {usuarioDetalle.ubicacion === 'Dentro' ? 'Localizado en Plantel' : 'Fuera de Instalaciones'}
                                            </p>
                                            <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-2">Sincronizado vía Gateway IONOS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <NuevoUsuarioModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchUsuarios} 
            />
        </div>
    );
};

export default GestionUsuarios;