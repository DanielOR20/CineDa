import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
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
  AlertCircle,
  Home
} from 'lucide-react';
import GenericCrudView from '../components/GenericCrudView';
import { ENTITIES_CONFIG } from '../config/entitiesConfig';
import { entitiesServices } from '../services/api';

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

export default function DynamicCrudPage() {
  const { entityKey } = useParams();

  const config = ENTITIES_CONFIG[entityKey];
  const service = entitiesServices[entityKey];

  if (!config || !service) {
    return (
      <div className="bg-[#0f1115] border border-[#1e2229] rounded-lg p-12 text-center max-w-lg mx-auto mt-10 space-y-3">
        <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-semibold text-[#f8fafc]">Módulo No Encontrado</h2>
        <p className="text-xs text-[#8b949e]">
          La entidad <span className="font-mono text-rose-300">"{entityKey}"</span> no forma parte de las 24 entidades configuradas en el sistema.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#84cc16] hover:bg-[#a3e635] text-[#08090a] text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[config.iconName] || Film;

  return (
    <GenericCrudView
      key={config.key}
      entityKey={config.key || entityKey}
      title={config.title}
      subtitle={config.subtitle}
      service={service}
      idField={config.idField}
      createButtonLabel={config.createButtonLabel}
      columns={config.columns}
      fields={config.fields}
      allowActions={config.allowActions}
      icon={Icon}
    />
  );
}
