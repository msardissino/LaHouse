import React, { useState } from 'react';
import { Order, Expense, Client, BusinessSettings, ExpenseCategory } from '../types';
import { formatCurrency, formatDate, generateWhatsAppLink } from '../utils/helpers';
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FinanceViewProps {
  orders: Order[];
  expenses: Expense[];
  clients: Client[];
  businessSettings: BusinessSettings;
  onOpenNewExpense: () => void;
  onOpenQuickPay: (order: Order) => void;
  onDeleteExpense: (expenseId: string) => void;
}

type FinanceTab = 'debts' | 'cash_register' | 'expenses';

export const FinanceView: React.FC<FinanceViewProps> = ({
  orders,
  expenses,
  clients,
  businessSettings,
  onOpenNewExpense,
  onOpenQuickPay,
  onDeleteExpense,
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('debts');

  // Calculations
  const validOrders = orders.filter((o) => o.delivery_status !== 'cancelled');
  
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.amount_paid, 0);
  const totalCash = validOrders
    .filter((o) => o.payment_method === 'cash')
    .reduce((sum, o) => sum + o.amount_paid, 0);
  const totalTransfer = validOrders
    .filter((o) => o.payment_method === 'transfer' || o.payment_method === 'card')
    .reduce((sum, o) => sum + o.amount_paid, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalDebt = validOrders.reduce((sum, o) => sum + (o.debt_amount || 0), 0);

  // Orders with debt
  const debtOrders = validOrders.filter((o) => o.debt_amount > 0);

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-500" />
            Caja & Finanzas
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Control de cobros, fiados, gastos y ganancia neta
          </p>
        </div>

        <button
          onClick={onOpenNewExpense}
          className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Anotar Gasto</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Ganancia Neta */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Ganancia Neta
          </span>
          <p className={`text-xl font-black ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
            {formatCurrency(netProfit)}
          </p>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Ingresos - Gastos
          </span>
        </div>

        {/* Total Cobrado */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Total Cobrado
          </span>
          <p className="text-xl font-black text-stone-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            💵 {formatCurrency(totalCash)} • 📱 {formatCurrency(totalTransfer)}
          </span>
        </div>

        {/* Total Gastos */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Total Gastos
          </span>
          <p className="text-xl font-black text-rose-600">
            {formatCurrency(totalExpenses)}
          </p>
          <span className="text-[10px] text-stone-400 mt-1 block">
            {expenses.length} gastos registrados
          </span>
        </div>

        {/* Fiados / Deudas */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
            Por Cobrar (Fiados)
          </span>
          <p className="text-xl font-black text-amber-600">
            {formatCurrency(totalDebt)}
          </p>
          <span className="text-[10px] text-stone-400 mt-1 block">
            {debtOrders.length} pedidos con saldo
          </span>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('debts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'debts'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <span>⏳ Cuentas Corrientes ({debtOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cash_register')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'cash_register'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Arqueo de Medios</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'expenses'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Gastos ({expenses.length})</span>
        </button>
      </div>

      {/* Tab 1: Cuentas Corrientes / Fiados */}
      {activeTab === 'debts' && (
        <div className="space-y-3">
          {debtOrders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-800 dark:text-white">
                ¡No hay deudas pendientes!
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Todos los clientes están al día con sus pagos.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {debtOrders.map((order) => {
                const waReminder = generateWhatsAppLink(
                  order.client_phone || '',
                  'debt_reminder',
                  order,
                  businessSettings
                );

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 shadow-soft flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          {order.client_name}
                        </span>
                        <span className="text-xs text-stone-400">
                          #{order.order_number}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.flavor_name}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Total: {formatCurrency(order.total)} • Ya abonó: {formatCurrency(order.amount_paid)}
                      </p>
                    </div>

                    <div className="text-right space-y-1.5 shrink-0">
                      <span className="text-base font-black text-rose-600 block">
                        {formatCurrency(order.debt_amount)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {order.client_phone && (
                          <a
                            href={waReminder}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-emerald-600"
                            title="Enviar recordatorio de cobro por WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => onOpenQuickPay(order)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                        >
                          Cobrar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Arqueo de Medios */}
      {activeTab === 'cash_register' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Efectivo */}
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    💵
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">Caja Efectivo</h4>
                    <span className="text-[10px] text-stone-400">Dinero en mano</span>
                  </div>
                </div>
                <span className="text-lg font-black text-emerald-600">
                  {formatCurrency(totalCash)}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pagos en efectivo recibidos de ventas al contado y cobranzas.
              </p>
            </div>

            {/* Transferencias / MercadoPago */}
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg">
                    📱
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">MercadoPago / Banco</h4>
                    <span className="text-[10px] text-stone-400">Transferencias y QR</span>
                  </div>
                </div>
                <span className="text-lg font-black text-blue-600">
                  {formatCurrency(totalTransfer)}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Alias de cobro configurado: <strong className="font-mono text-stone-800 dark:text-stone-200">{businessSettings.paymentAlias || 'Sin alias'}</strong>
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Gastos y Costos */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 text-center">
              <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-800 dark:text-stone-white">
                No hay gastos registrados aún
              </p>
              <button
                onClick={onOpenNewExpense}
                className="mt-3 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                + Anotar Primer Gasto
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {expenses.map((expense) => {
                const categoryLabels: Record<ExpenseCategory, string> = {
                  insumos: '🍓 Insumos / Materia Prima',
                  packaging: '📦 Packaging / Cajas',
                  servicios: '💡 Servicios / Gas',
                  equipamiento: '🥣 Equipamiento',
                  otros: '✨ Varios',
                };

                return (
                  <div
                    key={expense.id}
                    className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          {expense.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                        <span>{categoryLabels[expense.category] || expense.category}</span>
                        <span>• {formatDate(expense.date)}</span>
                        {expense.created_by && <span>• por {expense.created_by}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-black text-rose-600">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el gasto "${expense.description}"?`)) {
                            onDeleteExpense(expense.id);
                          }
                        }}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                        title="Eliminar gasto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
