import React, { useState } from 'react';
import { UserPlus, Search, UserCheck, UserX, GraduationCap, Building2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

const GestionUsuarios = () => {
    // Datos de ejemplo basados en tu BD (Luego vendrán de tu API en IONOS)
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: "Viktor Nogales", correo: "viktor@utn.edu.mx", carrera: "Software", activo: 1 },
        { id: 2, nombre: "Juan Perez", correo: "juan.p@utn.edu.mx", carrera: "Mecatrónica", activo: 0 },
        { id: 3, nombre: "Maria Lopez", correo: "m.lopez@utn.edu.mx", carrera: "Industrial", activo: 1 },
    ]);

    const toggleEstado = (id, nombre, estadoActual) => {
        const nuevoEstado = estadoActual === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'Activar' : 'Bloquear';

        Swal.fire({
            title: `¿${accion} Usuario?`,
            text: `Vas a cambiar el estado de ${nombre}. Esto afectará el acceso en tiempo real.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: nuevoEstado === 1 ? '#10b981' : '#ef4444',
            confirmButtonText: `Sí, ${accion}`,
            background: '#064e3b',
            color: '#ecfdf5'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí se haría el UPDATE a la tabla [usuarios]
                setUsuarios(usuarios.map(u => u.id === id ? { ...u, activo: nuevoEstado } : u));
                Swal.fire('Actualizado', `El usuario ha sido ${nuevoEstado === 1 ? 'activado' : 'bloqueado'}.`, 'success');
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Barra de Acciones Superior */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-emerald-900/20 p-6 rounded-3xl border border-emerald-800">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="text-emerald-400" /> Control de Alumnos y Personal
                    </h2>
                    <p className="text-emerald-400/60 text-sm">Administración de credenciales y estatus de acceso</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10">
                    <UserPlus size={20} /> Nuevo Registro
                </button>
            </div>

            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, correo o matrícula..." 
                    className="w-full bg-emerald-950/40 border border-emerald-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-emerald-900/30 rounded-3xl border border-emerald-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-emerald-800/50 text-emerald-300 text-xs uppercase tracking-[0.2em] font-black">
                            <th className="px-6 py-5">Usuario</th>
                            <th className="px-6 py-5">Departamento / Carrera</th>
                            <th className="px-6 py-5 text-center">Estatus</th>
                            <th className="px-6 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/50">
                        {usuarios.map((u) => (
                            <tr key={u.id} className="hover:bg-emerald-800/20 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-700 group-hover:border-emerald-500 transition-colors">
                                            <UserCheck className="text-emerald-400" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{u.nombre}</div>
                                            <div className="text-xs text-emerald-500">{u.correo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-emerald-200">
                                        <Building2 size={16} className="text-emerald-600" />
                                        <span className="text-sm">{u.carrera}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        u.activo === 1 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                        {u.activo === 1 ? 'Activo' : 'Bloqueado'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button 
                                        onClick={() => toggleEstado(u.id, u.nombre, u.activo)}
                                        className={`p-2.5 rounded-xl transition-all ${
                                            u.activo === 1 
                                            ? 'text-red-400 hover:bg-red-500/10' 
                                            : 'text-emerald-400 hover:bg-emerald-500/10'
                                        }`}
                                        title={u.activo === 1 ? "Bloquear Acceso" : "Permitir Acceso"}
                                    >
                                        {u.activo === 1 ? <ShieldAlert size={22} /> : <UserCheck size={22} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-dashed border-emerald-800 text-center">
                <p className="text-xs text-emerald-600 font-medium">
                    Nota: Los cambios en el estatus de usuario se reflejan inmediatamente en la lógica del Trigger SQL de la pluma.
                </p>
            </div>
        </div>
    );
};

export default GestionUsuarios;