import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react'; 
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Importación de imágenes desde la raíz de src
import LogoUtn from '../logo_utn.png'; 
import FondoUtn from '../fondo.png'; 

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({
    matricula: '',
    password: ''
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credenciales.matricula.trim() || !credenciales.password.trim()) {
        Swal.fire({
            icon: 'info',
            title: 'Campos incompletos',
            text: 'Por favor, ingresa tu matrícula y contraseña.',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#10b981'
        });
        return;
    }

    setCargando(true);
    try {
      const response = await fetch('https://yanelaplumz.com.mx/api_pluma/api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      const data = await response.json();

      if (data.success) {
        // Guardamos los datos necesarios en el storage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userMatricula', data.user.matricula);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userRole', data.user.role);

        // LÓGICA DE PRIMER INGRESO
        if (data.user.primer_ingreso === 1) {
          Swal.fire({
            icon: 'info',
            title: 'Seguridad Pluma',
            text: 'Has iniciado sesión con la contraseña temporal. Por favor, actualízala para continuar.',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#10b981',
            allowOutsideClick: false
          }).then(() => {
            // CRÍTICO: Actualizamos el estado de la App primero para que nos deje entrar
            onLogin(data.user); 
            // Luego navegamos a la pantalla de actualización
            navigate('/actualizar-password'); 
          });
        } else {
          // Si ya cambió su contraseña antes, entra directo al sistema
          onLogin(data.user);
        }
        
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Acceso Denegado',
          text: data.message || 'Credenciales inválidas.',
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
        text: 'No se pudo contactar con el servidor.',
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
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative font-sans"
      style={{ backgroundImage: `url(${FondoUtn})` }}
    >
      <div className="absolute inset-0 bg-slate-950/70 z-0"></div>

      <div className="w-full max-w-md bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-2xl z-10 relative">
        <div className="flex flex-col items-center mb-10">
          <img src={LogoUtn} alt="Logo UTN" className="w-24 h-auto mb-4 opacity-90" />
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">
            Pluma <span className="text-emerald-500">Inteligente</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Security System v2.0</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Matrícula Universitaria</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                name="matricula"
                type="text"
                value={credenciales.matricula}
                onChange={handleChange}
                placeholder="Ej. 21340219"
                disabled={cargando}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Contraseña de Acceso</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                name="password"
                type="password"
                value={credenciales.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={cargando}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 uppercase text-[10px] tracking-[0.2em] mt-4 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {cargando ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Ingresar al Plantel <ArrowRight size={18} /></>
            )}
          </button>
        </form>
        
        <div className="mt-10 text-center opacity-40">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em]">
              UTN Nogales • Pluma Management System
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;