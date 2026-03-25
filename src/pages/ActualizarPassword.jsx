import React, { useState } from 'react';
import { Lock, ShieldCheck, Save, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import LogoUtn from '../logo_utn.png';
import FondoUtn from '../fondo.png';

const ActualizarPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    nueva: '',
    confirmar: ''
  });
  const [cargando, setCargando] = useState(false);

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (passwords.nueva.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Contraseña corta',
        text: 'La contraseña debe tener al menos 6 caracteres.',
        background: '#0f172a', color: '#fff', confirmButtonColor: '#10b981'
      });
    }

    if (passwords.nueva !== passwords.confirmar) {
      return Swal.fire({
        icon: 'error',
        title: 'No coinciden',
        text: 'Las contraseñas ingresadas no son iguales.',
        background: '#0f172a', color: '#fff', confirmButtonColor: '#ef4444'
      });
    }

    setCargando(true);

    try {
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=update_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          password: passwords.nueva
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Tu contraseña ha sido cambiada. Por favor, inicia sesión de nuevo.',
          background: '#0f172a', color: '#fff', confirmButtonColor: '#10b981'
        }).then(() => {
          localStorage.clear(); // Limpiamos todo para forzar re-login
          navigate('/login');
          window.location.reload(); // Asegura que el estado de la app se limpie
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña.',
        background: '#0f172a', color: '#fff'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${FondoUtn})` }}
    >
      <div className="absolute inset-0 bg-slate-950/80 z-0"></div>

      <div className="w-full max-w-md bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-2xl z-10 relative">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-emerald-500 mb-4" size={48} />
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">
            Actualizar <span className="text-emerald-500">Seguridad</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 text-center px-4">
            Debes cambiar tu contraseña temporal para proteger tu cuenta.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nueva Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                name="nueva"
                type="password"
                required
                value={passwords.nueva}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Confirmar Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                name="confirmar"
                type="password"
                required
                value={passwords.confirmar}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
          >
            {cargando ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Guardar Nueva Contraseña <Save size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarPassword;