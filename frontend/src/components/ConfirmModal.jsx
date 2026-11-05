import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = '¿Confirmar acción?',
  message = 'Esta operación no se puede deshacer.',
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#14171d] border border-[#232832] rounded-xl shadow-2xl p-5 relative overflow-hidden animate-in zoom-in-95 duration-100">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-3.5 right-3.5 text-[#8b949e] hover:text-white transition-colors p-1 rounded-md hover:bg-[#1a1e26] cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3.5">
          {/* Ícono de Advertencia */}
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>

          {/* Textos */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#f8fafc] tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-5 flex items-center justify-end gap-2 pt-3.5 border-t border-[#1e2229]">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1.5 rounded-md border border-[#1e2229] bg-[#0f1115] hover:bg-[#1a1e26] text-[#cbd5e1] hover:text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
