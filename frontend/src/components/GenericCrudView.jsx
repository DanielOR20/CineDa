import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { aiService } from '../services/api';

export default function GenericCrudView({
  entityKey = '',
  title,
  subtitle,
  service,
  idField = 'id',
  createButtonLabel = null,
  config = {},
  label = '',
  columns = [],
  fields = [],
  allowActions = { create: true, edit: true, delete: true },
  icon: IconComponent = null,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Toast
  const [toast, setToast] = useState(null);

  // Modal Formulario (Crear / Editar)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  const isPeliculaEntity =
    entityKey === 'peliculas' ||
    config?.key === 'peliculas' ||
    (typeof title === 'string' && title.toLowerCase().includes('película')) ||
    (typeof title === 'string' && title.toLowerCase().includes('pelicula'));

  const handleAiAutocompletarPelicula = async () => {
    const titulo = formData.titulo?.trim();
    if (!titulo) {
      showToast('Ingresa primero el título de la película para consultar la IA', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiService.generarPelicula(titulo);
      const dataPelicula = res?.pelicula || res?.data?.pelicula || res?.data || res;
      if (dataPelicula && typeof dataPelicula === 'object') {
        setFormData((prev) => ({
          ...prev,
          titulo: dataPelicula.titulo || prev.titulo,
          genero: dataPelicula.genero || prev.genero,
          duracion: dataPelicula.duracion !== undefined ? String(dataPelicula.duracion) : prev.duracion,
          clasificacion: dataPelicula.clasificacion || prev.clasificacion,
          sinopsis: dataPelicula.sinopsis || prev.sinopsis,
        }));
        showToast('Ficha técnica autocompletada con DeepSeek AI', 'success');
      }
    } catch (err) {
      console.error('Error al autocompletar con IA:', err);
      showToast(err.message || 'Error al conectar con el servicio de IA', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Modal Confirmación (Eliminar)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos desde la API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.getAll();
      const dataList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setItems(dataList);
    } catch (err) {
      setError(err.message || `No se pudo conectar con el servicio de ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
  }, [service, title]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper para obtener el ID de un registro
  const getItemId = (item) => {
    if (!item) return null;
    if (item[idField] !== undefined) return item[idField];
    const detectedKey = Object.keys(item).find((k) => k.startsWith('id_') || k === 'id');
    return detectedKey ? item[detectedKey] : null;
  };

  // Filtrado reactivo en tiempo real
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const query = searchTerm.toLowerCase().trim();
    return items.filter((item) => {
      return Object.entries(item).some(([key, val]) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [items, searchTerm]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Manejo de Formulario (Crear)
  const handleOpenCreate = () => {
    setEditingItem(null);
    const initial = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.name] = f.defaultValue;
      } else if (f.type === 'boolean' || f.type === 'checkbox') {
        initial[f.name] = true;
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        initial[f.name] = typeof f.options[0] === 'object' ? f.options[0].value : f.options[0];
      } else {
        initial[f.name] = '';
      }
    });
    setFormData(initial);
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Manejo de Formulario (Editar)
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const current = {};
    fields.forEach((f) => {
      let val = item[f.name];
      if (val === null || val === undefined) {
        current[f.name] = f.type === 'boolean' ? false : '';
      } else if (f.type === 'date' && typeof val === 'string') {
        current[f.name] = val.split('T')[0];
      } else if (f.type === 'datetime-local' && typeof val === 'string') {
        current[f.name] = val.substring(0, 16);
      } else {
        current[f.name] = String(val);
      }
    });
    setFormData(current);
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Validación de formulario
  const validateForm = () => {
    const errors = {};
    fields.forEach((f) => {
      const val = formData[f.name];
      if (f.required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          errors[f.name] = `${f.label || f.name} es obligatorio`;
        }
      }
      if (f.type === 'number' && val !== '' && val !== undefined) {
        if (isNaN(Number(val))) {
          errors[f.name] = `${f.label || f.name} debe ser un valor numérico`;
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar (POST o PUT)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const payload = {};
    fields.forEach((f) => {
      const raw = formData[f.name];
      if (f.type === 'number') {
        payload[f.name] = raw === '' ? null : Number(raw);
      } else if (f.type === 'boolean' || f.type === 'checkbox') {
        payload[f.name] = Boolean(raw === true || raw === 'true' || raw === 1 || raw === '1');
      } else {
        payload[f.name] = raw;
      }
    });

    try {
      if (editingItem) {
        const id = getItemId(editingItem);
        await service.update(id, payload);
        showToast(`${title}: Registro #${id} actualizado exitosamente`);
      } else {
        await service.create(payload);
        showToast(`${title}: Nuevo registro creado exitosamente`);
      }
      setIsFormOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al procesar la solicitud', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejo de Eliminación
  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    const id = getItemId(deletingItem);
    try {
      await service.delete(id);
      showToast(`${title}: Registro #${id} eliminado correctamente`);
      setIsDeleteOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el registro', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Formateador de celdas con badges empresariales estrictos
  const renderCellContent = (item, col) => {
    const val = item[col.key];

    if (val === null || val === undefined || val === '') {
      return <span className="text-[#8b949e] italic">-</span>;
    }

    if (col.type === 'currency') {
      return (
        <span className="font-mono text-emerald-400 font-medium">
          {new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            maximumFractionDigits: 0
          }).format(Number(val) || 0)}
        </span>
      );
    }

    if (col.type === 'date') {
      return (
        <span className="font-mono text-[#cbd5e1]">
          {String(val).split('T')[0]}
        </span>
      );
    }

    if (col.type === 'datetime') {
      const dt = new Date(val);
      return (
        <span className="font-mono text-[#cbd5e1]">
          {!isNaN(dt) ? dt.toLocaleString('es-CR', { hour12: false }) : String(val)}
        </span>
      );
    }

    if (col.type === 'boolean') {
      const isTrue = Boolean(val === true || val === 1 || val === '1' || val === 'true');
      return isTrue ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Activo
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Inactivo
        </span>
      );
    }

    if (col.type === 'badge') {
      let customClass = '';
      if (col.badgeColor) {
        customClass =
          typeof col.badgeColor === 'function'
            ? col.badgeColor(val)
            : col.badgeColor[val];
      }

      if (!customClass) {
        const strVal = String(val).toLowerCase();
        if (
          ['activo', 'activa', 'aprobada', 'valida', 'completado', 'completada', 'optimo', 'optima', 'te', 'cliente'].includes(strVal)
        ) {
          customClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        } else if (
          ['pendiente', 'en_proceso', 'programada', 'bajo', '+12', '+15', 'vip', 'empleado'].includes(strVal)
        ) {
          customClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        } else if (
          ['inactivo', 'inactiva', 'critico', 'critica', 'cancelada', 'rechazada', 'fallido', '+18', 'administrador'].includes(strVal)
        ) {
          customClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        } else {
          customClass = 'bg-[#1e2229] text-[#cbd5e1] border-[#232832]';
        }
      }

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${customClass}`}
        >
          {String(val)}
        </span>
      );
    }

    if (col.type === 'number') {
      return <span className="font-mono text-[#cbd5e1]">{val}</span>;
    }

    return <span className="truncate max-w-xs block text-[#cbd5e1]">{String(val)}</span>;
  };

  const hasActions = allowActions.edit || allowActions.delete;
  const buttonText = createButtonLabel || '+ Nuevo Registro';

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Toast Notificación */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-xs font-medium shadow-2xl backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-[#181014] border-rose-500/30 text-rose-300'
                : 'bg-[#101814] border-emerald-500/30 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-[#8b949e] hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Cabecera y Barra de Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2229] pb-3.5">
        <div>
          <h1 className="text-base font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
            {IconComponent && <IconComponent className="w-4 h-4 text-[#84cc16]" />}
            <span>{title}</span>
            <span className="text-[11px] font-mono text-[#8b949e] font-normal ml-1">
              ({filteredItems.length} registros)
            </span>
          </h1>
          {subtitle && <p className="text-xs text-[#8b949e] mt-0.5">{subtitle}</p>}
        </div>

        {allowActions.create && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>{String(createButtonLabel || config?.createButtonLabel || label || 'Nuevo Registro').replace(/^\++\s*/, '')}</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex items-center justify-between gap-3 bg-[#0f1115] border border-[#1e2229] rounded-lg p-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filtrar registros..."
            className="w-full bg-[#14171d] border border-[#232832] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#f8fafc] placeholder-[#8b949e]/60 focus:outline-none focus:border-[#84cc16] transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={fetchData}
          title="Recargar datos"
          className="p-1.5 text-[#8b949e] hover:text-[#f8fafc] hover:bg-[#1a1e26] rounded-md border border-transparent hover:border-[#1e2229] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#84cc16]' : ''}`} />
        </button>
      </div>

      {/* Contenido: Tabla / Loader / Error */}
      {loading ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center text-xs text-[#8b949e] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#84cc16]" />
          <span>Consultando registros de {title}...</span>
        </div>
      ) : error ? (
        <div className="bg-[#14171d] border border-rose-500/30 rounded-lg p-6 text-center space-y-2.5">
          <div className="inline-flex p-2 rounded-full bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">Error de Conexión</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-1.5 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reintentar
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-md bg-[#14171d] text-[#8b949e]">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">No se encontraron registros</h3>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            {searchTerm
              ? 'No hay registros que coincidan con el filtro aplicado.'
              : `Aún no hay datos registrados en ${title}.`}
          </p>
          {allowActions.create && !searchTerm && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> {buttonText}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f1115] border-b border-[#1e2229] text-[11px] text-[#8b949e] uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-3 font-semibold w-14">#ID</th>
                  {columns.map((col) => (
                    <th key={col.key} className="py-2 px-3 font-semibold whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {hasActions && (
                    <th className="py-2 px-3 font-semibold text-right w-20">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2229]">
                {paginatedItems.map((item, idx) => {
                  const itemId = getItemId(item) || idx;
                  return (
                    <tr
                      key={itemId}
                      className="hover:bg-[#181c24] transition-colors"
                    >
                      <td className="py-2 px-3 font-mono text-[#8b949e] font-medium">
                        #{itemId}
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="py-2 px-3 text-[#cbd5e1]">
                          {renderCellContent(item, col)}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="py-2 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {allowActions.edit && (
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                title="Editar registro"
                                className="p-1 text-[#8b949e] hover:text-white hover:bg-[#232832] rounded transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#84cc16]" />
                              </button>
                            )}
                            {allowActions.delete && (
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(item)}
                                title="Eliminar registro"
                                className="p-1 text-[#8b949e] hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Barra de Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 pb-4 border-t border-gray-200 bg-white text-xs text-gray-600">
              <span className="font-medium text-gray-500">
                Página {currentPage} de {totalPages} ({filteredItems.length} registros)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-7 h-7 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Formulario Dinámico */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14171d] border border-[#232832] rounded-lg shadow-2xl p-5 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-[#1e2229] pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4 text-[#84cc16]" />}
                <span>{editingItem ? `Editar ${title}` : buttonText}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-[#8b949e] hover:text-white p-1 rounded hover:bg-[#1a1e26] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              {fields.map((f) => {
                const hasError = Boolean(formErrors[f.name]);
                return (
                  <div key={f.name}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-[#cbd5e1]">
                        {f.label || f.name} {f.required && <span className="text-rose-400">*</span>}
                      </label>
                      {isPeliculaEntity && f.name === 'titulo' && !editingItem && (
                        <button
                          type="button"
                          onClick={handleAiAutocompletarPelicula}
                          disabled={aiLoading || !formData.titulo?.trim()}
                          title="Autocompletar género, duración, clasificación y sinopsis con DeepSeek IA"
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-200 rounded transition-colors cursor-pointer shadow-xs"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>✨ Autocompletar con IA</span>
                        </button>
                      )}
                    </div>

                    {f.type === 'select' ? (
                      <select
                        value={formData[f.name] ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [f.name]: e.target.value })
                        }
                        className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] focus:outline-none transition-colors ${
                          hasError
                            ? 'border-rose-500 focus:border-rose-400'
                            : 'border-[#1e2229] focus:border-[#84cc16]'
                        }`}
                      >
                        {f.options?.map((opt) => {
                          const val = typeof opt === 'object' ? opt.value : opt;
                          const label = typeof opt === 'object' ? opt.label : opt;
                          return (
                            <option key={String(val)} value={val}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[f.name] ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [f.name]: e.target.value })
                        }
                        placeholder={f.placeholder || ''}
                        className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors resize-none ${
                          hasError
                            ? 'border-rose-500 focus:border-rose-400'
                            : 'border-[#1e2229] focus:border-[#84cc16]'
                        }`}
                      />
                    ) : f.type === 'boolean' || f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={Boolean(formData[f.name])}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-[#232832] bg-[#0f1115] text-[#84cc16] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[#cbd5e1]">
                          {formData[f.name] ? 'Habilitado / Activo' : 'Deshabilitado / Inactivo'}
                        </span>
                      </label>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        step={f.step || (f.type === 'number' ? 'any' : undefined)}
                        value={formData[f.name] ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [f.name]: e.target.value })
                        }
                        placeholder={f.placeholder || ''}
                        className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                          hasError
                            ? 'border-rose-500 focus:border-rose-400'
                            : 'border-[#1e2229] focus:border-[#84cc16]'
                        }`}
                      />
                    )}

                    {hasError && (
                      <p className="text-[11px] text-rose-400 mt-1">{formErrors[f.name]}</p>
                    )}
                  </div>
                );
              })}

              {/* Botones de acción del Modal */}
              <div className="pt-3 border-t border-[#1e2229] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-md border border-[#1e2229] bg-[#0f1115] hover:bg-[#1a1e26] text-[#cbd5e1] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{editingItem ? 'Guardar Cambios' : buttonText}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Borrado */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title={`¿Eliminar registro de ${title}?`}
        message={`¿Estás seguro de que deseas eliminar permanentemente el registro #${getItemId(
          deletingItem
        )}? Esta acción afectará los registros vinculados en la base de datos.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Eliminar Registro"
      />
    </div>
  );
}
