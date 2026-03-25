import React, { useState } from 'react';
import { 
  X, User, Hash, Car, 
  Save, ShieldCheck, Info, Building,
  Zap, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const NuevoUsuarioModal = ({ isOpen, onClose, onRefresh }) => {

  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    rol: 'Estudiante',
    edificio: '', 
    placas: '',
    modelo: '',
    anio: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=add_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: '¡REGISTRO EXITOSO!',
          text: 'Usuario y vehículo vinculados correctamente.',
          icon: 'success',
          background: '#020617',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
        
        setFormData({
          nombre: '',
          matricula: '',
          rol: 'Estudiante',
          edificio: '',
          placas: '',
          modelo: '',
          anio: ''
        });
        onRefresh();
        onClose();
      } else {
        Swal.fire('Error', data.message || 'No se pudo registrar', 'error');
      }
    } catch (error) {
      Swal.fire('Error de red', 'No hay conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-slate-950/80 animate-in fade-in duration-300">
      
      {/* Contenedor Principal Estilo Glassmorphism */}
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"></div>

        {/* Header */}
        <div className="p-10 pb-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                Nuevo <span className="text-emerald-500">Registro</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">
                Vinculación de usuario y unidad
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-500 hover:text-white transition-all bg-white/5 hover:bg-red-500/10 rounded-2xl border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 custom-scrollbar">
          
          {/* SECCIÓN: DATOS PERSONALES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <User size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Información Personal</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Nombre Completo"
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 font-bold"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Matrícula / ID"
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 font-bold"
                  value={formData.matricula}
                  onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all font-bold appearance-none cursor-pointer"
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
              >
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Externo">Externo</option>
              </select>

              <div className="relative group">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Edificio / Área"
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 font-bold"
                  value={formData.edificio}
                  onChange={(e) => setFormData({...formData, edificio: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN: VEHÍCULO */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 px-2">
              <Car size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Detalles de la Unidad</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="PLACA"
                  className="w-full bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 text-sm font-black outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900/30 text-center uppercase"
                  value={formData.placas}
                  onChange={(e) => setFormData({...formData, placas: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Modelo / Marca"
                  className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 font-bold"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Año / Color"
                  className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 font-bold"
                  value={formData.anio}
                  onChange={(e) => setFormData({...formData, anio: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/10 group relative overflow-hidden"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Save size={18} className="relative z-10" />
                  <span className="relative z-10 uppercase tracking-[0.2em] text-[11px]">Finalizar Registro</span>
                  <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="p-6 bg-white/[0.02] text-center border-t border-white/5 flex items-center justify-center gap-3">
          <Info size={12} className="text-emerald-500/50" />
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            Asegúrate de que la placa coincida con el registro físico
          </p>
        </div>
      </div>
    </div>
  );
};

export default NuevoUsuarioModal;