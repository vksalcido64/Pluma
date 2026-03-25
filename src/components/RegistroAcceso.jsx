import React, { useState } from 'react';
import { 
  Search, Car, ArrowRight, ArrowLeft, 
  UserPlus, Loader2 
} from 'lucide-react';
import Swal from 'sweetalert2';
import NuevoUsuarioModal from './NuevoUsuarioModal';

const RegistroAcceso = ({ onRegistroExitoso }) => {
  const [query, setQuery] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. BUSCAR USUARIO Y SUS VEHÍCULOS
  const buscarUsuario = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch(`https://yanelaplumz.com.mx/api_pluma/api.php?action=validar_acceso&id=${query}`);
      
      if (!response.ok) throw new Error('Error en el servidor');
      
      const data = await response.json();

      if (data.success) {
        setResultado(data);
      } else {
        Swal.fire({
          title: 'No encontrado',
          text: data.message || 'La matrícula no existe en el sistema',
          icon: 'error',
          background: '#020617',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'No se pudo conectar con el servidor.',
        icon: 'warning',
        background: '#020617',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. REGISTRAR ENTRADA O SALIDA
  const registrarMovimiento = async (placa, tipo) => {
    try {
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=registrar_movimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa, tipo })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: `¡${tipo} Exitosa!`,
          text: `Vehículo: ${placa}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#020617',
          color: '#fff'
        });
        
        // Limpiar para la siguiente búsqueda
        setResultado(null);
        setQuery('');
        
        // Avisar al padre (TerminalAcceso) para refrescar stats y monitor
        if (onRegistroExitoso) onRegistroExitoso();
      } else {
        Swal.fire({
          title: 'Acceso Denegado',
          text: data.message,
          icon: 'error',
          background: '#020617',
          color: '#fff'
        });
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SECCIÓN: BUSCADOR */}
      <form onSubmit={buscarUsuario} className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Ingresa Matrícula Alumno..."
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          className="w-full bg-slate-900/50 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-lg shadow-inner"
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>

      {/* SECCIÓN: RESULTADO DE BÚSQUEDA */}
      {resultado && (
        <div className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          
          {/* Info del Propietario */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Usuario Identificado</p>
              <h3 className="text-xl font-black text-white italic uppercase">{resultado.data.nombre}</h3>
              <span className="text-[10px] bg-white/10 text-slate-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest mt-2 inline-block">
                {resultado.data.rol}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-2xl border ${resultado.data.estatus === 'Activo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="text-[10px] font-black uppercase tracking-tighter text-center">Estatus</p>
              <p className="font-bold text-sm">{resultado.data.estatus}</p>
            </div>
          </div>

          {/* Listado Detallado de Vehículos */}
          <div className="p-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Vehículos Vinculados</p>
            
            <div className="grid gap-3">
              {resultado.data.vehiculos.map((vehiculo, index) => {
                const esElQueEntro = resultado.data.placaActiva === vehiculo.placa;
                const hayOtroAdentro = resultado.bloqueado && !esElQueEntro;

                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.07]">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${esElQueEntro ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="text-white text-lg font-black tracking-widest block leading-none">
                          {vehiculo.placa}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 inline-block">
                          {vehiculo.modelo} • {vehiculo.color}
                        </span>
                      </div>
                    </div>

                    <div>
                      {esElQueEntro ? (
                        /* Botón de Salida: Solo visible para el vehículo que está dentro */
                        <button 
                          onClick={() => registrarMovimiento(vehiculo.placa, 'Salida')}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                        >
                          Salida <ArrowLeft size={16}/>
                        </button>
                      ) : (
                        /* Botón de Entrada: Se bloquea si el usuario ya tiene otro carro adentro */
                        <button 
                          disabled={hayOtroAdentro}
                          onClick={() => registrarMovimiento(vehiculo.placa, 'Entrada')}
                          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${
                            hayOtroAdentro 
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                          }`}
                        >
                          {hayOtroAdentro ? 'Bloqueado' : 'Entrada'} <ArrowRight size={16}/>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN REGISTRO EXTERNOS */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        <UserPlus size={18} /> Registro de Invitado / Externo
      </button>

      <NuevoUsuarioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          if (onRegistroExitoso) onRegistroExitoso();
        }}
      />

    </div>
  );
};

export default RegistroAcceso;