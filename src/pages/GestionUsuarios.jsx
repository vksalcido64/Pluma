import React, { useState, useEffect, useCallback } from 'react';
import { 
    UserPlus, Search, UserCheck, ShieldAlert, 
    Car, ChevronLeft, ChevronRight,
    Info, Clock, MapPin, X, Lock, Hash, Building,
    Trash2, Plus, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import NuevoUsuarioModal from '../components/NuevoUsuarioModal'; 

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);

    // --- ESTADO DE PAGINACIÓN ---
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 8; 

    // --- FUNCIÓN PARA OBTENER USUARIOS (CON PAGINACIÓN) ---
    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            // Se envía la página y el límite al API de IONOS
            const url = `https://yanelaplumz.com.mx/api_pluma/api.php?action=get_usuarios&page=${paginaActual}&limit=${limite}&search=${busqueda}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setUsuarios(data.data || []);
                // Se actualiza el total de páginas desde la respuesta del servidor
                setTotalPaginas(data.pagination?.pages || 1);
            } else {
                setUsuarios([]);
                setTotalPaginas(1);
            }

        } catch (error) {
            console.error("Error en Fetch:", error);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }, [paginaActual, busqueda]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    // --- GESTIÓN DE VEHÍCULOS (ADD / REMOVE) ---
    const gestionarVehiculo = async (accion, placa) => {
        let placaFinal = placa;
        
        if (accion === 'add') {
            const { value: nuevaPlaca } = await Swal.fire({
                title: 'Registrar Unidad',
                input: 'text',
                inputLabel: 'Ingrese el número de placa',
                inputPlaceholder: 'Ej: ABC-123',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                confirmButtonColor: '#10b981',
                cancelButtonText: 'Cancelar',
                background: '#0f172a',
                color: '#fff',
                customClass: { popup: 'rounded-[2rem] border border-white/10' }
            });
            if (!nuevaPlaca) return;
            placaFinal = nuevaPlaca.toUpperCase();
        } else if (accion === 'remove') {
            const confirm = await Swal.fire({
                title: '¿Eliminar vehículo?',
                text: `Se desvinculará la placa ${placa} de este usuario`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                background: '#0f172a',
                color: '#fff'
            });
            if (!confirm.isConfirmed) return;
        }

        try {
            const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=manage_vehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    usuario_id: usuarioDetalle.id, 
                    placa: placaFinal, 
                    type: accion 
                })
            });

            const data = await response.json();

            if (data.success) {
                // Actualización optimista del estado local del modal
                const listaActual = usuarioDetalle.placas_registradas ? usuarioDetalle.placas_registradas.split(',') : [];
                let nuevasPlacas = "";

                if (accion === 'add') {
                    nuevasPlacas = listaActual.length > 0 ? [...listaActual, placaFinal].join(',') : placaFinal;
                } else {
                    nuevasPlacas = listaActual.filter(p => p.trim() !== placaFinal).join(',');
                }

                setUsuarioDetalle({ ...usuarioDetalle, placas_registradas: nuevasPlacas });
                fetchUsuarios(); // Recargar lista de fondo
                Swal.fire({ icon: 'success', title: 'Padrón Actualizado', background: '#0f172a', color: '#fff', timer: 1500 });
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
        }
    };

    // --- CAMBIAR ESTATUS (ACTIVO / SUSPENDIDO) ---
    const toggleEstado = async (id, nombre, estatusActual) => {
        const nuevoEstatus = estatusActual === 'Activo' ? 'Suspendido' : 'Activo';

        const result = await Swal.fire({
            title: `<span style="color:white; font-style:italic; font-weight:900;">¿CAMBIAR ESTADO?</span>`,
            html: `<p style="color:#94a3b8">Vas a cambiar el estado de <b>${nombre}</b> a <b style="color:${nuevoEstatus === 'Activo' ? '#10b981' : '#ef4444'}">${nuevoEstatus.toUpperCase()}</b></p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: nuevoEstatus === 'Activo' ? 'Activar Acceso' : 'Suspender Acceso',
            confirmButtonColor: nuevoEstatus === 'Activo' ? '#10b981' : '#ef4444',
            cancelButtonText: 'Cancelar',
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

                const data = await response.json();

                if (data.success) {
                    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estatus: nuevoEstatus } : u));
                    if(usuarioDetalle?.id === id) setUsuarioDetalle({...usuarioDetalle, estatus: nuevoEstatus});
                    Swal.fire({ title: 'Actualizado', icon: 'success', background: '#0f172a', color: '#fff' });
                }
            } catch {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        }
    };

    const abrirDetalle = (u) => setUsuarioDetalle(u);

    return (
        <div className="space-y-6 p-6 animate-in fade-in duration-700">

            {/* HEADER PRINCIPAL */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                <div className="z-10">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                        Comunidad <span className="text-emerald-500">Pluma</span>
                    </h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                        <Zap size={12} className="text-emerald-500 animate-pulse"/> Control de Acceso y Padrón Vehicular
                    </p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] text-[11px] uppercase tracking-widest active:scale-95 flex items-center gap-3 group mt-6 md:mt-0 z-10"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform"/> Nuevo Registro
                </button>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                    value={busqueda}
                    onChange={(e)=>{ setBusqueda(e.target.value); setPaginaActual(1); }}
                    placeholder="Buscar por nombre, matrícula o edificio..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-700"
                />
            </div>

            {/* TABLA DE USUARIOS */}
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
                                <tr>
                                    <td colSpan="4" className="text-center py-24 text-emerald-500 font-black animate-pulse uppercase tracking-widest text-xs">
                                        Sincronizando Base de Datos...
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-24 text-slate-600 font-black uppercase tracking-widest text-[10px] italic">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            ) : usuarios.map((u) => (
                                <tr 
                                    key={u.id} 
                                    className="hover:bg-white/[0.03] transition-all group cursor-pointer"
                                    onClick={() => abrirDetalle(u)}
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-slate-950/50 rounded-xl flex items-center justify-center text-emerald-500 font-black text-xs border border-white/5 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                                                {u.nombre?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{u.nombre}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                    {u.matricula} <span className="mx-1 text-slate-700">•</span> {u.edificio || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {u.placas_registradas ? (
                                            <span className="bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[10px] text-slate-300 font-mono font-black flex items-center justify-center gap-2 uppercase tracking-tighter w-fit mx-auto">
                                                <Car size={12} className="text-emerald-500"/> {u.placas_registradas.split(',')[0]}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] text-slate-700 font-black uppercase italic tracking-widest">Sin Unidades</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                                            u.estatus === 'Activo'
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                            {u.estatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right" onClick={(e)=>e.stopPropagation()}>
                                        <div className="flex justify-end gap-3">
                                            <button onClick={()=>abrirDetalle(u)} className="p-3 bg-slate-950/50 rounded-xl text-slate-500 hover:text-white border border-white/5 transition-all">
                                                <Info size={16}/>
                                            </button>
                                            <button 
                                                onClick={()=>toggleEstado(u.id, u.nombre, u.estatus)}
                                                className={`p-3 rounded-xl border border-transparent transition-all ${
                                                    u.estatus === 'Activo' ? 'text-red-400 bg-red-500/5 hover:bg-red-500/20' : 'text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20'
                                                }`}
                                            >
                                                {u.estatus === 'Activo' ? <ShieldAlert size={16}/> : <UserCheck size={16}/>}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINACIÓN MEJORADA --- */}
                <div className="p-8 bg-black/20 flex items-center justify-between border-t border-white/5">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] italic">
                        Mostrando página {paginaActual} de {totalPaginas}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={paginaActual === 1}
                            onClick={()=>setPaginaActual(prev => Math.max(prev - 1, 1))}
                            className="p-3 bg-slate-950/50 rounded-xl text-emerald-500 disabled:opacity-10 hover:bg-emerald-500 hover:text-black transition-all border border-white/5"
                        >
                            <ChevronLeft size={18}/>
                        </button>

                        <button
                            disabled={paginaActual === totalPaginas}
                            onClick={()=>setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                            className="p-3 bg-slate-950/50 rounded-xl text-emerald-500 disabled:opacity-10 hover:bg-emerald-500 hover:text-black transition-all border border-white/5"
                        >
                            <ChevronRight size={18}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DETALLE PREMIUM (RESTAURADO) */}
            {usuarioDetalle && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div onClick={()=>setUsuarioDetalle(null)} className="absolute inset-0" />

                    <div className="relative bg-slate-900 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-500">
                        
                        {/* Header Detalle */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.01]">
                            <div className="flex gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl font-black text-emerald-500 italic rotate-3">
                                    {usuarioDetalle.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{usuarioDetalle.nombre}</h2>
                                    <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-[0.3em] mt-1">Miembro Comunidad Pluma</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                                            <Hash size={12} className="text-slate-500" />
                                            <span className="text-[10px] font-mono font-black text-slate-300">{usuarioDetalle.matricula}</span>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${usuarioDetalle.estatus === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {usuarioDetalle.estatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={()=>setUsuarioDetalle(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 transition-colors border border-white/5">
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Unidades Vinculadas */}
                            <div>
                                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-5 flex items-center gap-2">
                                    <Car size={14} className="text-emerald-500"/> Padrón Vehicular
                                </h3>
                                <div className="space-y-3">
                                    {usuarioDetalle.placas_registradas ? usuarioDetalle.placas_registradas.split(',').map((placa, index) => (
                                        <div key={index} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                                            <span className="text-white font-mono font-black text-sm uppercase">{placa.trim()}</span>
                                            <button 
                                                onClick={() => gestionarVehiculo('remove', placa.trim())}
                                                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-[9px] text-slate-700 italic uppercase font-black">Sin vehículos vinculados</p>
                                    )}
                                    <button 
                                        onClick={() => gestionarVehiculo('add', '')}
                                        className="w-full p-3 border border-dashed border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase flex items-center justify-center gap-2 hover:bg-emerald-500/5 transition-all"
                                    >
                                        <Plus size={14}/> Vincular Unidad
                                    </button>
                                </div>
                            </div>

                            {/* Ubicación y Seguridad */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-5">Localización Actual</h3>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                                        <div className="relative">
                                            <MapPin className={usuarioDetalle.ubicacion === 'Dentro' ? 'text-emerald-500' : 'text-slate-700'} size={28} />
                                            {usuarioDetalle.ubicacion === 'Dentro' && <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase italic">{usuarioDetalle.ubicacion === 'Dentro' ? 'Localizado en Plantel' : 'Fuera de Instalaciones'}</p>
                                            <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">Sincronizado vía Gateway IONOS</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Seguridad Padrón</h3>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Primer Ingreso:</span>
                                        <span className={`text-[8px] font-black px-3 py-1 rounded-lg ${usuarioDetalle.primer_ingreso === 1 ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {usuarioDetalle.primer_ingreso === 1 ? 'PENDIENTE CAMBIO' : 'COMPLETADO'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.01] text-center border-t border-white/5">
                            <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.4em]">Pluma Access Control System v2.0 • Nogales Gateway</p>
                        </div>
                    </div>
                </div>
            )}

            <NuevoUsuarioModal 
                isOpen={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
                onRefresh={fetchUsuarios}
            />
        </div>
    );
};

export default GestionUsuarios;