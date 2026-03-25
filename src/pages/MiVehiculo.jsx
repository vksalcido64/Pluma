import React, { useState, useEffect, useCallback } from 'react';
import { 
  Car, Clock, ArrowLeftRight, Plus, 
  ShieldCheck, RefreshCcw, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

const MiVehiculo = () => {

    const [miMatricula] = useState(localStorage.getItem('userMatricula') || '');
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState({
        horasMes: '0 hrs',
        ultimoMov: '---',
        fechaMov: 'Sin registros',
        ubicacion: '---'
    });

    // 🔥 FETCH SEGURO
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

                setStats({
                    horasMes: data.horas || '0 hrs',
                    ubicacion: data.ubicacion || 'Fuera',
                    ultimoMov: data.ultimoMov || '---',
                    fechaMov: data.fechaMov || 'Sin registros'
                });
            } else {
                setVehiculos([]);
            }

        } catch (error) {
            console.error("Error:", error);
            setVehiculos([]);
        } finally {
            setLoading(false);
        }

    }, [miMatricula]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 🔥 AGREGAR VEHICULO
    const handleNuevoVehiculo = async () => {

        const { value: formValues } = await Swal.fire({
            title: 'Nuevo Vehículo',
            background: '#0f172a',
            color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            html: `
                <input id="placa" class="swal2-input" placeholder="Placa">
                <input id="modelo" class="swal2-input" placeholder="Modelo">
                <input id="color" class="swal2-input" placeholder="Color">
            `,
            preConfirm: () => {
                const placa = document.getElementById('placa').value;
                const modelo = document.getElementById('modelo').value;

                if (!placa || !modelo) {
                    Swal.showValidationMessage('Placa y modelo son obligatorios');
                }

                return {
                    placa: placa.toUpperCase(),
                    modelo,
                    color: document.getElementById('color').value
                };
            }
        });

        if (!formValues) return;

        try {
            const res = await fetch(
                'https://yanelaplumz.com.mx/api_pluma/api.php?action=add_vehiculo',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formValues,
                        id_dueno: miMatricula
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Vehículo agregado',
                    background: '#0f172a',
                    color: '#fff'
                });

                fetchData();
            } else {
                Swal.fire('Error', data.message, 'error');
            }

        } catch {
            Swal.fire('Error', 'No se pudo conectar', 'error');
        }
    };

    return (
        <div className="p-8 space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase italic">
                        Mis <span className="text-emerald-500">Vehículos</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">
                        Panel personal
                    </p>
                </div>

                <button 
                    onClick={fetchData}
                    className="p-4 bg-white/5 rounded-2xl text-emerald-500 hover:bg-emerald-500/10"
                >
                    {loading ? <Loader2 className="animate-spin"/> : <RefreshCcw size={20}/>}
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Stat icon={<Clock className="text-emerald-500"/>} label="Horas" value={stats.horasMes}/>
                <Stat icon={<ArrowLeftRight className="text-blue-500"/>} label="Movimiento" value={stats.ultimoMov}/>
                <Stat icon={<ShieldCheck className="text-purple-500"/>} label="Estado" value={stats.ubicacion}/>

            </div>

            {/* VEHICULOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {(vehiculos || []).map((v, i) => (

                    <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition">

                        <Car className="text-emerald-500 mb-3"/>

                        <h3 className="text-white font-bold text-lg">
                            {v.modelo}
                        </h3>

                        <p className="text-slate-400 text-sm">
                            {v.placa}
                        </p>

                        <p className="text-slate-500 text-xs">
                            {v.color || 'Sin color'}
                        </p>

                    </div>

                ))}

                {/* BOTON AGREGAR */}
                <div 
                    onClick={handleNuevoVehiculo}
                    className="border border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-500/5"
                >
                    <Plus className="text-emerald-500"/>
                </div>

            </div>
        </div>
    );
};

// COMPONENTE KPI
const Stat = ({ icon, label, value }) => (
    <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mb-2">{icon} <span className="text-xs text-slate-500">{label}</span></div>
        <p className="text-white text-xl font-bold">{value}</p>
    </div>
);

export default MiVehiculo;