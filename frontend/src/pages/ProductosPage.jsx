import React, { useState, useEffect, useMemo } from 'react';
import {
  Popcorn,
  Search,
  Plus,
  Pencil,
  Trash2,
  Tag,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Package
} from 'lucide-react';
import { productosService, categoriasService } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('todos'); // 'todos' | 'bajo' | 'critico'

  // Toast
  const [toast, setToast] = useState(null);

  // Modal Formulario (Crear / Editar)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    id_categoria: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Modal Confirmación (Eliminar)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProducto, setDeletingProducto] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Carga de inventario y categorías
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        productosService.getAll(),
        categoriasService.getAll()
      ]);

      if (prodRes.status === 'fulfilled') {
        const prodList = Array.isArray(prodRes.value?.data)
          ? prodRes.value.data
          : Array.isArray(prodRes.value)
          ? prodRes.value
          : [];
        setProductos(prodList);
      } else {
        throw new Error(prodRes.reason?.message || 'Error al cargar productos');
      }

      if (catRes.status === 'fulfilled') {
        const catList = Array.isArray(catRes.value?.data)
          ? catRes.value.data
          : Array.isArray(catRes.value)
          ? catRes.value
          : [];
        setCategorias(catList);
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

  // Mapa de nombres de categorías para despliegue rápido
  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => {
      map[c.id_categoria] = c.nombre;
    });
    return map;
  }, [categorias]);

  // Filtrado reactivo combinado (texto y nivel de stock)
  const filteredProductos = useMemo(() => {
    let result = productos;

    const q = searchTerm.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          categoriaMap[p.id_categoria]?.toLowerCase().includes(q)
      );
    }

    if (stockFilter === 'critico') {
      result = result.filter((p) => Number(p.stock) <= 40);
    } else if (stockFilter === 'bajo') {
      result = result.filter((p) => Number(p.stock) > 40 && Number(p.stock) <= 70);
    }

    return result;
  }, [productos, searchTerm, stockFilter, categoriaMap]);

  // Manejo de formulario
  const handleOpenCreate = () => {
    setEditingProducto(null);
    setFormData({
      nombre: '',
      precio: '',
      stock: '0',
      id_categoria: categorias.length > 0 ? String(categorias[0].id_categoria) : ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProducto(p);
    setFormData({
      nombre: p.nombre || '',
      precio: p.precio !== undefined ? String(p.precio) : '',
      stock: p.stock !== undefined ? String(p.stock) : '0',
      id_categoria: p.id_categoria !== undefined ? String(p.id_categoria) : ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre del producto es obligatorio';
    const precioNum = parseFloat(formData.precio);
    if (!formData.precio || isNaN(precioNum) || precioNum <= 0) {
      errors.precio = 'El precio debe ser un número decimal mayor a 0';
    }
    const stockNum = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      errors.stock = 'El stock debe ser un número entero no negativo (0 o más)';
    }
    if (!formData.id_categoria) {
      errors.id_categoria = 'Debes seleccionar o especificar una categoría válida';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const payload = {
      nombre: formData.nombre.trim(),
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      id_categoria: parseInt(formData.id_categoria, 10)
    };

    try {
      if (editingProducto) {
        await productosService.update(editingProducto.id_producto, payload);
        showToast(`Producto "${payload.nombre}" actualizado correctamente`);
      } else {
        await productosService.create(payload);
        showToast(`Producto "${payload.nombre}" registrado exitosamente`);
      }
      setIsFormOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al guardar el producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejo de eliminación
  const handleOpenDelete = (p) => {
    setDeletingProducto(p);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProducto) return;
    setDeleting(true);
    try {
      await productosService.delete(deletingProducto.id_producto);
      showToast(`Producto "${deletingProducto.nombre}" eliminado del inventario`);
      setIsDeleteOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el producto', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Renderizado del badge de nivel de stock con estética desktop
  const renderStockBadge = (stock) => {
    const s = Number(stock);
    if (s <= 40) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Crítico ({s})
        </span>
      );
    }
    if (s <= 70) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Bajo ({s})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Óptimo ({s})
      </span>
    );
  };

  const formatColones = (amount) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(amount || 0);
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

      {/* Cabecera y Barra de Herramientas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2229] pb-3.5">
        <div>
          <h1 className="text-base font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
            <Popcorn className="w-4 h-4 text-[#84cc16]" />
            Inventario & Dulcería
            <span className="text-[11px] font-mono text-[#8b949e] font-normal ml-1">
              ({filteredProductos.length} artículos)
            </span>
          </h1>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Control de productos de confitería, combos y existencias en sala.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Registrar Producto</span>
        </button>
      </div>

      {/* Barra de Filtros, Búsqueda y Niveles de Stock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f1115] border border-[#1e2229] rounded-lg p-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por producto o categoría..."
            className="w-full bg-[#14171d] border border-[#232832] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#f8fafc] placeholder-[#8b949e]/60 focus:outline-none focus:border-[#84cc16] transition-colors"
          />
        </div>

        {/* Botones de filtro rápido de stock */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStockFilter('todos')}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              stockFilter === 'todos'
                ? 'bg-[#14171d] text-[#f8fafc] border border-[#232832] font-medium'
                : 'text-[#8b949e] hover:text-[#f8fafc]'
            }`}
          >
            Todos ({productos.length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('bajo')}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              stockFilter === 'bajo'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium'
                : 'text-[#8b949e] hover:text-amber-400'
            }`}
          >
            Stock Bajo
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('critico')}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              stockFilter === 'critico'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium'
                : 'text-[#8b949e] hover:text-rose-400'
            }`}
          >
            Stock Crítico
          </button>
        </div>
      </div>

      {/* Contenido / Tabla de Inventario */}
      {loading ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center text-xs text-[#8b949e] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#84cc16]" />
          <span>Cargando inventario de dulcería...</span>
        </div>
      ) : error ? (
        <div className="bg-[#14171d] border border-rose-500/30 rounded-lg p-6 text-center space-y-2.5">
          <div className="inline-flex p-2 rounded-full bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">Error al Consultar Inventario</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-1.5 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reintentar
          </button>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-md bg-[#14171d] text-[#8b949e]">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-[#f8fafc]">No se encontraron productos</h3>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            {searchTerm || stockFilter !== 'todos'
              ? 'No hay artículos que coincidan con los filtros de búsqueda seleccionados.'
              : 'El inventario de dulcería se encuentra vacío.'}
          </p>
          {!searchTerm && stockFilter === 'todos' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> + Registrar Producto
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
                  <th className="py-2.5 px-3 font-semibold">Producto</th>
                  <th className="py-2.5 px-3 font-semibold">Categoría</th>
                  <th className="py-2.5 px-3 font-semibold">Precio Unitario</th>
                  <th className="py-2.5 px-3 font-semibold">Stock</th>
                  <th className="py-2.5 px-3 font-semibold">Nivel</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2229]">
                {filteredProductos.map((p) => (
                  <tr
                    key={p.id_producto}
                    className="hover:bg-[#181c24] transition-colors"
                  >
                    <td className="py-2 px-3 font-mono text-[#8b949e] font-medium">
                      #{p.id_producto}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#f8fafc]">
                      <div className="flex items-center gap-2">
                        <Popcorn className="w-3.5 h-3.5 text-[#84cc16] flex-shrink-0" />
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[#cbd5e1]">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#14171d] border border-[#232832] text-[10px] text-[#cbd5e1]">
                        <Tag className="w-2.5 h-2.5 text-[#84cc16]" />
                        {categoriaMap[p.id_categoria] || `Cat #${p.id_categoria}`}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-medium text-emerald-400">
                      {formatColones(p.precio)}
                    </td>
                    <td className="py-2 px-3 font-mono text-[#cbd5e1]">
                      {p.stock} unids
                    </td>
                    <td className="py-2 px-3">
                      {renderStockBadge(p.stock)}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          title="Ajustar / Editar producto"
                          className="p-1 text-[#8b949e] hover:text-white hover:bg-[#232832] rounded transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#84cc16]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(p)}
                          title="Eliminar producto"
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

      {/* Modal Formulario Crear / Editar */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14171d] border border-[#232832] rounded-lg shadow-2xl p-5 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2229] pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Popcorn className="w-4 h-4 text-[#84cc16]" />
                {editingProducto ? 'Ajustar Producto de Dulcería' : '+ Registrar Producto'}
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
                  Nombre del Producto <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Palomitas Medianas Caramelo..."
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
                  Categoría de Producto <span className="text-rose-400">*</span>
                </label>
                {categorias.length > 0 ? (
                  <select
                    value={formData.id_categoria}
                    onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                    className="w-full bg-[#0f1115] border border-[#1e2229] rounded-md px-3 py-1.5 text-[#f8fafc] focus:outline-none focus:border-[#84cc16] transition-colors"
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min="1"
                    value={formData.id_categoria}
                    onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                    placeholder="ID numérico de la categoría (ej: 1)"
                    className="w-full bg-[#0f1115] border border-[#1e2229] rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#84cc16] transition-colors"
                  />
                )}
                {formErrors.id_categoria && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.id_categoria}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    Precio Unitario (₡) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="Ej: 2900"
                    className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                      formErrors.precio
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-[#1e2229] focus:border-[#84cc16]'
                    }`}
                  />
                  {formErrors.precio && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.precio}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    Stock Disponible (Unidades) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Ej: 50"
                    className={`w-full bg-[#0f1115] border rounded-md px-3 py-1.5 text-[#f8fafc] placeholder-[#8b949e]/50 focus:outline-none transition-colors ${
                      formErrors.stock
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-[#1e2229] focus:border-[#84cc16]'
                    }`}
                  />
                  {formErrors.stock && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.stock}</p>
                  )}
                </div>
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
                  <span>{editingProducto ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="¿Eliminar producto del inventario?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deletingProducto?.nombre}"? Esta acción borrará el registro de la base de datos.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Eliminar Producto"
      />
    </div>
  );
}
