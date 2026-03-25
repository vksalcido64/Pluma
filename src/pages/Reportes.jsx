import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Car,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  Clock,
  Filter,
  BarChart3,
  TrendingUp,
  RefreshCcw,
  X,
  User
} from 'lucide-react';

const API_URL = 'https://yanelaplumz.com.mx/api_pluma/apiReportes.php';

const Reportes = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [movimientos, setMovimientos] = useState([]);
  const [detalleRegistros, setDetalleRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horaPico, setHoraPico] = useState('Sin registros');
  const [tick, setTick] = useState(0);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  const [stats, setStats] = useState({
    entradas: 0,
    salidas: 0,
    dentro: 0,
    denegados: 0,
    eficiencia: '0%',
    vehiculos_dentro: 0,
    visitas_dentro: 0,
    entradas_vehiculos: 0,
    salidas_vehiculos: 0,
    entradas_visitas: 0,
    salidas_visitas: 0
  });

  const formatearTiempo = (segundosIniciales = 0, estado = 'Fuera') => {
    const base = Number(segundosIniciales || 0);
    const total = estado === 'Dentro' ? base + tick : base;

    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const formatearHora = (fecha) => {
    if (!fecha) return '---';

    const d = new Date(String(fecha).replace(' ', 'T'));
    if (isNaN(d.getTime())) return fecha;

    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const abrirDetalle = (item) => {
    if (!item) return;

    if (item.propietario) {
      setRegistroSeleccionado(item.propietario);
      return;
    }

    if (item.tipo_registro === 'visita') {
      setRegistroSeleccionado({
        tipo_registro: 'visita',
        nombre: item.nombre || item.placa || 'Sin nombre',
        documento: item.identificador || item.documento || 'Sin documento',
        empresa: item.empresa || 'No disponible',
        motivo: item.motivo || 'No disponible',
        estado: item.estado || 'No disponible',
        token: item.token || 'No disponible'
      });
      return;
    }

    setRegistroSeleccionado({
      tipo_registro: item.tipo_registro || 'vehiculo',
      placa: item.placa || 'Sin placa'
    });
  };

  const cerrarDetalle = () => {
    setRegistroSeleccionado(null);
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}?action=get_reporte_detallado&fecha=${fechaSeleccionada}`);
      const data = await res.json();

      if (data.success) {
        const logs = data.logs || [];
        const detalle = data.detalle || [];
        const s = data.stats || {};

        setMovimientos(logs);
        setDetalleRegistros(detalle);
        setTick(0);

        const entradas = Number(s.entradas || 0);
        const salidas = Number(s.salidas || 0);
        const denegados = Number(s.denegados || 0);
        const dentro = Number(s.dentro || 0);
        const totalIntentos = entradas + denegados;

        if (logs.length > 0) {
          const conteoHoras = {};

          logs.forEach((mov) => {
            const d = new Date(String(mov.fecha || '').replace(' ', 'T'));
            if (!isNaN(d.getTime())) {
              const hora = d.getHours();
              conteoHoras[hora] = (conteoHoras[hora] || 0) + 1;
            }
          });

          const horas = Object.keys(conteoHoras);

          if (horas.length > 0) {
            const horaMasAlta = horas.reduce((a, b) =>
              conteoHoras[a] > conteoHoras[b] ? a : b
            );

            const h = parseInt(horaMasAlta, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            const nextRaw = (h + 1) % 24;
            const nextH = nextRaw % 12 || 12;
            const nextAmpm = nextRaw >= 12 ? 'PM' : 'AM';

            setHoraPico(`${displayH}:00 ${ampm} - ${nextH}:00 ${nextAmpm}`);
          } else {
            setHoraPico('Sin tráfico');
          }
        } else {
          setHoraPico('Sin tráfico');
        }

        setStats({
          entradas,
          salidas,
          dentro,
          denegados,
          eficiencia: totalIntentos > 0 ? `${((entradas / totalIntentos) * 100).toFixed(1)}%` : '100%',
          vehiculos_dentro: Number(s.vehiculos_dentro || 0),
          visitas_dentro: Number(s.visitas_dentro || 0),
          entradas_vehiculos: Number(s.entradas_vehiculos || 0),
          salidas_vehiculos: Number(s.salidas_vehiculos || 0),
          entradas_visitas: Number(s.entradas_visitas || 0),
          salidas_visitas: Number(s.salidas_visitas || 0)
        });
      } else {
        setMovimientos([]);
        setDetalleRegistros([]);
      }
    } catch (error) {
      console.error('Error cargando reporte:', error);
      setMovimientos([]);
      setDetalleRegistros([]);
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`transition-all duration-300 ${registroSeleccionado ? 'xl:pr-[23rem]' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Análisis <span className="text-emerald-500 text-3xl">de Tráfico</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 italic">
              Auditoría de Acceso Vehicular y Visitas
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 rounded-2xl border border-white/5">
              <Calendar size={16} className="text-emerald-500" />
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest"
              />
            </div>

            <button
              type="button"
              onClick={fetchReportData}
              className={`p-3 rounded-2xl bg-white/5 text-emerald-500 hover:bg-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard label="Total Entradas" value={stats.entradas} icon={<ArrowUpRight size={20} />} color="emerald" />
            <MetricCard label="Total Salidas" value={stats.salidas} icon={<ArrowDownLeft size={20} />} color="blue" />
            <MetricCard label="En Plantel" value={stats.dentro} icon={<Car size={20} />} color="purple" />
            <MetricCard label="Denegados" value={stats.denegados} icon={<ShieldAlert size={20} />} color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <SmallStatCard title="Vehículos dentro" value={stats.vehiculos_dentro} />
            <SmallStatCard title="Visitas dentro" value={stats.visitas_dentro} />
            <SmallStatCard title="Entradas visitas" value={stats.entradas_visitas} />
            <SmallStatCard title="Salidas visitas" value={stats.salidas_visitas} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
                <Clock
                  size={150}
                  className="absolute -right-10 -top-10 text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors"
                />
                <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-500" />
                    Horas Pico Detectadas
                  </h3>

                  <p className="text-2xl font-black text-white italic uppercase leading-tight">
                    {horaPico}
                  </p>

                  <p className="text-[10px] font-bold text-emerald-500/60 uppercase mt-3 tracking-widest italic">
                    Basado en registros reales
                  </p>

                  <div className="mt-8 space-y-6">
                    <ProgressBar
                      label="Eficiencia Operativa"
                      percentage={stats.eficiencia}
                      color="bg-emerald-500"
                    />

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        Fecha Analizada
                      </p>
                      <p className="text-xs font-bold text-white uppercase italic">
                        {fechaSeleccionada}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <BarChart3 size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Tasa de Éxito
                    </p>
                    <p className="text-xl font-black text-white tracking-tighter italic uppercase">
                      {stats.eficiencia}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                    Log general - {fechaSeleccionada}
                  </h4>
                  <Filter size={14} className="text-slate-600" />
                </div>

                <div className="p-4 overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <th className="px-6 pb-2">Registro</th>
                        <th className="px-6 pb-2">Hora</th>
                        <th className="px-6 pb-2">Tipo</th>
                        <th className="px-6 pb-2">Punto</th>
                        <th className="px-6 pb-2">Clase</th>
                        <th className="px-6 pb-2 text-right">Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.length > 0 ? (
                        movimientos.map((m, i) => (
                          <ReportRow
                            key={m.id || i}
                            p={m.placa}
                            h={formatearHora(m.fecha)}
                            t={m.tipo}
                            punto={m.punto || 'Acceso Principal'}
                            clase={m.tipo_registro === 'visita' ? 'Visita' : 'Vehículo'}
                            s="Validado"
                            color={
                              m.tipo === 'Entrada'
                                ? 'text-emerald-400'
                                : m.tipo === 'Salida'
                                ? 'text-blue-400'
                                : 'text-red-400'
                            }
                            onClick={() => abrirDetalle(m)}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-20 text-slate-600 font-black uppercase text-[10px] tracking-widest italic"
                          >
                            Sin registros para esta fecha
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Historial de permanencia - {fechaSeleccionada}
              </h4>
            </div>

            <div className="p-4 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-6 pb-2">Registro</th>
                    <th className="px-6 pb-2">Entrada</th>
                    <th className="px-6 pb-2">Salida</th>
                    <th className="px-6 pb-2">Punto Entrada</th>
                    <th className="px-6 pb-2">Punto Salida</th>
                    <th className="px-6 pb-2">Clase</th>
                    <th className="px-6 pb-2">Tiempo dentro</th>
                    <th className="px-6 pb-2 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleRegistros.length > 0 ? (
                    detalleRegistros.map((item, i) => (
                      <tr
                        key={`${item.tipo_registro}-${item.entrada}-${i}`}
                        className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                      >
                        <td className="px-6 py-4 rounded-l-2xl">
                          <button
                            type="button"
                            onClick={() => abrirDetalle(item)}
                            className="text-[12px] font-mono font-black text-white uppercase hover:text-emerald-400 transition-colors"
                          >
                            {item.tipo_registro === 'visita'
                              ? (item.nombre || item.identificador || 'Visita')
                              : item.placa}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-[10px] font-bold text-slate-300">
                          {formatearHora(item.entrada)}
                        </td>

                        <td className="px-6 py-4 text-[10px] font-bold text-slate-300">
                          {item.salida ? formatearHora(item.salida) : '---'}
                        </td>

                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                          {item.punto_entrada || '---'}
                        </td>

                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                          {item.punto_salida || '---'}
                        </td>

                        <td className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase">
                          {item.tipo_registro === 'visita' ? 'Visita' : 'Vehículo'}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-2 rounded-xl font-black tracking-wider text-[11px]">
                            <Clock size={14} />
                            {formatearTiempo(item.segundos_totales, item.estado)}
                          </span>
                        </td>

                        <td className="px-6 py-4 rounded-r-2xl text-right">
                          <span
                            className={`text-[8px] font-black px-2 py-1 rounded-md uppercase border ${
                              item.estado === 'Dentro'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-20 text-slate-600 font-black uppercase text-[10px] tracking-widest italic"
                      >
                        Sin historial para esta fecha
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {registroSeleccionado && (
        <FloatingDetailModal
          data={registroSeleccionado}
          onClose={cerrarDetalle}
        />
      )}
    </div>
  );
};

const MetricCard = ({ label, value, icon, color }) => {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5',
    red: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/5'
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border ${colors[color]} backdrop-blur-sm group hover:scale-[1.02] transition-transform`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
      </div>
      <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">{label}</p>
      <p className="text-3xl font-black text-white leading-none mt-1 italic uppercase">
        {String(value || 0).padStart(2, '0')}
      </p>
    </div>
  );
};

const SmallStatCard = ({ title, value }) => (
  <div className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-5">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-black text-white italic mt-2">{String(value || 0).padStart(2, '0')}</p>
  </div>
);

const ProgressBar = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className="text-white">{percentage}</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: percentage }}
      ></div>
    </div>
  </div>
);

const ReportRow = ({ p, h, t, punto, clase, s, color, onClick }) => (
  <tr className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
    <td className="px-6 py-4 rounded-l-2xl">
      <button
        type="button"
        onClick={onClick}
        className="text-[12px] font-mono font-black text-white uppercase hover:text-emerald-400 transition-colors"
      >
        {p}
      </button>
    </td>
    <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{h}</td>
    <td className={`px-6 py-4 text-[10px] font-black uppercase italic ${color}`}>{t}</td>
    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{punto}</td>
    <td className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase">{clase}</td>
    <td className="px-6 py-4 rounded-r-2xl text-right">
      <span className="text-[8px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md uppercase border border-emerald-500/20">
        {s}
      </span>
    </td>
  </tr>
);

const FloatingDetailModal = ({ data, onClose }) => {
  const esVisita = data?.tipo_registro === 'visita';

  return (
    <div className="fixed top-24 right-6 z-[9999] w-[330px]">
      <div className="bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {esVisita ? <User size={16} className="text-emerald-400" /> : <Car size={16} className="text-emerald-400" />}
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {esVisita ? 'Datos de la visita' : 'Datos del usuario'}
              </h3>
              <p className="text-xs text-emerald-400 font-bold mt-1">
                {esVisita ? (data?.nombre || 'Visita') : (data?.placa || 'Sin placa')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[460px] overflow-y-auto">
          {esVisita ? (
            <>
              <MiniDato label="Nombre" value={data?.nombre} />
              <MiniDato label="Documento" value={data?.documento} />
              <MiniDato label="Empresa" value={data?.empresa} />
              <MiniDato label="Motivo" value={data?.motivo} />
              <MiniDato label="Estado" value={data?.estado} />
              <MiniDato label="Token" value={data?.token} />
            </>
          ) : (
            <>
              <MiniDato label="Nombre" value={data?.nombre} />
              <MiniDato label="Matrícula" value={data?.matricula} />
              <MiniDato label="Rol" value={data?.rol} />
              <MiniDato label="Placa" value={data?.placa} />
              <MiniDato label="Modelo" value={data?.modelo} />
              <MiniDato label="Color" value={data?.color} />
              <MiniDato label="Año" value={data?.anio} />
              <MiniDato label="Estatus" value={data?.estatus} />
              <MiniDato label="Ubicación" value={data?.ubicacion} />
              <MiniDato label="Vehículo info" value={data?.vehiculo_info} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MiniDato = ({ label, value }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">
      {label}
    </p>
    <p className="text-white font-bold break-words">
      {value || 'No disponible'}
    </p>
  </div>
);

export default Reportes;