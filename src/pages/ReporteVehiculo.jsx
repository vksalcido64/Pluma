import React, { useState } from 'react';
import { Search, Car, AlertTriangle, User, Building, ShieldCheck, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ReporteVehiculo = () => {
    const [placa, setPlaca] = useState('');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    const buscarVehiculo = async (e) => {
        e.preventDefault();

        if (!placa.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Ingresa una placa',
                background: '#020617',
                color: '#fff'
            });
            return;
        }

        setLoading(true);
        setResultado(null);

        try {
            const res = await fetch(
                `https://yanelaplumz.com.mx/api_pluma/api.php?action=buscar_vehiculo&placa=${placa}`
            );
            const data = await res.json();

            if (data.success && data.data) {
                setResultado(data.data);
            } else {
                Swal.fire('No encontrado', 'Vehículo no registrado', 'warning');
            }

        } catch {
            Swal.fire('Error', 'Servidor no disponible', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 space-y-10">

            {/* HEADER PREMIUM */}
            <div className="relative bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-transparent"></div>

                <h2 className="text-4xl font-black text-white italic tracking-tight">
                    Reporte de <span className="text-red-500">Vehículo</span>
                </h2>

                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">
                    Consulta rápida por placa
                </p>
            </div>

            {/* BUSCADOR PRO */}
         <form onSubmit={buscarVehiculo} className="max-w-3xl">
    
    <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-[2rem] overflow-hidden focus-within:border-emerald-500/40 transition-all">

        {/* ICONO */}
        <div className="pl-6 pr-3 text-slate-600">
            <Search size={20}/>
        </div>

        {/* INPUT */}
        <input
            value={placa}
            onChange={(e)=>setPlaca(e.target.value.toUpperCase())}
            placeholder="Ej: ABC-123"
            className="flex-1 bg-transparent py-6 text-white text-lg font-black tracking-widest outline-none placeholder:text-slate-600"
        />

        {/* BOTÓN */}
        <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 font-black text-xs tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
            {loading ? <Loader2 className="animate-spin" size={16}/> : 'CONSULTAR'}
        </button>

    </div>

</form>

            {/* RESULTADO */}
            {resultado && (
                <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl animate-in fade-in zoom-in duration-300">

                    {/* HEADER RESULT */}
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-red-500/10 rounded-2xl text-red-500">
                                <Car size={32}/>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-white italic tracking-tight">
                                    {resultado.placa}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                                    Vehículo identificado
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-500/10 text-red-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                            Reporte activo
                        </div>
                    </div>

                    {/* GRID INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Info icon={<User/>} label="Nombre" value={resultado.nombre}/>
                        <Info icon={<ShieldCheck/>} label="Rol" value={resultado.rol}/>
                        <Info icon={<Building/>} label="Edificio" value={resultado.edificio || 'N/A'}/>
                        <Info icon={<Car/>} label="Modelo" value={resultado.modelo}/>
                        <Info icon={<Car/>} label="Color" value={resultado.color}/>
                        <Info icon={<Car/>} label="Ubicación" value={resultado.ubicacion || 'N/A'}/>

                    </div>

                    {/* ALERTA */}
                    <div className="mt-10 p-6 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent flex gap-4 items-center">
                        <AlertTriangle className="text-red-400"/>
                        <div>
                            <p className="text-red-400 font-black uppercase text-sm">
                                Atención
                            </p>
                            <p className="text-red-400/70 text-xs">
                                Vehículo marcado para revisión o incidencia.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

const Info = ({icon,label,value}) => (
    <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-500/20 transition">
        <div className="text-emerald-500">{icon}</div>
        <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-white font-black">{value}</p>
        </div>
    </div>
);

export default ReporteVehiculo;