import React, { useState } from 'react';
import { UserPlus, Calendar, Building, Ticket, QrCode, ClipboardCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const RegistroVisitas = () => {
    // Estado para los campos que pide tu tabla [dbo].[visitantes] y [dbo].[visitas]
    const [visita, setVisita] = useState({
        nombre: '',
        documento: '', // INE / Identificación
        empresa: '',
        fecha: '',
        motivo: '',
        id_anfitrion: '1' // ID del alumno logueado
    });

    const handleChange = (e) => {
        setVisita({ ...visita, [e.target.name]: e.target.value });
    };

    const generarPase = (e) => {
        e.preventDefault();

        // Simulación de la lógica de tu tabla [pases_visitante]
        const tokenSimulado = Math.random().toString(36).substring(2, 10).toUpperCase();

        Swal.fire({
            title: '¡Pase Generado!',
            html: `
                <div class="p-4 bg-white rounded-lg mb-4">
                    <p class="text-emerald-950 font-black text-xl mb-2">${tokenSimulado}</p>
                    <p class="text-gray-500 text-xs">Presenta este código o el QR en caseta</p>
                </div>
            `,
            icon: 'success',
            background: '#064e3b',
            color: '#ecfdf5',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Descargar QR'
        });
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Instrucciones */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
                        <Ticket className="text-emerald-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Pases Digitales</h3>
                        <p className="text-emerald-400/70 text-sm leading-relaxed">
                            Al registrar una visita, el sistema genera un token único vinculado a la identificación del visitante. 
                            <br /><br />
                            El acceso será válido únicamente para la fecha seleccionada.
                        </p>
                    </div>
                    
                    <div className="bg-emerald-900/20 border border-emerald-800 p-6 rounded-3xl flex items-center gap-4 text-emerald-300">
                        <QrCode size={30} />
                        <span className="text-xs font-bold uppercase tracking-tighter">Compatible con Escáner QR de Caseta</span>
                    </div>
                </div>

                {/* Columna Derecha: Formulario */}
                <div className="lg:col-span-2 bg-emerald-900/40 backdrop-blur-sm border border-emerald-800 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <UserPlus className="text-emerald-400" /> Datos del Visitante
                    </h2>

                    <form onSubmit={generarPase} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre - Tabla [visitantes] */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Nombre Completo</label>
                                <input 
                                    name="nombre"
                                    type="text" 
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Documento - Tabla [visitantes] (INE/Identificación) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">ID / Documento (INE)</label>
                                <input 
                                    name="documento"
                                    type="text" 
                                    placeholder="Clave de Elector"
                                    className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Empresa - Tabla [visitantes] */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Empresa / Procedencia</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3.5 text-emerald-600" size={18} />
                                    <input 
                                        name="empresa"
                                        type="text" 
                                        placeholder="Particular, Telmex, etc."
                                        className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Fecha - Tabla [visitas] */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Fecha de Visita</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-emerald-600" size={18} />
                                    <input 
                                        name="fecha"
                                        type="date" 
                                        className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Motivo - Tabla [visitas] */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Motivo de la Visita</label>
                            <textarea 
                                name="motivo"
                                rows="3"
                                placeholder="Describa brevemente el motivo..."
                                className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            <ClipboardCheck size={20} />
                            Generar Invitación y Token
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroVisitas;