import React, { useState } from 'react';
import { 
  X, User, Hash, Car, 
  Save, ShieldCheck, Info, Building
} from 'lucide-react';
import Swal from 'sweetalert2';

const NuevoUsuarioModal = ({ isOpen, onClose, onRefresh }) => {

  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    rol: 'Estudiante',
    edificio: '', // 🔥 NUEVO
    placas: '',
    modelo: '',
    anio: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.matricula || !formData.placas) {
      Swal.fire('Campos incompletos','','warning');
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

        // 🔥 RESET FORM
        setFormData({
          nombre: '',
          matricula: '',
          rol: 'Estudiante',
          edificio: '',
          placas: '',
          modelo: '',
          anio: ''
        });

        Swal.fire('Usuario creado','','success');

        onRefresh && onRefresh();
        onClose();
      }

    } catch {
      Swal.fire('Error de conexión','','error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nuevo Registro</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Usuario + Vehículo</p>
            </div>
          </div>

          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* DATOS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User size={14} className="text-emerald-500" />
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Datos</span>
            </div>

            <input
              placeholder="Nombre completo"
              value={formData.nombre}
              className="input"
              onChange={(e)=>setFormData({...formData,nombre:e.target.value})}
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Matrícula"
                value={formData.matricula}
                className="input"
                onChange={(e)=>setFormData({...formData,matricula:e.target.value})}
              />

              <select
                className="input"
                value={formData.rol}
                onChange={(e)=>setFormData({...formData,rol:e.target.value})}
              >
                <option>Estudiante</option>
                <option>Docente</option>
                <option>Administrativo</option>
                <option>Externo</option>
              </select>
            </div>

            {/* 🔥 EDIFICIO */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"/>
              <input
                placeholder="Carrera / Edificio"
                value={formData.edificio}
                className="input pl-10"
                onChange={(e)=>setFormData({...formData,edificio:e.target.value})}
              />
            </div>

          </div>

          {/* VEHICULO */}
          <div className="space-y-4 border-t border-white/5 pt-4">

            <input
              placeholder="Placas"
              value={formData.placas}
              className="input"
              onChange={(e)=>setFormData({...formData,placas:e.target.value.toUpperCase()})}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Modelo"
                value={formData.modelo}
                className="input"
                onChange={(e)=>setFormData({...formData,modelo:e.target.value})}
              />
              <input
                placeholder="Año / Color"
                value={formData.anio}
                className="input"
                onChange={(e)=>setFormData({...formData,anio:e.target.value})}
              />
            </div>

          </div>

          {/* BOTON */}
          <button
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl"
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NuevoUsuarioModal;