import React, { useState } from 'react';
import { 
  X, User, Hash, Car, 
  Save, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';

const NuevoUsuarioModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    rol: 'user', // Ajustado a los ENUM de tu base de datos
    placas: '',
    modelo: '',
    anio: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=add_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: 'Usuario y vehículo vinculados al sistema.',
          icon: 'success',
          background: '#020617',
          color: '#fff',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-[2rem] border border-white/10'
          }
        });
        
        onRefresh(); 
        onClose();   
        setFormData({ nombre: '', matricula: '', rol: 'user', placas: '', modelo: '', anio: '' });
      } else {
        Swal.fire('Error', data.message || "No se pudo registrar", 'error');
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire('Error de red', 'No hay conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Nuevo <span className="text-emerald-500">Registro</span>
            </h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Sincronización de padrón vehicular</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          {/* SECCIÓN 1: IDENTIDAD */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datos de Identidad</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-emerald-500/50 uppercase ml-4 tracking-widest">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    required
                    value={formData.nombre}
                    className="w-full bg-black/40 border border-white/5 p-4 pl-14 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                    placeholder="Ej. Victor Alumno"
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-emerald-500/50 uppercase ml-4 tracking-widest">Matrícula Universitaria</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    required
                    value={formData.matricula}
                    className="w-full bg-black/40 border border-white/5 p-4 pl-14 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                    placeholder="21040000"
                    onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: VEHÍCULO */}
          <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Especificaciones de Unidad</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                required
                value={formData.placas}
                placeholder="Placas (Ej. XYZ-123-A)"
                className="bg-black/60 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 font-mono uppercase"
                onChange={(e) => setFormData({...formData, placas: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  placeholder="Modelo"
                  value={formData.modelo}
                  className="bg-black/60 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30"
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                />
                <input 
                  placeholder="Año"
                  value={formData.anio}
                  className="bg-black/60 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30"
                  onChange={(e) => setFormData({...formData, anio: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Acción */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                <span className="uppercase tracking-[0.2em] text-[10px]">Autorizar y Guardar</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default NuevoUsuarioModal;