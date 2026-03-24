import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  User, Hash, MapPin, 
  Car, UserPlus, 
  ShieldCheck 
} from 'lucide-react';

const RegistroAcceso = () => {
    // ESTADOS PARA LOS CAMPOS
    const [identificador, setIdentificador] = useState(''); // Puede ser ID o Nombre
    const [placas, setPlacas] = useState('');
    const [puntoAcceso, setPuntoAcceso] = useState('Entrada Principal');
    const [tipoRegistro, setTipoRegistro] = useState('conocido');

    const handleProcesar = async (e) => {
        e.preventDefault();

        // Preparamos los datos para la API
        // Si es conocido, mandamos el ID como "placa" (o lo que tu tabla espere)
        // Si es nuevo, mandamos las placas reales
        const datosMovimiento = {
            placa: tipoRegistro === 'conocido' ? identificador : placas,
            tipo: 'Entrada' // Aquí puedes dinamizar si es Entrada o Salida después
        };

        try {
            const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=registrar_movimiento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosMovimiento)
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    title: 'Acceso Registrado',
                    text: `La placa/ID ${datosMovimiento.placa} ha sido autorizada`,
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#10b981'
                });
                // Limpiamos los campos
                setIdentificador('');
                setPlacas('');
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            Swal.fire({
                title: 'Error de Sistema',
                text: 'No se pudo conectar con IONOS: ' + error.message,
                icon: 'error',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5">
                <button 
                    onClick={() => setTipoRegistro('conocido')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipoRegistro === 'conocido' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <User size={14}/> Conocido
                </button>
                <button 
                    onClick={() => setTipoRegistro('nuevo')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipoRegistro === 'nuevo' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <UserPlus size={14}/> Nuevo / Visita
                </button>
            </div>

            <form onSubmit={handleProcesar} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        {tipoRegistro === 'conocido' ? 'Número de Control / ID' : 'Nombre del Visitante'}
                    </label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors">
                            {tipoRegistro === 'conocido' ? <Hash size={18}/> : <User size={18}/>}
                        </div>
                        <input 
                            type="text"
                            value={identificador}
                            onChange={(e) => setIdentificador(e.target.value)}
                            required
                            placeholder={tipoRegistro === 'conocido' ? "Ej. 21040123" : "Nombre completo"}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                </div>

                {tipoRegistro === 'nuevo' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Placas del Vehículo</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50">
                                <Car size={18}/>
                            </div>
                            <input 
                                type="text"
                                value={placas}
                                onChange={(e) => setPlacas(e.target.value)}
                                required={tipoRegistro === 'nuevo'}
                                placeholder="ABC-123-A"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Punto de Entrada</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50">
                            <MapPin size={18}/>
                        </div>
                        <select 
                            value={puntoAcceso}
                            onChange={(e) => setPuntoAcceso(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 appearance-none cursor-pointer"
                        >
                            <option value="Entrada Principal">Entrada Principal</option>
                            <option value="Estacionamiento Norte">Estacionamiento Norte</option>
                            <option value="Área de Carga">Área de Carga</option>
                        </select>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 mt-4 uppercase text-xs tracking-[0.2em]"
                >
                    <ShieldCheck size={20} />
                    Procesar Acceso
                </button>
            </form>

            <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tighter">
                Sistema conectado a IONOS Cloud Engine
            </p>
        </div>
    );
};

export default RegistroAcceso;