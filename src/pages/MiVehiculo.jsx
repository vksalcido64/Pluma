import React, { useState } from 'react';
import { 
  Car, Clock, ArrowLeftRight, Plus, 
  Settings, ShieldCheck, Calendar, Trash2 
} from 'lucide-react';
import Swal from 'sweetalert2';

const MiVehiculo = () => {
    // Datos simulados del usuario logueado
    const [vehiculos, setVehiculos] = useState([
        { id: 1, placa: 'VNK-92-26', modelo: 'Toyota Tacoma 2024', color: 'Gris Oxford', status: 'En Plantel' },
    ]);

    const handleAddVehiculo = () => {
        Swal.fire({
            title: 'Registrar Nuevo Vehículo',
            html: `
                <input id="placa" class="swal2-input" placeholder="Placa">
                <input id="modelo" class="swal2-input" placeholder="Modelo (Ej. Mazda 3)">
            `,
            background: '#0f172a',
            color: '#fff',
            confirmButtonText: 'Registrar',
            confirmButtonColor: '#10b981',
            preConfirm: () => {
                const placa = document.getElementById('placa').value;
                const modelo = document.getElementById('modelo').value;
                if (!placa || !modelo) {
                    Swal.showValidationMessage('Por favor llena todos los campos');
                }
                return { placa, modelo };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setVehiculos([...vehiculos, { 
                    id: Date.now(), 
                    placa: result.value.placa.toUpperCase(), 
                    modelo: result.value.modelo, 
                    color: 'No especificado', 
                    status: 'Fuera' 
                }]);
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* CABECERA */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Mi <span className="text-emerald-500">Garage</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Gestión Personal de Unidades</p>
                </div>
                
                
                   
            </div>

            {/* STATS RÁPIDAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickStat 
                    icon={<Clock className="text-blue-400" />} 
                    label="Tiempo en Plantel (Mes)" 
                    value="124 hrs" 
                    sub="Promedio: 6.2 hrs/día"
                />
                <QuickStat 
                    icon={<ArrowLeftRight className="text-emerald-400" />} 
                    label="Último Movimiento" 
                    value="Entrada" 
                    sub="Hoy - 07:45 AM"
                />
                <QuickStat 
                    icon={<ShieldCheck className="text-purple-400" />} 
                    label="Estatus Global" 
                    value="Vigente" 
                    sub="Marbete 2026 Activo"
                />
            </div>

            {/* LISTA DE VEHÍCULOS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
                {vehiculos.map((v) => (
                    <div key={v.id} className="group relative bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] overflow-hidden backdrop-blur-sm hover:border-emerald-500/30 transition-all">
                        {/* Decoración de fondo */}
                        <Car size={180} className="absolute -right-10 -bottom-10 text-white/[0.02] group-hover:text-emerald-500/[0.03] transition-colors" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${v.status === 'En Plantel' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-white/10'}`}>
                                        {v.status}
                                    </span>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase mt-2">{v.modelo}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Placa</p>
                                    <p className="text-lg font-mono font-bold text-emerald-400 tracking-wider">{v.placa}</p>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Color</p>
                                    <p className="text-sm font-bold text-white uppercase">{v.color}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 italic ">Registrado: 12 Mar 2026</span>
                                </div>
                                <button className="text-[9px] font-black text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                                    <Trash2 size={14} /> Dar de Baja
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Card de "Añadir otro" estilo Minimalista */}
                <div 
                    onClick={handleAddVehiculo}
                    className="border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-emerald-500/20 transition-all hover:bg-emerald-500/[0.01]"
                >
                    <div className="p-4 bg-white/5 rounded-full text-slate-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                        <Plus size={32} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4 group-hover:text-slate-300">Registrar otra unidad</p>
                </div>
            </div>
        </div>
    );
};

// Sub-componente para las tarjetas de estadísticas
const QuickStat = ({ icon, label, value, sub }) => (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        </div>
        <div>
            <p className="text-3xl font-black text-white tracking-tighter italic uppercase">{value}</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{sub}</p>
        </div>
    </div>
);

export default MiVehiculo;