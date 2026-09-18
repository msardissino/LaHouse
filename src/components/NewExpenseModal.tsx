import React, { useState } from 'react';
import { ExpenseCategory, PaymentMethod, UserProfile } from '../types';
import { X, Receipt, DollarSign, Calendar } from 'lucide-react';

interface NewExpenseModalProps {
  activeUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (expenseData: any) => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({
  activeUser,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('insumos');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      alert('Descripción y Monto son requeridos.');
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      category,
      payment_method: paymentMethod,
      date,
      created_by: activeUser?.name || 'Admin',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">Registrar Gasto</h2>
              <p className="text-xs text-stone-500">Compras de materia prima y costos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Descripción del Gasto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Compra 50 cajas + bases oro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                Monto ($) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="Ej: 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'insumos' as ExpenseCategory, label: '🍓 Insumos / Materia Prima' },
                { id: 'packaging' as ExpenseCategory, label: '📦 Packaging / Cajas' },
                { id: 'servicios' as ExpenseCategory, label: '💡 Gas / Luz / Servicios' },
                { id: 'otros' as ExpenseCategory, label: '✨ Varios / Otros' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    category === c.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Pagado con
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                  paymentMethod === 'transfer'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600'
                }`}
              >
                📱 Transferencia / MP
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                  paymentMethod === 'cash'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600'
                }`}
              >
                💵 Efectivo
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 text-sm"
            >
              Guardar Gasto
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
