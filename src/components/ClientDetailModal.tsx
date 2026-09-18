import React from 'react';
import { Client, Order, Flavor, BusinessSettings } from '../types';
import {
  formatCurrency,
  formatDate,
  getDaysSince,
  cleanPhoneForWhatsApp,
  getRelativeDeliveryText
} from '../utils/helpers';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  DollarSign
} from 'lucide-react';

interface ClientDetailModalProps {
  client: Client;
  orders: Order[];
  flavors: Flavor[];
  businessSettings: BusinessSettings;
  onClose: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenQuickPay: (order: Order) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  orders,
  flavors,
  businessSettings,
  onClose,
  onEditClient,
  onDeleteClient,
  onOpenQuickPay,
}) => {
  const clientOrders = orders.filter((o) => o.client_id === client.id);
  const daysSince = getDaysSince(client.last_order_date);
  const isInactive = daysSince > 20;

  const cleanPhone = cleanPhoneForWhatsApp(client.phone);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola ${client.name}! 👋 Te escribimos desde ${businessSettings.businessName} 🥧 ¿Cómo estás?`
  )}`;

  // Find favorite flavor objects
  const favoriteFlavors = (client.favorite_flavor_ids || [])
    .map((fid) => flavors.find((f) => f.id === fid))
    .filter(Boolean) as Flavor[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 font-black text-xl flex items-center justify-center shadow-inner">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                  {client.name}
                </h2>
                {isInactive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                    Inactivo ({daysSince}d)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Último pedido: {client.last_order_date ? formatDate(client.last_order_date) : 'Sin pedidos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEditClient(client)}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
              title="Editar datos"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4">
          
          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs border border-stone-200 dark:border-stone-700"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar</span>
            </a>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Pedidos</span>
              <span className="text-base font-black text-stone-800 dark:text-white">{client.total_orders}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Total Gastado</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                {formatCurrency(client.total_spent)}
              </span>
            </div>
            <div className={`p-3 rounded-2xl border ${
              client.debt > 0
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-100 dark:border-stone-800'
            }`}>
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Deuda</span>
              <span className={`text-xs font-black block mt-1 ${client.debt > 0 ? 'text-rose-600' : 'text-stone-600 dark:text-stone-400'}`}>
                {formatCurrency(client.debt)}
              </span>
            </div>
          </div>

          {/* Address & Notes */}
          {(client.address || client.notes) && (
            <div className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
              {client.address && (
                <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{client.address}</span>
                </div>
              )}
              {client.notes && (
                <div className="text-stone-600 dark:text-stone-400 italic bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                  "{client.notes}"
                </div>
              )}
            </div>
          )}

          {/* Favorite Flavors */}
          {favoriteFlavors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Sabores Favoritos
              </h4>
              <div className="flex flex-wrap gap-2">
                {favoriteFlavors.map((flavor) => (
                  <span
                    key={flavor.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: flavor.color }} />
                    {flavor.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-500" />
              Historial de Pedidos ({clientOrders.length})
            </h4>

            {clientOrders.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">Sin pedidos registrados aún.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {clientOrders.map((order) => {
                  const rel = getRelativeDeliveryText(order.delivery_date, order.delivery_time);
                  return (
                    <div
                      key={order.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 dark:text-white">
                            #{order.order_number}
                          </span>
                          <span className={rel.color}>{rel.text}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[200px]">
                          {order.items.map((i) => `${i.quantity}x ${i.flavor_name}`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-stone-900 dark:text-white block">
                          {formatCurrency(order.total)}
                        </span>
                        {order.debt_amount > 0 ? (
                          <button
                            onClick={() => onOpenQuickPay(order)}
                            className="text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-md hover:underline"
                          >
                            Debe {formatCurrency(order.debt_amount)} • Cobrar
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600">Pagado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <button
            onClick={() => {
              if (confirm(`¿Eliminar al cliente ${client.name}?`)) {
                onDeleteClient(client.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar cliente</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-xl"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
