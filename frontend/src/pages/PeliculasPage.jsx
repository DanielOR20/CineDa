import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { peliculasService, aiService } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function PeliculasPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast
  const [toast, setToast] = useState(null);

  // Modal Formulario (Creación / Edición)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPelicula, setEditingPelicula] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    duracion: '',
    clasificacion: 'TE',
    sinopsis: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAutocomplete = async () => {
    if (!formData.titulo?.trim()) return;
    setAiLoading(true);
    try {
      const res = await aiService.generarPelicula(formData.titulo.trim());
      const peliculaData = res?.pelicula || res?.data?.pelicula || res?.data || res;
      if (peliculaData) {
        setFormData((prev) => ({
          ...prev,
          titulo: peliculaData.titulo || prev.titulo,
          genero: peliculaData.genero || prev.genero,
          duracion: peliculaData.duracion ? String(peliculaData.duracion) : prev.duracion,
          clasificacion: peliculaData.clasificacion || prev.clasificacion,
          sinopsis: peliculaData.sinopsis || prev.sinopsis,
        }));
        showToast('Ficha autocompletada con DeepSeek AI', 'success');
      }
    } catch (err) {
      console.error('Error al autocompletar con IA:', err);
      showToast(err.message || 'Error al autocompletar con IA', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Modal Confirmación (Eliminación)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPelicula, setDeletingPelicula] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Carga inicial de películas
  const fetchPeliculas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await peliculasService.getAll();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setPeliculas(list);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Filtrado reactivo en tiempo real
  const filteredPeliculas = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return peliculas;
    return peliculas.filter(
      (p) =>
        p.titulo?.toLowerCase().includes(q) ||
        p.genero?.toLowerCase().includes(q)
    );
  }, [peliculas, searchTerm]);

  // Manejo de Formulario
  const handleOpenCreate = () => {
    setEditingPelicula(null);
    setFormData({
      titulo: '',
      genero: '',
      duracion: '',
      clasificacion: 'TE',
      sinopsis: ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPelicula(p);
    setFormData({
      titulo: p.titulo || '',
      genero: p.genero || '',
      duracion: p.duracion !== undefined ? String(p.duracion) : '',
      clasificacion: p.clasificacion || 'TE',
      sinopsis: p.sinopsis || ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo.trim()) errors.titulo = 'El título de la película es obligatorio';
    if (!formData.genero.trim()) errors.genero = 'El género principal es obligatorio';
    const durNum = parseInt(formData.duracion, 10);
    if (!formData.duracion || isNaN(durNum) || durNum <= 0) {
      errors.duracion = 'La duración debe ser un número entero mayor a 0 (minutos)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const payload = {
      titulo: formData.titulo.trim(),
      genero: formData.genero.trim(),
      duracion: parseInt(formData.duracion, 10),
      clasificacion: formData.clasificacion,
      sinopsis: formData.sinopsis.trim()
    };

    try {
      if (editingPelicula) {
        await peliculasService.update(editingPelicula.id_pelicula, payload);
        showToast(`Película "${payload.titulo}" actualizada correctamente`);
      } else {
        await peliculasService.create(payload);
        showToast(`Película "${payload.titulo}" creada exitosamente`);
      }
      setIsFormOpen(false);
      await fetchPeliculas();
    } catch (err) {
      showToast(err.message || 'Error al guardar la película', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejo de Eliminación
  const handleOpenDelete = (p) => {
    setDeletingPelicula(p);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPelicula) return;
    setDeleting(true);
    try {
      await peliculasService.delete(deletingPelicula.id_pelicula);
      showToast(`Película "${deletingPelicula.titulo}" eliminada`);
      setIsDeleteOpen(false);
      await fetchPeliculas();
    } catch (err) {
      showToast(err.message || 'Error al eliminar la película', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Renderizado del badge de clasificación minimalista
  const renderClasificacionBadge = (clasificacion) => {
    if (clasificacion === 'TE') {
      return (
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
          TE
        </span>
      );
    }
    if (clasificacion === '+12') {
      return (
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
          +12
        </span>
      );
    }
    if (clasificacion === '+15') {
      return (
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
          +15
        </span>
      );
    }
    if (clasificacion === '+18') {
      return (
        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
          +18
        </span>
      );
    }
    return (
      <span className="bg-[#14171d] text-[#cbd5e1] border border-[#232832] px-2 py-0.5 rounded text-[10px] font-medium">
        {clasificacion}
      </span>
    );
  };

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
              <CheckCircle2 className="w-3.5 h-3.5 text-[#84cc16]" />
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

      {/* Cabecera y Barra de Herramientas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2229] pb-3.5">
        <div>
          <h1 className="text-base font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
            <Film className="w-4 h-4 text-[#84cc16]" />
            Gestión de Películas
            <span className="text-[11px] font-mono text-[#8b949e] font-normal ml-1">
              ({filteredPeliculas.length} títulos)
            </span>
          </h1>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Catálogo cinematográfico oficial y clasificación por edad.
          </p>
        </div>

        {/* Botón contextual */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Nueva Película</span>
        </button>
      </div>

      {/* Barra de Filtro y Búsqueda */}
      <div className="flex items-center justify-between gap-3 bg-[#0f1115] border border-[#1e2229] rounded-lg p-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por título o género..."
            className="w-full bg-[#14171d] border border-[#232832] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#f8fafc] placeholder-[#8b949e]/60 focus:outline-none focus:border-[#84cc16] transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={fetchPeliculas}
          title="Recargar catálogo"
          className="p-1.5 text-[#8b949e] hover:text-[#f8fafc] hover:bg-[#1a1e26] rounded-md border border-transparent hover:border-[#1e2229] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#84cc16]' : ''}`} />
        </button>
      </div>

      {/* Tabla de Películas */}
      {loading ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center text-xs text-[#8b949e] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#84cc16]" />
          <span>Cargando catálogo...</span>
        </div>
      ) : error ? (
        <div className="bg-[#14171d] border border-rose-500/30 rounded-lg p-6 text-center space-y-2.5">
          <div className="inline-flex p-2 rounded-full bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">Error de Conexión</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchPeliculas}
            className="px-3 py-1.5 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reintentar
          </button>
        </div>
      ) : filteredPeliculas.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-md bg-[#14171d] text-[#8b949e]">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">No hay películas que mostrar</h3>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            {searchTerm
              ? 'No hay registros que coincidan con los filtros de búsqueda.'
              : 'El catálogo está vacío. Comienza registrando una película.'}
          </p>
          {!searchTerm && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> + Nueva Película
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f1115]/90 border-b border-[#1e2229] text-[#8b949e] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold w-14">#ID</th>
                  <th className="py-2.5 px-3 font-semibold">Título</th>
                  <th className="py-2.5 px-3 font-semibold">Género</th>
                  <th className="py-2.5 px-3 font-semibold">Duración</th>
                  <th className="py-2.5 px-3 font-semibold">Clasificación</th>
                  <th className="py-2.5 px-3 font-semibold">Sinopsis</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2229]">
                {filteredPeliculas.map((p) => (
                  <tr
                    key={p.id_pelicula}
                    className="hover:bg-[#181c24] transition-colors"
                  >
                    <td className="py-2 px-3 font-mono text-[#8b949e] font-medium">
                      #{p.id_pelicula}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#f8fafc]">
                      {p.titulo}
                    </td>
                    <td className="py-2 px-3 text-[#cbd5e1]">{p.genero}</td>
                    <td className="py-2 px-3 text-[#8b949e]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8b949e]" />
                        {p.duracion} min
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {renderClasificacionBadge(p.clasificacion)}
                    </td>
                    <td className="py-2 px-3 text-[#8b949e] max-w-xs truncate" title={p.sinopsis}>
                      {p.sinopsis || <span className="italic text-zinc-600">Sin sinopsis</span>}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          title="Editar película"
                          className="p-1 text-[#8b949e] hover:text-white hover:bg-[#232832] rounded transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#84cc16]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(p)}
                          title="Eliminar película"
                          className="p-1 text-[#8b949e] hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Formulario Dinámico */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14171d] border border-[#232832] rounded-lg shadow-2xl p-5 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2229] pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#84cc16]" />
                {editingPelicula ? 'Editar Película' : '+ Nueva Película'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-[#8b949e] hover:text-white p-1 rounded hover:bg-[#1a1e26] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-[#cbd5e1]">
                    Título de la Película <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAutocomplete}
                    disabled={aiLoading || !formData.titulo?.trim()}
                    title="Autocompletar género, duración, clasificación y sinopsis con DeepSeek"
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-200 rounded transition-colors cursor-pointer"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    )}
                    <span>✨ Autocompletar con IA</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Dune: Part Two, Oppenheimer..."
                  className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                    formErrors.titulo
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-[#1e2229] focus:border-[#84cc16]'
                  }`}
                />
                {formErrors.titulo && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.titulo}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    Género Principal <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                    placeholder="Ej: Ciencia Ficción, Acción..."
                    className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                      formErrors.genero
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-[#1e2229] focus:border-[#84cc16]'
                    }`}
                  />
                  {formErrors.genero && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.genero}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    Duración (minutos) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    placeholder="Ej: 166"
                    className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                      formErrors.duracion
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-[#1e2229] focus:border-[#84cc16]'
                    }`}
                  />
                  {formErrors.duracion && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.duracion}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  Clasificación Oficial <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.clasificacion}
                  onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })}
                  className="w-full bg-[#0f1115] border border-[#1e2229] rounded-md px-3 py-1.5 text-[#f8fafc] focus:outline-none focus:border-[#84cc16] transition-colors"
                >
                  <option value="TE">TE (Todo Espectador)</option>
                  <option value="+12">+12 (Mayores de 12 años)</option>
                  <option value="+15">+15 (Mayores de 15 años)</option>
                  <option value="+18">+18 (Adultos)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  Sinopsis Argumental
                </label>
                <textarea
                  rows={3}
                  value={formData.sinopsis}
                  onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
                  placeholder="Breve reseña sobre la trama de la película..."
                  className="w-full bg-[#0f1115] border border-[#1e2229] rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#84cc16] transition-colors resize-none"
                />
              </div>

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
                  className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{editingPelicula ? 'Actualizar Película' : 'Guardar Película'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="¿Eliminar película del catálogo?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deletingPelicula?.titulo}"? Esta acción borrará el registro de la base de datos.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Eliminar Película"
      />
    </div>
  );
}
