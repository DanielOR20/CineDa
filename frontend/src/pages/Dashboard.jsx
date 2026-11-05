import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Tv, 
  Popcorn, 
  Ticket, 
  TrendingUp, 
  Monitor, 
  Package, 
  ArrowRight,
  Clock,
  Sparkles,
  Copy,
  Check,
  X,
  RefreshCw,
  Loader2,
  FileText
} from 'lucide-react';
import { peliculasService, aiService } from '../services/api';

function FormattedInline({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function MarkdownRenderer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xs font-bold text-gray-900 mt-4 mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-sm font-bold text-emerald-800 mt-5 mb-2 pb-1 border-b border-emerald-100/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-emerald-600 inline-block" />
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-base font-bold text-gray-900 mt-5 mb-2">
              {trimmed.replace(/^#\s+/, '')}
            </h1>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <li key={idx} className="ml-4 list-disc text-xs text-gray-700 my-1 leading-relaxed">
              <FormattedInline text={trimmed.replace(/^[-*]\s+/, '')} />
            </li>
          );
        }
        if (/^\d+\.\s+/.test(trimmed)) {
          return (
            <li key={idx} className="ml-4 list-decimal text-xs text-gray-700 my-1 leading-relaxed">
              <FormattedInline text={trimmed.replace(/^\d+\.\s+/, '')} />
            </li>
          );
        }
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-xs text-gray-700 my-1 leading-relaxed">
            <FormattedInline text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal de Reporte IA
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    peliculasService.getAll()
      .then(res => {
        setPeliculas(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPeliculas([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFetchReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const res = await aiService.getReporte();
      const rawText = res?.reporte || res?.data?.reporte || res?.data || (typeof res === 'string' ? res : '');
      setReportContent(rawText || 'Reporte generado con éxito.');
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setReportError(err.message || 'No se pudo conectar con el servicio de IA de DeepSeek.');
    } finally {
      setReportLoading(false);
    }
  };

  const handleOpenReportModal = () => {
    setIsReportOpen(true);
    if (!reportContent && !reportLoading) {
      handleFetchReport();
    }
  };

  const handleCopyReport = () => {
    if (!reportContent) return;
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Consola de Operaciones CineDa</h1>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              24 Módulos Activos
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Estación Central de Monitoreo y Administración de Cadena</p>
        </div>

        {/* Botón de Reporte con IA */}
        <button
          type="button"
          onClick={handleOpenReportModal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles size={14} className="text-emerald-200 animate-pulse" />
          <span>✨ Generar Reporte Ejecutivo</span>
        </button>
      </div>

      {/* 4 KPIs en blanco Apple */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Ventas Hoy</span>
            <div className="text-xl font-bold text-gray-900 mt-1">₡485.000</div>
            <span className="text-[11px] text-emerald-600 font-medium">+14.2% vs ayer</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Películas</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{peliculas.length || 10}</div>
            <span className="text-[11px] text-gray-500">En Cartelera Activa</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Film size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Ocupación</span>
            <div className="text-xl font-bold text-gray-900 mt-1">82%</div>
            <span className="text-[11px] text-emerald-600 font-medium">10 / 10 Salas Operativas</span>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Monitor size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Inventario</span>
            <div className="text-xl font-bold text-gray-900 mt-1">10 Productos</div>
            <span className="text-[11px] text-amber-600 font-medium">Dulcería Abastecida</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* Grid Principal: Tabla + Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tabla Películas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Film size={16} className="text-emerald-600" />
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Últimas Películas en Cartelera</h2>
            </div>
            <Link to="/crud/peliculas" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
              Ver catálogo completo <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase">
                  <th className="py-2 px-3">Título</th>
                  <th className="py-2 px-3">Género</th>
                  <th className="py-2 px-3">Duración</th>
                  <th className="py-2 px-3">Clasif.</th>
                  <th className="py-2 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {peliculas.slice(0, 7).map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">{p.titulo}</td>
                    <td className="py-2.5 px-3 text-gray-500">{p.genero}</td>
                    <td className="py-2.5 px-3 text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} className="text-gray-400" />
                        {p.duracion} min
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {p.clasificacion || 'TE'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Cartelera
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accesos Rápidos en Blanco Puro */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Accesos Rápidos</h2>
              <span className="text-[11px] text-gray-400">Acciones Frecuentes</span>
            </div>

            <div className="space-y-2.5">
              <Link 
                to="/crud/funciones"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Tv size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Programar Función</h3>
                    <p className="text-[11px] text-gray-500">Asignar película, sala y horario</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>

              <Link 
                to="/crud/peliculas"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Film size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Registrar Película</h3>
                    <p className="text-[11px] text-gray-500">Catálogo, duración y sinopsis</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>

              <Link 
                to="/crud/productos"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Popcorn size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Venta Dulcería</h3>
                    <p className="text-[11px] text-gray-500">Snacks, combos e inventario</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>

              <Link 
                to="/crud/entradas"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Ticket size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Emitir Entrada</h3>
                    <p className="text-[11px] text-gray-500">Boletos, butacas y facturación</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Terminal de Taquilla</span>
            <span className="font-medium text-emerald-600">Modo Producción</span>
          </div>
        </div>
      </div>

      {/* Modal macOS Light de Reporte Gerencial IA */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Cabecera Modal estilo macOS */}
            <div className="h-12 px-4 bg-[#fbfbfd] border-b border-gray-200 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-tight">Reporte Ejecutivo de Operaciones</h3>
                  <p className="text-[10px] text-gray-500">DeepSeek V3 · Análisis en tiempo real</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reportContent && !reportLoading && (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      title="Copiar texto del reporte"
                      className="px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleFetchReport}
                      title="Regenerar análisis"
                      className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Cuerpo del Reporte */}
            <div className="flex-1 overflow-y-auto p-5 text-gray-800 font-sans">
              {reportLoading ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                    <Sparkles size={16} className="absolute inset-0 m-auto text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800">Analizando métricas de la cadena...</h4>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
                      DeepSeek está evaluando los registros de taquilla, salas y facturación en tiempo real.
                    </p>
                  </div>
                </div>
              ) : reportError ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center space-y-2">
                  <p className="text-xs font-semibold text-red-800">Error al generar informe</p>
                  <p className="text-xs text-red-600 max-w-md mx-auto">{reportError}</p>
                  <button
                    type="button"
                    onClick={handleFetchReport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} /> Reintentar
                  </button>
                </div>
              ) : (
                <div className="bg-[#fbfbfd] border border-gray-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-200 text-xs text-gray-500">
                    <FileText size={14} className="text-emerald-600" />
                    <span className="font-semibold text-gray-800">Informe Operativo y Estratégico</span>
                    <span className="ml-auto text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-mono">
                      {new Date().toLocaleDateString('es-CR')}
                    </span>
                  </div>
                  <MarkdownRenderer text={reportContent} />
                </div>
              )}
            </div>

            {/* Pie del Modal */}
            <div className="h-11 px-4 bg-[#fbfbfd] border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
              <span>CineDa Operations Intelligence · Powered by DeepSeek V3</span>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
