import React, { useState } from 'react';
import {
  Flavor,
  Client,
  OrderItem,
  PaymentStatus,
  PaymentMethod,
  UserProfile,
  Order
} from '../types';
import { formatCurrency, triggerSaleConfetti, generateWhatsAppLink } from '../utils/helpers';
import {
  X,
  Plus,
  Minus,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  FileText,
  DollarSign,
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface NewOrderModalProps {
  flavors: Flavor[];
  clients: Client[];
  activeUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (orderData: any) => Order;
  businessSettings: any;
  onAddClientDirectly?: (client: any) => Client;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  flavors,
  clients,
  activeUser,
  onClose,
  onSubmit,
  businessSettings,
  onAddClientDirectly,
}) => {
  // Client selection
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Retira por taller');

  // Flavors / Items in cart
  const [cart, setCart] = useState<Record<string, number>>({});

  // Date & Time
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState<string>(todayStr);
  const [deliveryTime, setDeliveryTime] = useState<string>('18:00');

  // Payment
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [customPaidAmount, setCustomPaidAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Created Order Success State for instant WhatsApp send
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Filter clients
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch)
  );

  const handleSelectExistingClient = (client: Client) => {
    setSelectedClientId(client.id);
    setClientName(client.name);
    setClientPhone(client.phone);
    if (client.address) setDeliveryAddress(client.address);
    setClientSearch('');
  };

  const handleQuantityChange = (flavorId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[flavorId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[flavorId];
      } else {
        updated[flavorId] = next;
      }
      return updated;
    });
  };

  // Calculate totals
  const activeFlavors = flavors.filter((f) => f.active);
  const orderItems: OrderItem[] = Object.entries(cart).map(([flavorId, qty]) => {
    const fl = flavors.find((f) => f.id === flavorId);
    const unitPrice = fl ? fl.price : 0;
    return {
      id: 'item-' + flavorId,
      flavor_id: flavorId,
      flavor_name: fl ? fl.name : 'Tarta',
      quantity: qty,
      unit_price: unitPrice,
      subtotal: unitPrice * qty,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  let amountPaid = total;
  let debtAmount = 0;

  if (paymentStatus === 'pending') {
    amountPaid = 0;
    debtAmount = total;
  } else if (paymentStatus === 'partial') {
    const custom = parseFloat(customPaidAmount) || 0;
    amountPaid = Math.min(total, custom);
    debtAmount = Math.max(0, total - amountPaid);
  } else {
    amountPaid = total;
    debtAmount = 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Por favor sumá al menos 1 tarta al pedido.');
      return;
    }
    if (!clientName.trim()) {
      alert('Por favor ingresá el nombre del cliente.');
      return;
    }

    // If client is new, create client
    let finalClientId = selectedClientId;
    if (!finalClientId && onAddClientDirectly && clientPhone.trim()) {
      const newCli = onAddClientDirectly({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        address: deliveryAddress !== 'Retira por taller' ? deliveryAddress : '',
        notes: notes,
      });
      finalClientId = newCli.id;
    }

    const orderPayload = {
      client_id: finalClientId || undefined,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      items: orderItems,
      total,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      debt_amount: debtAmount,
      delivery_status: 'pending',
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      delivery_address: deliveryAddress,
      notes: notes.trim(),
      created_by: activeUser?.name || 'Vendedor',
    };

    const newOrder = onSubmit(orderPayload);
    triggerSaleConfetti();
    setCreatedOrder(newOrder);
  };

  // If order was created, show quick success & WhatsApp screen
  if (createdOrder) {
    const waLink = generateWhatsAppLink(
      createdOrder.client_phone || '',
      'confirmation',
      createdOrder,
      businessSettings
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
        <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-1">
            ¡Venta Registrada! 🎉
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
            Pedido #{createdOrder.order_number} de <span className="font-bold text-stone-800 dark:text-stone-200">{createdOrder.client_name}</span> por <span className="font-bold text-brand-600">{formatCurrency(createdOrder.total)}</span>
          </p>

          <div className="space-y-3 mb-6">
            {createdOrder.client_phone ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span>Enviar Comprobante por WhatsApp</span>
              </a>
            ) : (
              <p className="text-xs text-stone-400 italic">
                (No se ingresó teléfono de WhatsApp para este cliente)
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-2xl font-semibold text-sm transition-all"
            >
              Listo / Volver a la App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">Nueva Venta</h2>
              <p className="text-[11px] text-stone-500">Registrador por: {activeUser?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Step 1: Cliente */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-500" />
              1. Datos del Cliente
            </label>

            {/* Quick search existing */}
            {!selectedClientId ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Buscar cliente existente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />

                {clientSearch && filteredClients.length > 0 && (
                  <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl max-h-36 overflow-y-auto divide-y divide-stone-200/50 dark:divide-stone-700/50">
                    {filteredClients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectExistingClient(c)}
                        className="w-full text-left px-3 py-2 text-xs flex justify-between items-center hover:bg-brand-50 dark:hover:bg-brand-950/40"
                      >
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{c.name}</span>
                        <span className="text-stone-400">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / Tel (Ej: 1155443322)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                <div>
                  <div className="font-bold text-sm text-stone-800 dark:text-stone-100">{clientName}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">{clientPhone || 'Sin teléfono'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClientId('');
                    setClientName('');
                    setClientPhone('');
                  }}
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Sabores y Cantidades */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🥧</span>
                2. Selección de Sabores
              </label>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {orderItems.reduce((sum, i) => sum + i.quantity, 0)} tartas elegidas
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeFlavors.map((flavor) => {
                const qty = cart[flavor.id] || 0;
                return (
                  <div
                    key={flavor.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      qty > 0
                        ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: flavor.color || '#F97316' }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                          {flavor.name}
                        </p>
                        <p className="text-xs font-bold text-brand-600 dark:text-brand-400">
                          {formatCurrency(flavor.price)}
                        </p>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(flavor.id, -1)}
                        disabled={qty === 0}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          qty === 0
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-300 cursor-not-allowed'
                            : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-white shadow-sm hover:bg-rose-50 hover:text-rose-600'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-6 text-center font-bold text-sm text-stone-800 dark:text-stone-100">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(flavor.id, 1)}
                        className="w-8 h-8 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-sm transition-transform active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Entrega y Horario */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-500" />
              3. Fecha y Lugar de Entrega
            </label>

            {/* Quick date chips */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setDeliveryDate(todayStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  deliveryDate === todayStr
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setDeliveryDate(tomorrowStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  deliveryDate === tomorrowStr
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                Mañana
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <span className="text-[11px] text-stone-500 mb-1 block">Fecha</span>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 mb-1 block">Hora Estimada</span>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-stone-500 mb-1 block">Dirección o Modalidad</span>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ej: Retira por taller / Av. Libertador 4520"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Step 4: Estado de Pago y Método */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-500" />
              4. Cobro y Forma de Pago
            </label>

            {/* Payment status selector */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  paymentStatus === 'paid'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                ✅ Pagado
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('partial')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  paymentStatus === 'partial'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                ⏳ Seña / Parcial
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('pending')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  paymentStatus === 'pending'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                ❌ Pendiente (Fiado)
              </button>
            </div>

            {paymentStatus === 'partial' && (
              <div className="mb-3">
                <span className="text-[11px] text-stone-500 mb-1 block">Monto abonado como seña ($)</span>
                <input
                  type="number"
                  placeholder="Ej: 5000"
                  value={customPaidAmount}
                  onChange={(e) => setCustomPaidAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            )}

            {/* Payment Method */}
            {paymentStatus !== 'pending' && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                    paymentMethod === 'transfer'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  📱 MP / Transf.
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
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
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                    paymentMethod === 'card'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  💳 Tarjeta
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-400" />
              Notas o Dedicatoria
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Cartelito de feliz cumple, sin nueces, etc."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          {/* Order Summary Box */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
              <span>Total Pedido:</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span>Abonado hoy:</span>
              <span className="font-bold">{formatCurrency(amountPaid)}</span>
            </div>
            {debtAmount > 0 && (
              <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold border-t border-stone-200 dark:border-stone-700 pt-1.5">
                <span>Resta cobrar (Deuda):</span>
                <span>{formatCurrency(debtAmount)}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={orderItems.length === 0}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
                orderItems.length === 0
                  ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white shadow-brand-500/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <span>Confirmar Venta • {formatCurrency(total)}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
