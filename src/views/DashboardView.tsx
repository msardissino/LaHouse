import React from 'react';
import { Order, StockItem, Client, Flavor, UserProfile, BusinessSettings, DeliveryStatus } from '../types';
import { formatCurrency, getRelativeDeliveryText, generateWhatsAppLink } from '../utils/helpers';
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  Plus,
  Share2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  orders: Order[];
  stock: StockItem[];
  clients: Client[];
  flavors: Flavor[];
  activeUser: UserProfile | null;
  businessSettings: BusinessSettings;
  onOpenNewOrder: () => void;
  onOpenNewExpense: () => void;
  onSelectTab: (tab: any) => void;
  onUpdateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  onOpenQuickPay: (order: Order) => void;
  onSelectClient: (client: Client) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  stock,
  clients,
  flavors,
  activeUser,
  businessSettings,
  onOpenNewOrder,
  onOpenNewExpense,
  onSelectTab,
  onUpdateOrderStatus,
  onOpenQuickPay,
  onSelectClient,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations for Today
  const todayOrders = orders.filter((o) => o.delivery_date === todayStr && o.delivery_status !== 'cancelled');
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const todayPaid = todayOrders.reduce((sum, o) => sum + o.amount_paid, 0);
  const todayPiesCount = todayOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );

  const pendingDeliveries = todayOrders.filter((o) => o.delivery_status !== 'delivered');
  const totalOutstandingDebt = orders
    .filter((o) => o.delivery_status !== 'cancelled')
    .reduce((sum, o) => sum + (o.debt_amount || 0), 0);

  // Low stock items
  const lowStockItems = stock.filter((s) => s.quantity <= s.min_threshold);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-amber-600 p-6 text-white shadow-xl shadow-brand-500/20">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              ¡Hola, {activeUser?.name || 'Chef'}!
            </span>
            <span className="text-xs text-white/80 font-medium">
              {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-1">
            Resumen de Hoy
          </h2>
          <p className="text-xs text-white/90 mb-5">
            Tenés <strong className="underline decoration-white/40">{pendingDeliveries.length} pedidos</strong> pendientes para entregar hoy.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenNewOrder}
              className="py-3 px-4 rounded-2xl bg-white text-brand-600 hover:bg-stone-50 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-brand-600" />
              <span>+ Nueva Venta</span>
            </button>
            <button
              onClick={onOpenNewExpense}
              className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>+ Anotar Gasto</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Card 1: Ventas Hoy */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-stone-400">Ventas Hoy</span>
            <div className="w-7 h-7 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-stone-900 dark:text-white">
            {formatCurrency(todaySales)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            {todayPiesCount} tartas • {todayOrders.length} pedidos
          </p>
        </div>

        {/* Card 2: Cobrado Hoy */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-stone-400">Cobrado Hoy</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(todayPaid)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Ingresado a caja
          </p>
        </div>

        {/* Card 3: Entregas Hoy */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-stone-400">Entregas Hoy</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-stone-900 dark:text-white">
            {pendingDeliveries.length} <span className="text-xs font-semibold text-stone-400">pend.</span>
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            {todayOrders.length - pendingDeliveries.length} ya entregados
          </p>
        </div>

        {/* Card 4: Deudas Clientes */}
        <div
          onClick={() => onSelectTab('finance')}
          className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-soft cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-stone-400">Fiados / Deuda</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-600">
            {formatCurrency(totalOutstandingDebt)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Por cobrar en total
          </p>
        </div>

      </div>

      {/* Low Stock Banner Alert (if any) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Stock Bajo Detectado ({lowStockItems.length})</span>
            </div>
            <button
              onClick={() => onSelectTab('stock')}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Ver Stock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-800/70 shrink-0 text-xs flex items-center gap-2 shadow-sm"
              >
                <span className="font-semibold text-stone-800 dark:text-stone-200">{item.name}</span>
                <span className="px-2 py-0.5 rounded-full font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 text-[11px]">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Today's Orders / Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-500" />
            Entregas Programadas para Hoy
          </h3>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Ver toda la agenda</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 text-center">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              No hay pedidos programados para entregar hoy
            </p>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              ¡Aprovechá para registrar nuevas ventas o preparar stock de tartas!
            </p>
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              + Tomar Pedido
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayOrders.map((order) => {
              const waLinkReady = generateWhatsAppLink(
                order.client_phone || '',
                'ready',
                order,
                businessSettings
              );

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900 dark:text-white">
                          #{order.order_number} • {order.client_name}
                        </span>
                        {order.delivery_time && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.delivery_time} hs
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        📍 {order.delivery_address || 'Retira por taller'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-stone-900 dark:text-white block">
                        {formatCurrency(order.total)}
                      </span>
                      {order.debt_amount > 0 ? (
                        <button
                          onClick={() => onOpenQuickPay(order)}
                          className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md hover:underline"
                        >
                          Resta {formatCurrency(order.debt_amount)}
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600">✅ Pagado</span>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-2xl mb-3 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-stone-700 dark:text-stone-300">
                        <span>🥧 <strong>{item.quantity}x</strong> {item.flavor_name}</span>
                        <span className="text-stone-400 font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                    {order.notes && (
                      <div className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                        "{order.notes}"
                      </div>
                    )}
                  </div>

                  {/* Status Progression Bar & WhatsApp */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    
                    {/* Status Toggle Buttons */}
                    <div className="flex gap-1 overflow-x-auto">
                      {(['pending', 'preparing', 'ready', 'delivered'] as DeliveryStatus[]).map((st) => {
                        const isCurrent = order.delivery_status === st;
                        const labels: Record<DeliveryStatus, string> = {
                          pending: 'Pendiente',
                          preparing: 'En Cocina',
                          ready: '¡Listo!',
                          delivered: 'Entregado',
                          cancelled: 'Cancelado',
                        };

                        return (
                          <button
                            key={st}
                            onClick={() => onUpdateOrderStatus(order.id, st)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                              isCurrent
                                ? st === 'delivered'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : st === 'ready'
                                  ? 'bg-brand-500 text-white shadow-sm'
                                  : st === 'preparing'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-stone-800 text-white'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                            }`}
                          >
                            {labels[st]}
                          </button>
                        );
                      })}
                    </div>

                    {/* WhatsApp Button */}
                    {order.client_phone && (
                      <a
                        href={waLinkReady}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors shrink-0"
                        title="Avisar por WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </a>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
