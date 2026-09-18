import React, { useState } from 'react';
import { Order, DeliveryStatus, BusinessSettings, Client } from '../types';
import { formatCurrency, formatDate, getRelativeDeliveryText, generateWhatsAppLink } from '../utils/helpers';
import {
  CalendarDays,
  Search,
  Plus,
  Share2,
  Trash2,
  DollarSign,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  clients: Client[];
  businessSettings: BusinessSettings;
  onOpenNewOrder: () => void;
  onUpdateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  onOpenQuickPay: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

type FilterTab = 'today' | 'upcoming' | 'all' | 'delivered';

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  clients,
  businessSettings,
  onOpenNewOrder,
  onUpdateOrderStatus,
  onOpenQuickPay,
  onDeleteOrder,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('today');
  const [searchTerm, setSearchTerm] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredOrders = orders.filter((order) => {
    // Search match
    const matchesSearch =
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toString().includes(searchTerm) ||
      (order.client_phone && order.client_phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeFilter === 'today') {
      return order.delivery_date === todayStr && order.delivery_status !== 'cancelled';
    }
    if (activeFilter === 'upcoming') {
      return order.delivery_date > todayStr && order.delivery_status !== 'cancelled';
    }
    if (activeFilter === 'delivered') {
      return order.delivery_status === 'delivered';
    }
    return true; // all
  });

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      
      {/* Header & New Order Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-500" />
            Agenda de Pedidos
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Control de elaboración, entregas y estados
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo</span>
        </button>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente o N° de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'today' as FilterTab, label: 'Hoy' },
            { id: 'upcoming' as FilterTab, label: 'Próximos Días' },
            { id: 'all' as FilterTab, label: 'Todos' },
            { id: 'delivered' as FilterTab, label: 'Entregados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeFilter === tab.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 text-center">
          <CalendarDays className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
            No hay pedidos en esta sección
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Cambiá el filtro o creá un nuevo pedido con el botón superior.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const rel = getRelativeDeliveryText(order.delivery_date, order.delivery_time);
            const waConfirmation = generateWhatsAppLink(
              order.client_phone || '',
              'confirmation',
              order,
              businessSettings
            );
            const waReady = generateWhatsAppLink(
              order.client_phone || '',
              'ready',
              order,
              businessSettings
            );

            return (
              <div
                key={order.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-3"
              >
                {/* Top Row: Number, Client, Date, Total */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-white">
                        #{order.order_number}
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                        {order.client_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                      <span className={rel.color}>{rel.text}</span>
                      {order.created_by && (
                        <span className="text-stone-400 text-[10px]">
                          • por {order.created_by}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-stone-900 dark:text-white block">
                      {formatCurrency(order.total)}
                    </span>
                    {order.debt_amount > 0 ? (
                      <button
                        onClick={() => onOpenQuickPay(order)}
                        className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md hover:underline"
                      >
                        Debe {formatCurrency(order.debt_amount)} • Cobrar
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        ✅ Pagado ({order.payment_method === 'cash' ? 'Efectivo' : 'MP/Transf.'})
                      </span>
                    )}
                  </div>
                </div>

                {/* Items and Address */}
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 space-y-1.5 text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-stone-700 dark:text-stone-300">
                      <span>🥧 <strong>{item.quantity}x</strong> {item.flavor_name}</span>
                      <span className="text-stone-400">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}

                  {order.delivery_address && (
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>{order.delivery_address}</span>
                    </div>
                  )}

                  {order.notes && (
                    <div className="text-[11px] text-stone-500 italic">
                      "{order.notes}"
                    </div>
                  )}
                </div>

                {/* Status Progression and WhatsApp triggers */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                  
                  {/* Status Pills */}
                  <div className="flex gap-1 overflow-x-auto py-0.5">
                    {(['pending', 'preparing', 'ready', 'delivered'] as DeliveryStatus[]).map((st) => {
                      const isCurrent = order.delivery_status === st;
                      const labels: Record<DeliveryStatus, string> = {
                        pending: 'Pendiente',
                        preparing: 'En Cocina',
                        ready: 'Listo',
                        delivered: 'Entregado',
                        cancelled: 'Cancelado',
                      };

                      return (
                        <button
                          key={st}
                          onClick={() => onUpdateOrderStatus(order.id, st)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                            isCurrent
                              ? st === 'delivered'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : st === 'ready'
                                ? 'bg-brand-500 text-white shadow-sm'
                                : st === 'preparing'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-stone-800 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          {labels[st]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions (WhatsApp & Delete) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {order.client_phone && (
                      <>
                        <a
                          href={waConfirmation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 hover:text-emerald-600"
                          title="Enviar comprobante por WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={waReady}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1"
                          title="Avisar que está listo"
                        >
                          <span>Avisar Listo</span>
                        </a>
                      </>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el pedido #${order.order_number}?`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Eliminar pedido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
