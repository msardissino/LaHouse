import React from 'react';
import { Order, Client, Flavor, BusinessSettings } from '../types';
import { formatCurrency, formatDate, exportDataToExcel } from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Download,
  Award,
  TrendingUp,
  Users,
  PieChart as PieIcon,
  DollarSign
} from 'lucide-react';

interface AnalyticsViewProps {
  orders: Order[];
  clients: Client[];
  flavors: Flavor[];
  businessSettings: BusinessSettings;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  orders,
  clients,
  flavors,
  businessSettings,
}) => {
  const validOrders = orders.filter((o) => o.delivery_status !== 'cancelled');

  // Total sales and pies
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPiesSold = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );
  const avgTicket = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

  // 1. Top Flavors sold
  const flavorCounts: Record<string, { name: string; quantity: number; revenue: number; color: string }> = {};
  
  // Initialize with all flavors
  flavors.forEach((f) => {
    flavorCounts[f.id] = { name: f.name, quantity: 0, revenue: 0, color: f.color || '#F97316' };
  });

  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (flavorCounts[item.flavor_id]) {
        flavorCounts[item.flavor_id].quantity += item.quantity;
        flavorCounts[item.flavor_id].revenue += item.subtotal;
      } else {
        flavorCounts[item.flavor_id] = {
          name: item.flavor_name,
          quantity: item.quantity,
          revenue: item.subtotal,
          color: '#F97316'
        };
      }
    });
  });

  const flavorsRanking = Object.values(flavorCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);

  // 2. Sales by Date (last 7 recorded dates)
  const salesByDate: Record<string, number> = {};
  validOrders.forEach((o) => {
    salesByDate[o.delivery_date] = (salesByDate[o.delivery_date] || 0) + o.total;
  });

  const salesTimelineData = Object.entries(salesByDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([date, total]) => ({
      date: formatDate(date),
      total,
    }));

  // 3. Payment Methods Breakdown
  const paymentMethodsData = [
    {
      name: 'Transferencia / MP',
      value: validOrders
        .filter((o) => o.payment_method === 'transfer' || o.payment_method === 'card')
        .reduce((sum, o) => sum + o.amount_paid, 0),
      color: '#3B82F6',
    },
    {
      name: 'Efectivo',
      value: validOrders
        .filter((o) => o.payment_method === 'cash')
        .reduce((sum, o) => sum + o.amount_paid, 0),
      color: '#10B981',
    },
  ].filter((p) => p.value > 0);

  const handleExport = () => {
    exportDataToExcel(orders, clients, flavors, businessSettings.businessName);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      
      {/* Header & Excel Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            Estadísticas & Reportes
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Métricas de ventas, sabores estrella y fidelidad
          </p>
        </div>

        <button
          onClick={handleExport}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Excel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Total Facturado
          </span>
          <p className="text-lg font-black text-brand-600 dark:text-brand-400">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Tartas Vendidas
          </span>
          <p className="text-lg font-black text-stone-900 dark:text-white">
            {totalPiesSold} 🥧
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Ticket Promedio
          </span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(avgTicket)}
          </p>
        </div>
      </div>

      {/* Ranking de Sabores Chart */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Ranking de Sabores Más Pedidos (Unidades)
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flavorsRanking} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) => [`${value} unidades`, 'Cantidad vendida']}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="quantity" radius={[0, 8, 8, 0]}>
                {flavorsRanking.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Timeline Chart */}
      {salesTimelineData.length > 0 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Evolución de Ventas ($)
            </h3>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTimelineData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Facturación']}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="total" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Payment methods and Customer loyalty breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Payment Methods */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 mb-3">
            <PieIcon className="w-4 h-4 text-blue-500" />
            Ingresos por Medio de Pago
          </h3>

          <div className="space-y-3">
            {paymentMethodsData.map((pm) => (
              <div key={pm.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pm.color }} />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">{pm.name}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-white">
                  {formatCurrency(pm.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client metrics */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-brand-500" />
            Fidelidad de Clientes
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-stone-700 dark:text-stone-300">
              <span>Total de Clientes Registrados:</span>
              <span className="font-bold">{clients.length}</span>
            </div>
            <div className="flex justify-between text-stone-700 dark:text-stone-300">
              <span>Clientes Recurrentes (&gt;1 pedido):</span>
              <span className="font-bold text-emerald-600">
                {clients.filter((c) => c.total_orders > 1).length}
              </span>
            </div>
            <div className="flex justify-between text-stone-700 dark:text-stone-300">
              <span>Clientes con Deuda:</span>
              <span className="font-bold text-rose-600">
                {clients.filter((c) => c.debt > 0).length}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
