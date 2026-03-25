import React, { useState, useEffect, useCallback } from 'react';
import { 
  Car, Clock, ArrowLeftRight, Plus, 
  ShieldCheck, Calendar, RefreshCcw, Loader2, Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';

const MiVehiculo = () => {
    // Obtenemos la matrícula real del localStorage
    const [miMatricula] = useState(localStorage.getItem('userMatricula') || ''); 
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        horasMes: '0 hrs', // Mantenemos el diseño de horas
        ultimoMov: '---',
        fechaMov: 'Sin registros',
        ubicacion: '---'
    });

    const fetchData = useCallback(async () => {
        if (!miMatricula) return;
        setLoading(true);
        try {
            const res = await fetch(`https://yanelaplumz.com.mx/api_pluma/api.php?action=get_mis_vehiculos&id=${miMatricula}`);
            const data = await res.json();

            if (data.success) {
                setVehiculos(data.data || []);
                setStats({
                    horasMes: data.horas || '0 hrs', // Vinculado a la API
                    ubicacion: data.ubicacion || 'Fuera',
                    ultimoMov: data.ultimoMov || '---',
                    fechaMov: data.fechaMov || 'Sin registros'
                });
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    }, [miMatricula]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNuevoVehiculo = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Vincular Nuevo Vehículo',
            background: '#0f172a',
            color: '#fff',
            html: `
                <div class="space-y-3">
                    <input id="swal-placa" class="swal2-input !w-full !m-0 !mb-3" placeholder="Placa (ej: ABC-123)" style="background:#020617; color:white; border:1px solid #1e293b">
                    <input id="swal-modelo" class="swal2-input !w-full !m-0 !mb-3" placeholder="Modelo (ej: Nissan Sentra)" style="background:#020617; color:white; border:1px solid #1e293b">
                    <input id="swal-color" class="swal2-input !w-full !m-0" placeholder="Color del vehículo" style="background:#020617; color:white; border:1px solid #1e293b">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar Unidad',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            preConfirm: () => {
                const placa = document.getElementById('swal-placa').value;
                const modelo = document.getElementById('swal-modelo').value;
                if (!placa || !modelo) {
                    Swal.showValidationMessage('Placa y Modelo son obligatorios');
                }
                return {
                    placa: placa.toUpperCase(),
                    modelo: modelo,
                    color: document.getElementById('swal-color').value
                }
            }
        });

        if (formValues) {
            try {
                const res = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=add_vehiculo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formValues,
                        id_dueno: miMatricula
                    })
                });
                const data = await res.json();
                if (data.success) {
                    Swal.fire({ icon: 'success', title: 'Vehículo Registrado', background: '#0f172a', color: '#fff' });
                    fetchData();
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: data.message });
                }
            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Error de servidor' });
            }
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Mis <span className="text-emerald-500">Vehículos</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Panel de control personal</p>
                </div>
                <button 
                    onClick={fetchData}
                    className="p-4 bg-white/5 rounded-2xl text-emerald-500 hover:bg-emerald-500/10 transition-all border border-white/5"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={20} />}
                </button>
            </div>

            {/* KPIS - Respetando el diseño de Horas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickStat 
                    icon={<Clock size={20} className="text-emerald-500" />} 
                    label="Horas en el Plantel" 
                    value={stats.horasMes} 
                    sub="Tiempo acumulado este mes"
                />
                <QuickStat 
                    icon={<ArrowLeftRight size={20} className="text-blue-500" />} 
                    label="Último Movimiento" 
                    value={stats.ultimoMov} 
                    sub={stats.fechaMov}
                />
                <QuickStat 
                    icon={<ShieldCheck size={20} className="text-purple-500" />} 
                    label="Estado de Acceso" 
                    value={stats.ubicacion} 
                    sub="Ubicación actual en sistema"
                />
            </div>

            {/* CARDS DE VEHÍCULOS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {vehiculos.map((v, i) => (
                    <div key={i} className="bg-slate-900/60 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <Car size={24} />
                                </div>
                                {/* DISEÑO DE PLACA MANTENIDO */}
                                <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full text-slate-400 uppercase tracking-widest border border-white/5">
                                    {v.placa}
                                </span>
                            </div>
                            
                            {/* DISEÑO DE MODELO MANTENIDO (Cursiva y Blanco) */}
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
                                {v.modelo}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {v.color || 'Color no especificado'}
                            </p>
                        </div>

                        {/* Decoración de fondo */}
                        <div className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors">
                            <Car size={160} />
                        </div>
                    </div>
                ))}

                {/* BOTÓN AGREGAR */}
                <div 
                    onClick={handleNuevoVehiculo}
                    className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group min-h-[220px]"
                >
                    <div className="p-5 bg-white/5 rounded-full text-slate-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 group-hover:rotate-90 transition-all duration-500">
                        <Plus size={40} /> 
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-6 group-hover:text-emerald-500">Vincular Nueva Placa</p>
                </div>
            </div>
        </div>
    );
};

// Componente para los KPIs superiores
const QuickStat = ({ icon, label, value, sub }) => (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm group hover:bg-slate-900/50 transition-colors">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        </div>
        <div>
            <p className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">{value}</p>
            {sub && <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-tighter">{sub}</p>}
        </div>
    </div>
);

export default MiVehiculo;