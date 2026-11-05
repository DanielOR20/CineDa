import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Monitor
} from 'lucide-react';
import { cinesService, salasService } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function CinesPage() {
  const [cines, setCines] = useState([]);
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast
  const [toast, setToast] = useState(null);

  // Modal Formulario (Crear / Editar)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCine, setEditingCine] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    telefono: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Modal Confirmación (Eliminar)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCine, setDeletingCine] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Carga inicial
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cinesRes, salasRes] = await Promise.allSettled([
        cinesService.getAll(),
        salasService.getAll()
      ]);

      if (cinesRes.status === 'fulfilled') {
        const list = Array.isArray(cinesRes.value?.data)
          ? cinesRes.value.data
          : Array.isArray(cinesRes.value)
          ? cinesRes.value
          : [];
        setCines(list);
      } else {
        throw new Error(cinesRes.reason?.message || 'Error al cargar cines');
      }

      if (salasRes.status === 'fulfilled') {
        const list = Array.isArray(salasRes.value?.data)
          ? salasRes.value.data
          : Array.isArray(salasRes.value)
          ? salasRes.value
          : [];
        setSalas(list);
      }
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cantidad de salas por complejo
  const salasCountByCine = useMemo(() => {
    const counts = {};
    salas.forEach((s) => {
      counts[s.id_cine] = (counts[s.id_cine] || 0) + 1;
    });
    return counts;
  }, [salas]);

  // Filtrado reactivo en tiempo real
  const filteredCines = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return cines;
    return cines.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(q) ||
        c.ubicacion?.toLowerCase().includes(q)
    );
  }, [cines, searchTerm]);

  // Manejo de Formulario
  const handleOpenCreate = () => {
    setEditingCine(null);
    setFormData({
      nombre: '',
      ubicacion: '',
      telefono: ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCine(c);
    setFormData({
      nombre: c.nombre || '',
      ubicacion: c.ubicacion || '',
      telefono: c.telefono || ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre del cine es obligatorio';
    if (!formData.ubicacion.trim()) errors.ubicacion = 'La ubicación o dirección es obligatoria';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const payload = {
      nombre: formData.nombre.trim(),
      ubicacion: formData.ubicacion.trim(),
      telefono: formData.telefono.trim()
    };

    try {
      if (editingCine) {
        await cinesService.update(editingCine.id_cine, payload);
        showToast(`Complejo "${payload.nombre}" actualizado correctamente`);
      } else {
        await cinesService.create(payload);
        showToast(`Complejo "${payload.nombre}" registrado exitosamente`);
      }
      setIsFormOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al guardar el complejo', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejo de Eliminación
  const handleOpenDelete = (c) => {
    setDeletingCine(c);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCine) return;
    setDeleting(true);
    try {
      await cinesService.delete(deletingCine.id_cine);
      showToast(`Complejo "${deletingCine.nombre}" eliminado`);
      setIsDeleteOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el cine', 'error');
    } finally {
      setDeleting(false);
    }
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
            <Building2 className="w-4 h-4 text-[#84cc16]" />
            Complejos de Cine y Sucursales
            <span className="text-[11px] font-mono text-[#8b949e] font-normal ml-1">
              ({filteredCines.length} sedes)
            </span>
          </h1>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Administración de cines físicos, ubicación y asignación de salas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Nuevo Complejo</span>
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
            placeholder="Filtrar por nombre o ubicación..."
            className="w-full bg-[#14171d] border border-[#232832] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#f8fafc] placeholder-[#8b949e]/60 focus:outline-none focus:border-[#84cc16] transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={fetchData}
          title="Recargar complejos"
          className="p-1.5 text-[#8b949e] hover:text-[#f8fafc] hover:bg-[#1a1e26] rounded-md border border-transparent hover:border-[#1e2229] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#84cc16]' : ''}`} />
        </button>
      </div>

      {/* Tabla de Cines */}
      {loading ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center text-xs text-[#8b949e] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#84cc16]" />
          <span>Cargando complejos...</span>
        </div>
      ) : error ? (
        <div className="bg-[#14171d] border border-rose-500/30 rounded-lg p-6 text-center space-y-2.5">
          <div className="inline-flex p-2 rounded-full bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">Error al Cargar Cines</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-1.5 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reintentar
          </button>
        </div>
      ) : filteredCines.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-md bg-[#14171d] text-[#8b949e]">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">No se encontraron complejos</h3>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            {searchTerm
              ? 'No hay registros que coincidan con la búsqueda.'
              : 'No hay cines registrados en la base de datos.'}
          </p>
          {!searchTerm && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> + Nuevo Complejo
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
                  <th className="py-2.5 px-3 font-semibold">Nombre del Complejo</th>
                  <th className="py-2.5 px-3 font-semibold">Ubicación / Dirección</th>
                  <th className="py-2.5 px-3 font-semibold">Teléfono</th>
                  <th className="py-2.5 px-3 font-semibold">Salas Asignadas</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2229]">
                {filteredCines.map((c) => (
                  <tr
                    key={c.id_cine}
                    className="hover:bg-[#181c24] transition-colors"
                  >
                    <td className="py-2 px-3 font-mono text-[#8b949e] font-medium">
                      #{c.id_cine}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#f8fafc] flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#84cc16] flex-shrink-0" />
                      <span>{c.nombre}</span>
                    </td>
                    <td className="py-2 px-3 text-[#cbd5e1]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#8b949e] flex-shrink-0" />
                        <span>{c.ubicacion}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[#cbd5e1]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#8b949e] flex-shrink-0" />
                        <span className="font-mono">{c.telefono || 'Sin teléfono'}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#14171d] border border-[#232832] text-[#cbd5e1]">
                        <Monitor className="w-3 h-3 text-[#84cc16]" />
                        {salasCountByCine[c.id_cine] || 0} Salas
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          title="Editar complejo"
                          className="p-1 text-[#8b949e] hover:text-white hover:bg-[#232832] rounded transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#84cc16]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(c)}
                          title="Eliminar complejo"
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

      {/* Modal Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14171d] border border-[#232832] rounded-lg shadow-2xl p-5 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2229] pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#84cc16]" />
                {editingCine ? 'Editar Complejo' : '+ Nuevo Complejo'}
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
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  Nombre del Cine / Complejo <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: CineDa Multiplaza Escazú..."
                  className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                    formErrors.nombre
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-[#1e2229] focus:border-[#84cc16]'
                  }`}
                />
                {formErrors.nombre && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  Ubicación o Mall <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: San José, Escazú, Centro Comercial..."
                  className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                    formErrors.ubicacion
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-[#1e2229] focus:border-[#84cc16]'
                  }`}
                />
                {formErrors.ubicacion && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.ubicacion}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: +506 2201-5001"
                  className="w-full bg-[#0f1115] border border-[#1e2229] rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#84cc16] transition-colors"
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
                  <span>{editingCine ? 'Actualizar Complejo' : 'Guardar Complejo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="¿Eliminar complejo de cine?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deletingCine?.nombre}"? Esta acción borrará el registro de la base de datos.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Eliminar Complejo"
      />
    </div>
  );
}
