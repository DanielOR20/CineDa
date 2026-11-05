import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Clapperboard,
  LayoutDashboard,
  Activity,
  ChevronDown,
  FolderKanban,
  Film,
  Wrench,
  Ticket,
  Building2,
  Popcorn,
  Users,
  Tv,
  Boxes,
  Layers,
  Percent,
  CreditCard,
  Briefcase,
  DoorOpen,
  Grid,
  UserCheck,
  Receipt,
  Star,
  CalendarDays,
  Armchair,
  Banknote,
  Sparkles,
  Clock,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { MODULE_GROUPS, ENTITIES_CONFIG } from '../config/entitiesConfig';
import { useAuth } from '../context/AuthContext';

// Mapa de componentes de íconos de Lucide
const ICON_MAP = {
  FolderKanban,
  Film,
  Wrench,
  Ticket,
  Building2,
  Popcorn,
  Users,
  Tv,
  Boxes,
  Layers,
  Percent,
  CreditCard,
  Briefcase,
  DoorOpen,
  Grid,
  UserCheck,
  Receipt,
  Star,
  CalendarDays,
  Armchair,
  Banknote,
  Sparkles,
  Clock,
  ShoppingBag,
};

export default function Sidebar() {
  const location = useLocation();
  const { usuario, logout } = useAuth();

  // Estado para acordeones abiertos
  const [openSections, setOpenSections] = useState({
    capa1: true,
    capa2: true,
    capa3: true,
    capa4: true,
  });

  // Expandir automáticamente la sección que contiene la ruta activa
  useEffect(() => {
    const currentPath = location.pathname;
    MODULE_GROUPS.forEach((group) => {
      const match = group.entityKeys.some(
        (key) => currentPath === `/crud/${key}` || currentPath === `/${key}`
      );
      if (match) {
        setOpenSections((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSection = (groupId) => {
    setOpenSections((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col justify-between flex-shrink-0 select-none h-full">
      {/* Cabecera Fija */}
      <div className="p-3.5 border-b border-[#e5e7eb] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-emerald-600 shadow-sm">
          <Clapperboard className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-xs tracking-tight text-gray-900 flex items-center gap-1.5">
            CineDa <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">ERP 24</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-medium">Estación Enterprise</p>
        </div>
      </div>

      {/* Navegación Scrolleable con Acordeones */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-3 scrollbar-thin">
        {/* Panel General / Dashboard Principal (Fijo arriba) */}
        <div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Panel de Monitoreo</span>
          </NavLink>
        </div>

        {/* Separador sutil */}
        <div className="border-t border-[#e5e7eb] my-1"></div>

        {/* Los 4 Grupos de Módulos Acordeón */}
        {MODULE_GROUPS.map((group) => {
          const GroupIcon = ICON_MAP[group.icon] || FolderKanban;
          const isOpen = openSections[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {/* Botón de cabecera de acordeón */}
              <button
                type="button"
                onClick={() => toggleSection(group.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                    {group.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-gray-100 border border-gray-200 text-gray-500">
                    {group.entityKeys.length}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </div>
              </button>

              {/* Lista colapsable de entidades */}
              {isOpen && (
                <div className="pl-3 space-y-0.5 border-l border-gray-200 ml-2">
                  {group.entityKeys.map((entityKey) => {
                    const entity = ENTITIES_CONFIG[entityKey];
                    if (!entity) return null;
                    const EntityIcon = ICON_MAP[entity.iconName] || Clapperboard;
                    const targetPath = `/crud/${entityKey}`;

                    return (
                      <NavLink
                        key={entityKey}
                        to={targetPath}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                            isActive
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold shadow-xs'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                          }`
                        }
                      >
                        <EntityIcon className="w-3 h-3 flex-shrink-0 text-emerald-600" />
                        <span className="truncate">{entity.shortTitle}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer del Sidebar con Sesión de Usuario */}
      <div className="p-3 border-t border-[#e5e7eb] bg-gray-50/50 space-y-2">
        {usuario && (
          <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-lg shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 uppercase">
                {usuario.nombre ? usuario.nombre[0] : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight">
                  {usuario.nombre || 'Usuario'}
                </p>
                <p className="text-[9px] text-emerald-600 font-medium capitalize truncate">
                  {usuario.rol || 'Cliente'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-600" />
            <span className="font-medium text-gray-600">24 Entidades Activas</span>
          </span>
          <span className="font-mono text-gray-400">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
