import React, { useState } from 'react';
import { 
  X, User, Hash, Car, 
  Save, ShieldCheck, Info
} from 'lucide-react';
import Swal from 'sweetalert2';

const NuevoUsuarioModal = ({ isOpen, onClose, onRefresh }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    rol: 'Estudiante', // Valor por defecto
    placas: '',
    modelo: '',
    anio: ''
  });

  const [loading, setLoading] = useState(false);

  // Cerrar si el modal no está abierto
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica antes de enviar
    if (!formData.nombre || !formData.matricula || !formData.placas) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Nombre, Matrícula y Placas son obligatorios.',
        icon: 'warning',
        background: '#020617',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setLoading(true);

    try {
      // Enviamos TODO al case 'add_usuario' de tu api.php
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=add_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: data.message || 'Usuario y vehículo vinculados al sistema.',
          icon: 'success',
          background: '#020617',
          color: '#fff',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-[2rem] border border-white/10'
          }
        });
        
        // Limpiar formulario y refrescar lista
        setFormData({ nombre: '', matricula: '', rol: 'Estudiante', placas: '', modelo: '', anio: '' });
        if (onRefresh) onRefresh(); 
        onClose();
      } else {
        throw new Error(data.message || 'Error al procesar el registro');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de Sistema',
        text: error.message,
        icon: 'error',
        background: '#020617',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop con desenfoque */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nuevo Registro</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alta de Usuario y Vehículo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* SECCIÓN: DATOS PERSONALES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Información Personal</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                  <Info size={18} />
                </div>
                <input 
                  required
                  placeholder="Nombre Completo"
                  value={formData.nombre}
                  className="w-full bg-white/[0.03] border border-white/5 p-4 pl-12 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                    <Hash size={18} />
                  </div>
                  <input 
                    required
                    placeholder="Matrícula"
                    value={formData.matricula}
                    className="w-full bg-white/[0.03] border border-white/5 p-4 pl-12 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all"
                    onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                  />
                </div>
                
                <select 
                  className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 appearance-none cursor-pointer"
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                >
                  <option value="Estudiante" className="bg-slate-900">Estudiante</option>
                  <option value="Docente" className="bg-slate-900">Docente</option>
                  <option value="Administrativo" className="bg-slate-900">Administrativo</option>
                  <option value="Externo" className="bg-slate-900">Externo / Invitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN: VEHÍCULO */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Car size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vincular Vehículo</span>
            </div>

            <div className="space-y-4">
              <input 
                required
                placeholder="Placas (Ej: ABC-123-A)"
                value={formData.placas}
                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all"
                onChange={(e) => setFormData({...formData, placas: e.target.value.toUpperCase()})}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Modelo (Ej: Nissan Sentra)"
                  value={formData.modelo}
                  className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30"
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                />
                <input 
                  placeholder="Año / Color"
                  value={formData.anio}
                  className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30"
                  onChange={(e) => setFormData({...formData, anio: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-700 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl shadow-emerald-500/10 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="uppercase tracking-[0.2em] text-[11px]">Finalizar Registro</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="p-4 bg-white/[0.01] text-center border-t border-white/5">
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Pluma Access Control System v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default NuevoUsuarioModal;