import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import { Order, Client, Flavor, BusinessSettings } from '../types';

export const formatCurrency = (amount: number, symbol = '$'): string => {
  return `${symbol} ${Number(amount || 0).toLocaleString('es-AR')}`;
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return new Date(dateStr).toLocaleDateString('es-AR');
};

export const getRelativeDeliveryText = (dateStr: string, timeStr?: string): { text: string; color: string; isToday: boolean } => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let text = '';
  let color = 'text-stone-600 dark:text-stone-400';
  let isToday = false;

  if (dateStr === today) {
    text = `Hoy ${timeStr ? '• ' + timeStr + ' hs' : ''}`;
    color = 'text-amber-600 dark:text-amber-400 font-semibold';
    isToday = true;
  } else if (dateStr === tomorrow) {
    text = `Mañana ${timeStr ? '• ' + timeStr + ' hs' : ''}`;
    color = 'text-blue-600 dark:text-blue-400 font-medium';
  } else if (dateStr < today) {
    text = `Vencido (${formatDate(dateStr)})`;
    color = 'text-rose-600 dark:text-rose-400 font-semibold';
  } else {
    text = `${formatDate(dateStr)} ${timeStr ? '• ' + timeStr + ' hs' : ''}`;
  }

  return { text, color, isToday };
};

export const getDaysSince = (dateStr?: string): number => {
  if (!dateStr) return 999;
  const last = new Date(dateStr).getTime();
  const diff = Date.now() - last;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const triggerSaleConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#1B4332', '#2D6A4F', '#D97706', '#F59E0B', '#10B981']
  });
};

export const cleanPhoneForWhatsApp = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '');
};

// WhatsApp Message Generators
export const generateWhatsAppLink = (
  phone: string,
  type: 'confirmation' | 'ready' | 'debt_reminder',
  order: Order,
  settings: BusinessSettings
): string => {
  const cleanPhone = cleanPhoneForWhatsApp(phone || order.client_phone || '');
  if (!cleanPhone) return '#';

  const itemsText = order.items
    .map((i) => `  🥧 *${i.quantity}x* ${i.flavor_name} (${formatCurrency(i.subtotal)})`)
    .join('\n');

  let message = '';

  if (type === 'confirmation') {
    message = `¡Hola *${order.client_name}*! 👋 Muchas gracias por tu pedido en *${settings.businessName}* 🥧✨\n\n` +
      `📋 *Detalle del Pedido #${order.order_number}:*\n` +
      `${itemsText}\n\n` +
      `💰 *Total:* ${formatCurrency(order.total)}\n` +
      (order.amount_paid > 0 ? `✅ *Abonado / Seña:* ${formatCurrency(order.amount_paid)}\n` : '') +
      (order.debt_amount > 0 ? `⏳ *Resta abonar:* ${formatCurrency(order.debt_amount)}\n` : '') +
      `📅 *Fecha de entrega:* ${formatDate(order.delivery_date)} ${order.delivery_time ? 'a las ' + order.delivery_time + ' hs' : ''}\n` +
      (order.delivery_address ? `📍 *Entrega:* ${order.delivery_address}\n` : '') +
      (settings.paymentAlias ? `\n💳 *Alias para transferencia:* \`${settings.paymentAlias}\`\n` : '') +
      `\n❄️ *Recordá que se entregan frizadas, listas para el horno.*\n` +
      `¡Te avisamos apenas esté listo tu pedido! 🥰`;
  } else if (type === 'ready') {
    message = `¡Hola *${order.client_name}*! 🥧✨\n\n` +
      `🎉 ¡Tu pedido de tartas caseras en *${settings.businessName}* ya está *LISTO*!\n\n` +
      `${itemsText}\n\n` +
      (order.debt_amount > 0
        ? `💰 *Saldo pendiente a abonar:* ${formatCurrency(order.debt_amount)}\n` +
          (settings.paymentAlias ? `💳 *Alias:* \`${settings.paymentAlias}\`\n\n` : '')
        : `✅ *Estado:* Totalmente abonado\n\n`) +
      (order.delivery_address?.toLowerCase().includes('retira')
        ? `📍 Ya podés pasar a retirarlo cuando gustes. ¡Te esperamos!\n\n`
        : `🛵 Ya está preparado para el envío a *${order.delivery_address || 'tu domicilio'}*.\n\n`) +
      `❄️ *Modo de preparación:* Directo del freezer a horno precalentado a 180°-200° por 25 a 35 minutos hasta que la masa esté dorada y el queso gratinado. ¡A disfrutar! 😋`;
  } else if (type === 'debt_reminder') {
    message = `¡Hola *${order.client_name}*! 👋 ¿Cómo estás?\n\n` +
      `Te escribimos de *${settings.businessName}* para recordarte el saldo pendiente de tu pedido de tartas caseras:\n\n` +
      `🥧 *Total pendiente:* ${formatCurrency(order.debt_amount)}\n` +
      (settings.paymentAlias ? `💳 *Alias de MercadoPago:* \`${settings.paymentAlias}\`\n` : '') +
      (settings.paymentCbu ? `🏦 *CBU:* \`${settings.paymentCbu}\`\n` : '') +
      `\nUna vez realizada la transferencia, envíanos el comprobante por acá. ¡Muchas gracias! ❤️`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

// Excel Export Utility
export const exportDataToExcel = (
  orders: Order[],
  clients: Client[],
  flavors: Flavor[],
  businessName: string
) => {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Ventas / Pedidos
  const ordersData = orders.map((o) => ({
    'N° Pedido': o.order_number,
    'Fecha Pedido': formatDate(o.created_at),
    'Fecha Entrega': formatDate(o.delivery_date),
    'Hora': o.delivery_time || '-',
    'Cliente': o.client_name,
    'Teléfono': o.client_phone || '-',
    'Tartas / Sabores': o.items.map((i) => `${i.quantity}x ${i.flavor_name}`).join(', '),
    'Total ($)': o.total,
    'Abonado ($)': o.amount_paid,
    'Deuda ($)': o.debt_amount,
    'Estado Pago': o.payment_status === 'paid' ? 'Pagado' : o.payment_status === 'partial' ? 'Seña' : 'Pendiente',
    'Método Pago': o.payment_method || '-',
    'Estado Entrega': o.delivery_status,
    'Registrado Por': o.created_by
  }));
  const wsOrders = XLSX.utils.json_to_sheet(ordersData);
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Ventas');

  // 2. Sheet Clientes
  const clientsData = clients.map((c) => ({
    'Nombre': c.name,
    'Teléfono': c.phone,
    'Dirección': c.address || '-',
    'Total Pedidos': c.total_orders,
    'Total Gastado ($)': c.total_spent,
    'Deuda Actual ($)': c.debt,
    'Último Pedido': c.last_order_date ? formatDate(c.last_order_date) : 'Nunca',
    'Notas': c.notes || '-'
  }));
  const wsClients = XLSX.utils.json_to_sheet(clientsData);
  XLSX.utils.book_append_sheet(wb, wsClients, 'Clientes');

  // 3. Sheet Sabores
  const flavorsData = flavors.map((f) => ({
    'Sabor': f.name,
    'Precio ($)': f.price,
    'Estado': f.active ? 'Activo' : 'Pausado',
    'Descripción': f.description
  }));
  const wsFlavors = XLSX.utils.json_to_sheet(flavorsData);
  XLSX.utils.book_append_sheet(wb, wsFlavors, 'Sabores y Precios');

  // Download
  const filename = `${businessName.replace(/\s+/g, '_')}_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};
