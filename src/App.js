import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, UserCog, FileBarChart, 
  Car, UserPlus, LogOut, ShieldCheck, 
  Unlock, Zap, Search // Se añadió Search para el icono del buscador
} from 'lucide-react';

// --- IMÁGENES EN LA RAÍZ DE SRC ---
import LogoUtn from './logo_utn.png'; 
import FondoUtn from './fondo.png'; 

// Tus páginas
import TerminalAcceso from './pages/TerminalAcceso';
import GestionUsuarios from './pages/GestionUsuarios';
import Reportes from './pages/Reportes';
import MiVehiculo from './pages/MiVehiculo';
import RegistroVisitas from './pages/RegistroVisitas';
import Login from './pages/Login';
import ActualizarPassword from './pages/ActualizarPassword';
import ReporteVehiculo from './pages/ReporteVehiculo'; // 1. IMPORTACIÓN DE LA NUEVA PÁGINA

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [mostrandoAnimacion, setMostrandoAnimacion] = useState(false);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    if (userData.primer_ingreso !== 1) {
      setMostrandoAnimacion(true);
      setTimeout(() => setMostrandoAnimacion(false), 2500);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login onLogin={login} />} />
        </Routes>
      </Router>
    );
  }

  if (user.primer_ingreso === 1) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<ActualizarPassword />} />
        </Routes>
      </Router>
    );
  }

  if (mostrandoAnimacion) {
    return <AnimacionPluma user={user} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col p-8 sticky top-0 h-screen z-20">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-slate-900" size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic text-white">
              Pluma <span className="text-emerald-500 italic">Inteligente</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem to="/vehiculo" icon={<Car size={20}/>} label="Mi Vehículo" />
            
            {user.role === 'admin' && (
              <>
                <div className="pt-6 pb-2 px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Administración</div>
                <NavItem to="/terminal" icon={<LayoutDashboard size={20}/>} label="Terminal" />
                <NavItem to="/usuarios" icon={<UserCog size={20}/>} label="Usuarios" />
                <NavItem to="/reportes" icon={<FileBarChart size={20}/>} label="Reportes" />
                <NavItem to="/visitas" icon={<UserPlus size={20}/>} label="Visitas" />
                {/* 2. NAVITEM PARA EL BUSCADOR DE VEHÍCULOS */}
                <NavItem to="/reporte-vehiculo" icon={<Search size={20}/>} label="Buscador" />
              </>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-4 text-white">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[11px] font-black text-emerald-500">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                    <p className="text-[10px] font-black uppercase truncate">{user.name}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</p>
                </div>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 transition-all font-bold text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-red-400/5 rounded-2xl"
            >
              <LogOut size={16}/> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* --- CONTENIDO --- */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/vehiculo" element={<MiVehiculo />} />
              {user.role === 'admin' ? (
                <>
                  <Route path="/terminal" element={<TerminalAcceso />} />
                  <Route path="/usuarios" element={<GestionUsuarios />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/visitas" element={<RegistroVisitas />} />
                  {/* 3. RUTA PARA LA NUEVA PÁGINA */}
                  <Route path="/reporte-vehiculo" element={<ReporteVehiculo />} />
                  <Route path="/" element={<Navigate to="/terminal" />} />
                </>
              ) : (
                <Route path="/" element={<Navigate to="/vehiculo" />} />
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

// Sub-componentes
const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all
      ${isActive 
        ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    {icon} {label}
  </NavLink>
);

const AnimacionPluma = ({ user }) => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 animate-in fade-in duration-500 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      <div className="relative z-10 flex flex-col items-center bg-slate-900/40 border border-white/5 p-12 rounded-[4rem] backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-3xl mb-4 border border-emerald-500/20">
            <Unlock size={28} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            Acceso <span className="text-emerald-500">Concedido</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">
            Bienvenido, {user.name}
          </p>
        </div>
        <div className="relative w-[240px] h-[120px] flex items-end justify-center">
          <div className="w-14 h-20 bg-slate-800 rounded-t-2xl border border-white/10 z-10 relative">
             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center">
                <Zap size={12} className="text-emerald-500 fill-emerald-500" />
             </div>
          </div>
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[240px] h-3 bg-white rounded-full origin-right rotate-0 animate-abrirPluma z-20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <div className="flex w-full h-full overflow-hidden rounded-full">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-red-500' : 'bg-white'}`}></div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
);

export default App;