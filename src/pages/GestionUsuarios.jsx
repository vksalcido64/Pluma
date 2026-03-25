import React, { useState, useEffect, useCallback } from 'react';
import { 
    UserPlus, Search, UserCheck, ShieldAlert, 
    Car, ChevronLeft, ChevronRight,
    Info, Clock, MapPin, X
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

    // 🔥 FETCH FIX
    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            const url = `https://yanelaplumz.com.mx/api_pluma/api.php?action=get_usuarios&page=${paginaActual}&limit=${limite}&search=${busqueda}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setUsuarios(data.data || []);
                setTotalPaginas(data.pagination?.pages || 1);
            } else {
                setUsuarios([]);
            }

        } catch (error) {
            console.error("Error:", error);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }, [paginaActual, busqueda]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const abrirDetalle = (u) => {
        setUsuarioDetalle(u);
    };

    const toggleEstado = async (id, nombre, estatusActual) => {
        const nuevoEstatus = estatusActual === 'Activo' ? 'Suspendido' : 'Activo';

        const result = await Swal.fire({
            title: `¿Cambiar estado?`,
            text: `${nombre} → ${nuevoEstatus}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            background: '#0f172a',
            color: '#fff'
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
                    setUsuarios(prev =>
                        prev.map(u => u.id === id ? { ...u, estatus: nuevoEstatus } : u)
                    );
                }

            } catch {
                Swal.fire('Error', 'No se pudo conectar', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black text-white italic">
                        Comunidad <span className="text-emerald-500">Pluma</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Control de acceso
                    </p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition active:scale-95"
                >
                    <UserPlus size={16}/> Nuevo
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"/>
                <input
                    value={busqueda}
                    onChange={(e)=>setBusqueda(e.target.value)}
                    placeholder="Buscar usuario..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white outline-none focus:border-emerald-500"
                />
            </div>

            {/* TABLA */}
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-md">

                <table className="w-full">

                    <thead className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="p-6 text-left">Usuario</th>
                            <th className="text-center">Vehículo</th>
                            <th className="text-center">Estatus</th>
                            <th className="text-right pr-6">Acción</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center p-10 text-emerald-500">
                                    Cargando...
                                </td>
                            </tr>
                        ) : usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-10 text-slate-500">
                                    Sin resultados
                                </td>
                            </tr>
                        ) : usuarios.map((u) => (

                            <tr 
                                key={u.id} 
                                className="hover:bg-white/5 transition cursor-pointer"
                                onClick={() => abrirDetalle(u)}
                            >

                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-black">
                                            {u.nombre?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{u.nombre}</p>
                                            <p className="text-xs text-slate-500">
                                                {u.matricula} • {u.edificio || 'Sin edificio'}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="text-center text-slate-300">
                                    {u.placas_registradas || '---'}
                                </td>

                                <td className="text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        u.estatus === 'Activo'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-red-500/10 text-red-400'
                                    }`}>
                                        {u.estatus}
                                    </span>
                                </td>

                                <td 
                                    className="text-right pr-6"
                                    onClick={(e)=>e.stopPropagation()}
                                >
                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={()=>abrirDetalle(u)}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 transition"
                                        >
                                            <Info size={16}/>
                                        </button>

                                        <button
                                            onClick={()=>toggleEstado(u.id, u.nombre, u.estatus)}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 transition"
                                        >
                                            <ShieldAlert size={16}/>
                                        </button>

                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>
                </table>

                {/* PAGINACIÓN */}
                <div className="p-6 flex justify-between border-t border-white/5">
                    <p className="text-xs text-slate-500">
                        Página {paginaActual} / {totalPaginas}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={paginaActual === 1}
                            onClick={()=>setPaginaActual(p=>p-1)}
                            className="px-4 py-2 bg-slate-800 rounded-xl text-white disabled:opacity-20"
                        >
                            <ChevronLeft/>
                        </button>

                        <button
                            disabled={paginaActual === totalPaginas}
                            onClick={()=>setPaginaActual(p=>p+1)}
                            className="px-4 py-2 bg-slate-800 rounded-xl text-white disabled:opacity-20"
                        >
                            <ChevronRight/>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DETALLE */}
            {usuarioDetalle && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    <div 
                        onClick={()=>setUsuarioDetalle(null)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                    />

                    <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-xl">

                        <button 
                            onClick={()=>setUsuarioDetalle(null)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white"
                        >
                            <X/>
                        </button>

                        <h2 className="text-white text-2xl font-black mb-4">
                            {usuarioDetalle.nombre}
                        </h2>

                        <p className="text-slate-400">{usuarioDetalle.matricula}</p>

                        <p className="mt-4 text-emerald-400">
                            {usuarioDetalle.edificio || 'Sin edificio'}
                        </p>

                        <p className="mt-4 text-slate-400">
                            {usuarioDetalle.placas_registradas || 'Sin vehículo'}
                        </p>

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