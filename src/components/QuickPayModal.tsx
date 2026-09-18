import React, { useState } from 'react';
import { Order, PaymentMethod, BusinessSettings } from '../types';
import { formatCurrency, triggerSaleConfetti, generateWhatsAppLink } from '../utils/helpers';
import { X, DollarSign, CheckCircle2, MessageCircle } from 'lucide-react';

interface QuickPayModalProps {
  order: Order;
  businessSettings: BusinessSettings;
  onClose: () => void;
  onConfirmPayment: (orderId: string, amount: number, method: PaymentMethod) => void;
}

export const QuickPayModal: React.FC<QuickPayModalProps> = ({
  order,
  businessSettings,
  onClose,
  onConfirmPayment,
}) => {
  const [payFull, setPayFull] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>(order.debt_amount.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');

  const amountToPay = payFull ? order.debt_amount : parseFloat(customAmount) || 0;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountToPay <= 0) {
      alert('Ingresá un monto válido a abonar.');
      return;
    }

    onConfirmPayment(order.id, amountToPay, paymentMethod);
    triggerSaleConfetti();
    onClose();
  };

  const debtReminderWa = generateWhatsAppLink(
    order.client_phone || '',
    'debt_reminder',
    order,
    businessSettings
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">Registrar Cobro</h2>
              <p className="text-xs text-stone-500">Pedido #{order.order_number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Details & Debt */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/70 mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Cliente:</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">{order.client_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Total Pedido:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Ya Abonado:</span>
            <span className="text-emerald-600 font-semibold">{formatCurrency(order.amount_paid)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 dark:border-stone-700 pt-1.5">
            <span className="font-bold text-rose-600">Saldo Pendiente:</span>
            <span className="font-black text-rose-600 text-sm">{formatCurrency(order.debt_amount)}</span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          
          {/* Pay Full vs Partial */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPayFull(true)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                payFull
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600'
              }`}
            >
              Cobro Total ({formatCurrency(order.debt_amount)})
            </button>
            <button
              type="button"
              onClick={() => setPayFull(false)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                !payFull
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600'
              }`}
            >
              Monto Parcial
            </button>
          </div>

          {!payFull && (
            <div>
              <span className="text-[11px] text-stone-500 mb-1 block">Monto a cobrar ahora ($)</span>
              <input
                type="number"
                max={order.debt_amount}
                min={1}
                required
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <span className="text-[11px] text-stone-500 mb-1 block font-semibold">Medio de Cobro</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border ${
                  paymentMethod === 'transfer'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                📱 MP / Transf
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border ${
                  paymentMethod === 'cash'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                💵 Efectivo
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                💳 Tarjeta
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Cobro • {formatCurrency(amountToPay)}</span>
            </button>

            {order.client_phone && (
              <a
                href={debtReminderWa}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar recordatorio de cobro por WhatsApp</span>
              </a>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
