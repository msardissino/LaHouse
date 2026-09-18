import React, { useState } from 'react';
import { Client, Flavor, BusinessSettings } from '../types';
import { formatCurrency, formatDate, getDaysSince, cleanPhoneForWhatsApp } from '../utils/helpers';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Clock,
  Heart,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  flavors: Flavor[];
  businessSettings: BusinessSettings;
  onOpenNewClient: () => void;
  onSelectClient: (client: Client) => void;
}

type ClientFilter = 'all' | 'debt' | 'inactive';

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  flavors,
  businessSettings,
  onOpenNewClient,
  onSelectClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ClientFilter>('all');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.address && client.address.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'debt') {
      return client.debt > 0;
    }
    if (filter === 'inactive') {
      return getDaysSince(client.last_order_date) > 20;
    }
    return true;
  });

  const totalClients = clients.length;
  const clientsWithDebt = clients.filter((c) => c.debt > 0).length;
  const inactiveClients = clients.filter((c) => getDaysSince(c.last_order_date) > 20).length;

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Clientes (CRM)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Fidelización, historial y cuentas corrientes
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cliente</span>
        </button>
      </div>

      {/* Metric summary pills */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`p-3 rounded-2xl border transition-all ${
            filter === 'all'
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400'
          }`}
        >
          <span className="block text-base font-black">{totalClients}</span>
          <span className="text-[10px] uppercase font-bold text-stone-400">Todos</span>
        </button>

        <button
          onClick={() => setFilter('debt')}
          className={`p-3 rounded-2xl border transition-all ${
            filter === 'debt'
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400'
          }`}
        >
          <span className="block text-base font-black text-rose-600">{clientsWithDebt}</span>
          <span className="text-[10px] uppercase font-bold text-stone-400">Con Deuda</span>
        </button>

        <button
          onClick={() => setFilter('inactive')}
          className={`p-3 rounded-2xl border transition-all ${
            filter === 'inactive'
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400'
          }`}
        >
          <span className="block text-base font-black text-amber-600">{inactiveClients}</span>
          <span className="text-[10px] uppercase font-bold text-stone-400">Inactivos &gt;20d</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 text-center">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
            No se encontraron clientes
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Probá con otro término de búsqueda o agregá un nuevo cliente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map((client) => {
            const daysSince = getDaysSince(client.last_order_date);
            const isInactive = daysSince > 20;
            const cleanPhone = cleanPhoneForWhatsApp(client.phone);
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `¡Hola ${client.name}! 👋 Te escribimos de ${businessSettings.businessName} 🥧 ¡Tenemos tartas recién horneadas para vos!`
            )}`;

            // Top favorite flavors
            const favFlavors = (client.favorite_flavor_ids || [])
              .map((fid) => flavors.find((f) => f.id === fid))
              .filter(Boolean) as Flavor[];

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client)}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft cursor-pointer hover:border-brand-400 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-lg flex items-center justify-center shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                          {client.name}
                        </h4>
                        {isInactive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                            Inactivo ({daysSince}d)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        📞 {client.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {client.debt > 0 ? (
                      <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800 block">
                        Debe {formatCurrency(client.debt)}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 block">
                        Al día
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {client.total_orders} pedidos ({formatCurrency(client.total_spent)})
                    </span>
                  </div>
                </div>

                {/* Favorite Flavors Badges */}
                {favFlavors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {favFlavors.map((flavor) => (
                      <span
                        key={flavor.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: flavor.color }} />
                        {flavor.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Bar with direct WhatsApp */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Último pedido: {client.last_order_date ? formatDate(client.last_order_date) : 'Nunca'}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"
                      title="Escribir por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
