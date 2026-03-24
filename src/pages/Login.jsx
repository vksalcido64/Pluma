import React, { useState } from 'react';
import { User, ArrowRight, Loader2 } from 'lucide-react'; // Agregué Loader2 para el efecto de carga
import Swal from 'sweetalert2';
import LogoUtn from '../logo_utn.png'; 
import FondoUtn from '../fondo.png'; 

const Login = ({ onLogin }) => {
  const [userInput, setUserInput] = useState('');
  const [cargando, setCargando] = useState(false); // Nuevo estado para feedback visual

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si el campo está vacío, no hacemos nada
    if (!userInput.trim()) return;

    setCargando(true);

    try {
      // --- CAMBIA 'tu-dominio.com' POR TU DOMINIO REAL ---
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: userInput }),
      });

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) throw new Error('Error en el servidor');

      const data = await response.json();

      if (data.success) {
        // Si el PIN existe en MariaDB, entramos
        onLogin(data.user);
      } else {
        // Si el PIN no existe (Mensaje de la API)
        Swal.fire({
          icon: 'warning',
          title: 'Acceso Denegado',
          text: data.message || 'El PIN ingresado no es válido.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error("Error conectando a la API:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo contactar con el servidor de IONOS.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${FondoUtn})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60 z-0"></div>

      <div className="w-full max-w-md bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl z-10 relative">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-2 flex justify-center">
            <img 
              src={LogoUtn} 
              alt="Logo UTN" 
              className="w-28 h-auto object-contain" 
            />
          </div>

          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">
            Pluma <span className="text-emerald-500">Inteligente UTN</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Acceso al Sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ID de Usuario (PIN)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={cargando ? "Validando..." : "Ingresa tu PIN"}
                disabled={cargando}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 uppercase text-xs tracking-[0.2em] disabled:bg-slate-700 disabled:text-slate-400"
          >
            {cargando ? (
              <>Validando <Loader2 size={18} className="animate-spin" /></>
            ) : (
              <>Entrar <ArrowRight size={18} /></>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
              Powered by IONOS Cloud & MariaDB 10
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;