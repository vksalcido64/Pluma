import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  Calendar,
  Building,
  Ticket,
  ClipboardCheck,
  Clock3,
  LogOut,
  RefreshCcw
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'https://yanelaplumz.com.mx/api_pluma/apiVisitas.php';

const RegistroVisitas = () => {
  const [visita, setVisita] = useState({
    nombre: '',
    documento: '',
    empresa: '',
    fecha: '',
    motivo: ''
  });

  const [visitasActivas, setVisitasActivas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    cargarVisitasActivas();

    const intervaloVisitas = setInterval(() => {
      cargarVisitasActivas(false);
    }, 15000);

    const intervaloReloj = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervaloVisitas);
      clearInterval(intervaloReloj);
    };
  }, []);

  const handleChange = (e) => {
    setVisita({ ...visita, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setVisita({
      nombre: '',
      documento: '',
      empresa: '',
      fecha: '',
      motivo: ''
    });
  };

  const cargarVisitasActivas = async (mostrarError = true) => {
    try {
      const response = await fetch(`${API_URL}?action=get_visitas_activas`);
      const data = await response.json();

      if (data.success) {
        setVisitasActivas(data.data || []);
        setTick(0);
      } else if (mostrarError) {
        Swal.fire({
          title: 'Error',
          text: data.message || 'No se pudieron cargar las visitas activas',
          icon: 'error',
          background: '#064e3b',
          color: '#ecfdf5',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      if (mostrarError) {
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          background: '#064e3b',
          color: '#ecfdf5',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };

  const registrarVisita = async (e) => {
    e.preventDefault();

    if (!visita.nombre.trim() || !visita.documento.trim() || !visita.fecha.trim()) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Nombre, documento y fecha son obligatorios',
        icon: 'warning',
        background: '#064e3b',
        color: '#ecfdf5',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?action=registrar_visita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visita)
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Visita registrada',
          html: `
            <div style="padding:12px;background:#ecfdf5;border-radius:12px;color:#064e3b;">
              <div style="font-size:14px;margin-bottom:8px;">Token generado</div>
              <div style="font-size:28px;font-weight:900;letter-spacing:2px;">${data.token}</div>
            </div>
          `,
          icon: 'success',
          background: '#064e3b',
          color: '#ecfdf5',
          confirmButtonColor: '#10b981'
        });

        limpiarFormulario();
        cargarVisitasActivas(false);
      } else {
        Swal.fire({
          title: 'No se pudo registrar',
          text: data.message || 'Error al registrar la visita',
          icon: 'error',
          background: '#064e3b',
          color: '#ecfdf5',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        icon: 'error',
        background: '#064e3b',
        color: '#ecfdf5',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setLoading(false);
    }
  };

  const registrarSalida = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Registrar salida?',
      text: 'Se marcará la salida del visitante',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
      background: '#064e3b',
      color: '#ecfdf5',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}?action=registrar_salida_visita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Salida registrada',
          text: data.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#064e3b',
          color: '#ecfdf5'
        });

        cargarVisitasActivas(false);
      } else {
        Swal.fire({
          title: 'Error',
          text: data.message || 'No se pudo registrar la salida',
          icon: 'error',
          background: '#064e3b',
          color: '#ecfdf5',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        icon: 'error',
        background: '#064e3b',
        color: '#ecfdf5',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const formatearTiempo = (segundosIniciales = 0) => {
    const total = Number(segundosIniciales || 0) + tick;

    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in duration-500 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
            <Ticket className="text-emerald-400 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-2">Control de Visitas</h3>
            <p className="text-emerald-400/70 text-sm leading-relaxed">
              El sistema registra entrada, salida y tiempo dentro del plantel.
              <br /><br />
              También bloquea registros repetidos del mismo visitante.
            </p>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-800 p-6 rounded-3xl flex items-center gap-4 text-emerald-300">
            <Clock3 size={30} />
            <span className="text-xs font-bold uppercase tracking-tighter">
              Contador en tiempo real
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-emerald-900/40 backdrop-blur-sm border border-emerald-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <UserPlus className="text-emerald-400" /> Datos del Visitante
          </h2>

          <form onSubmit={registrarVisita} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Nombre Completo
                </label>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={visita.nombre}
                  className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Documento / Identificación
                </label>
                <input
                  name="documento"
                  type="text"
                  placeholder="INE / Pasaporte / ID"
                  value={visita.documento}
                  className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  onChange={(e) => setVisita({ ...visita, documento: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Empresa / Procedencia
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3.5 text-emerald-600" size={18} />
                  <input
                    name="empresa"
                    type="text"
                    placeholder="Particular, proveedor, etc."
                    value={visita.empresa}
                    className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Fecha de Visita
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-emerald-600" size={18} />
                  <input
                    name="fecha"
                    type="date"
                    min={hoy}
                    value={visita.fecha}
                    className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                Motivo de la Visita
              </label>
              <textarea
                name="motivo"
                rows="3"
                placeholder="Describa brevemente el motivo..."
                value={visita.motivo}
                className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-emerald-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <ClipboardCheck size={20} />
              {loading ? 'Registrando visita...' : 'Registrar visita'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Clock3 className="text-emerald-400" /> Visitantes dentro del plantel
          </h3>

          <button
            onClick={() => cargarVisitasActivas()}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-600 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all"
          >
            <RefreshCcw size={18} />
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                <th className="px-4 pb-2">Nombre</th>
                <th className="px-4 pb-2">Documento</th>
                <th className="px-4 pb-2">Empresa</th>
                <th className="px-4 pb-2">Entrada</th>
                <th className="px-4 pb-2">Tiempo dentro</th>
                <th className="px-4 pb-2">Motivo</th>
                <th className="px-4 pb-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visitasActivas.length > 0 ? (
                visitasActivas.map((item) => (
                  <tr key={item.id} className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors">
                    <td className="px-4 py-4 rounded-l-2xl text-white font-bold">{item.nombre}</td>
                    <td className="px-4 py-4 text-emerald-200 font-mono">{item.documento}</td>
                    <td className="px-4 py-4 text-slate-300">{item.empresa || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-300">{item.hora_entrada}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-2 rounded-xl font-black tracking-wider">
                        <Clock3 size={16} />
                        {formatearTiempo(item.segundos_dentro)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300 max-w-[240px] truncate">{item.motivo || 'Sin motivo'}</td>
                    <td className="px-4 py-4 rounded-r-2xl text-right">
                      <button
                        onClick={() => registrarSalida(item.id)}
                        className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase inline-flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Registrar salida
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-emerald-200/60 font-bold">
                    No hay visitantes activos en este momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistroVisitas;