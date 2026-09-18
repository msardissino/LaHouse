import { UserProfile, Flavor, StockItem, Client, Order, Expense, BusinessSettings } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Marcos',
    pin: '1420',
    avatarColor: '#1B4332',
    role: 'owner'
  },
  {
    id: 'user-2',
    name: 'Daniela',
    pin: '1420',
    avatarColor: '#D97706',
    role: 'partner'
  }
];

export const INITIAL_SETTINGS: BusinessSettings = {
  businessName: 'La House - Tartas Caseras',
  businessPhone: '5491123456789',
  paymentAlias: 'lahouse.tartas.mp',
  paymentCbu: '0000003100012345678901',
  currencySymbol: '$',
  standardPrice: 9000,
  enableSound: true,
  lowStockAlert: true,
};

export const INITIAL_FLAVORS: Flavor[] = [
  {
    id: 'fl-1',
    name: 'Jamón y Queso',
    description: 'Abundante muzzarella fundida, jamón cocido seleccionado y masa casera hojaldrada.',
    price: 9000,
    active: true,
    color: '#E11D48',
    category: 'Clásicas',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-2',
    name: 'Cebolla y Queso (Fugazzeta)',
    description: 'Cebollas salteadas al dente, lluvia de orégano y mix de quesos cremosos.',
    price: 9000,
    active: true,
    color: '#D97706',
    category: 'Vegetarianas',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-3',
    name: 'Calabaza y Queso',
    description: 'Puré de calabaza asada bien condimentada con corazón de queso cremoso derretido.',
    price: 9000,
    active: true,
    color: '#F97316',
    category: 'Vegetarianas',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-4',
    name: 'Calabaza y Cebollita Caramelizada',
    description: 'Calabaza dulce asada al horno combinada con cebollitas caramelizadas y queso.',
    price: 9000,
    active: true,
    color: '#CA8A04',
    category: 'Especiales',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-5',
    name: 'Verduras Asadas',
    description: 'Mix de morrones, zucchini, berenjena y cebolla braseadas con hierbas aromáticas.',
    price: 9000,
    active: true,
    color: '#15803D',
    category: 'Vegetarianas',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-6',
    name: 'Pollo y Puerro',
    description: 'Pechuga de pollo desmenuzada jugosa con puerros confitados a la crema.',
    price: 9000,
    active: true,
    color: '#10B981',
    category: 'Pollo',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-7',
    name: 'Pollo y Roquefort',
    description: 'Pollo braseado con intenso queso azul roquefort fundido y muzzarella.',
    price: 9000,
    active: true,
    color: '#2563EB',
    category: 'Pollo',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-8',
    name: 'Pollo y Cebollita Caramelizada',
    description: 'Suprema de pollo sazonada con toque dulce de cebollas caramelizadas y queso.',
    price: 9000,
    active: true,
    color: '#B45309',
    category: 'Pollo',
    created_at: new Date().toISOString()
  },
  {
    id: 'fl-9',
    name: 'Brócoli y Queso',
    description: 'Brócoli fresco al vapor, salsa blanca casera con nuez moscada y queso gratinado.',
    price: 9000,
    active: true,
    color: '#166534',
    category: 'Vegetarianas',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'st-1',
    type: 'ready_tarta',
    name: 'Jamón y Queso (Frizada)',
    flavor_id: 'fl-1',
    quantity: 4,
    min_threshold: 2,
    unit: 'tartas',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-2',
    type: 'ready_tarta',
    name: 'Pollo y Puerro (Frizada)',
    flavor_id: 'fl-6',
    quantity: 3,
    min_threshold: 2,
    unit: 'tartas',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-3',
    type: 'ready_tarta',
    name: 'Calabaza y Cebollita Caramelizada (Frizada)',
    flavor_id: 'fl-4',
    quantity: 2,
    min_threshold: 2,
    unit: 'tartas',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-4',
    type: 'ready_tarta',
    name: 'Verduras Asadas (Frizada)',
    flavor_id: 'fl-5',
    quantity: 2,
    min_threshold: 1,
    unit: 'tartas',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-5',
    type: 'packaging',
    name: 'Cajas de Tarta / Termosellado',
    quantity: 25,
    min_threshold: 10,
    unit: 'cajas',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-6',
    type: 'packaging',
    name: 'Bases de Cartón / Bandejas',
    quantity: 20,
    min_threshold: 10,
    unit: 'bases',
    updated_at: new Date().toISOString()
  },
  {
    id: 'st-7',
    type: 'packaging',
    name: 'Bolsas y Etiquetas con Instrucciones',
    quantity: 35,
    min_threshold: 15,
    unit: 'etiquetas',
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Camila Rodriguez',
    phone: '5491155443322',
    address: 'Av. Libertador 4520, 4to B',
    notes: 'Pide siempre de a 2 para tener en el freezer para la semana.',
    total_orders: 4,
    total_spent: 36000,
    favorite_flavor_ids: ['fl-6', 'fl-1'],
    last_order_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    debt: 0,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cli-2',
    name: 'Martín Gomez',
    phone: '5491166778899',
    address: 'Calle Olazábal 2340',
    notes: 'Fan de la de Pollo y Roquefort. Suele pagar por transferencia.',
    total_orders: 3,
    total_spent: 27000,
    favorite_flavor_ids: ['fl-7'],
    last_order_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    debt: 9000, // Debe 1 tarta de $9000
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cli-3',
    name: 'Lucía Fernández',
    phone: '5491144332211',
    address: 'Juramento 1900, PB 1',
    notes: 'Pide las vegetarianas (Calabaza caramelizada y Brócoli).',
    total_orders: 5,
    total_spent: 45000,
    favorite_flavor_ids: ['fl-4', 'fl-9'],
    last_order_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    debt: 0,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cli-4',
    name: 'Esteban Rossi',
    phone: '5491199887766',
    address: 'Av. Cabildo 3100',
    notes: 'Pide para los almuerzos de la oficina.',
    total_orders: 3,
    total_spent: 27000,
    favorite_flavor_ids: ['fl-1', 'fl-8'],
    last_order_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    debt: 0,
    created_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 101,
    client_id: 'cli-1',
    client_name: 'Camila Rodriguez',
    client_phone: '5491155443322',
    items: [
      {
        id: 'item-1',
        flavor_id: 'fl-6',
        flavor_name: 'Pollo y Puerro',
        quantity: 1,
        unit_price: 9000,
        subtotal: 9000
      },
      {
        id: 'item-2',
        flavor_id: 'fl-1',
        flavor_name: 'Jamón y Queso',
        quantity: 1,
        unit_price: 9000,
        subtotal: 9000
      }
    ],
    total: 18000,
    payment_status: 'paid',
    payment_method: 'transfer',
    amount_paid: 18000,
    debt_amount: 0,
    delivery_status: 'ready',
    delivery_date: todayStr,
    delivery_time: '18:30',
    delivery_address: 'Av. Libertador 4520, 4to B',
    notes: 'Entregar frizadas con etiquetas.',
    created_by: 'Marcos',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-102',
    order_number: 102,
    client_id: 'cli-2',
    client_name: 'Martín Gomez',
    client_phone: '5491166778899',
    items: [
      {
        id: 'item-3',
        flavor_id: 'fl-7',
        flavor_name: 'Pollo y Roquefort',
        quantity: 1,
        unit_price: 9000,
        subtotal: 9000
      }
    ],
    total: 9000,
    payment_status: 'pending',
    payment_method: 'cash',
    amount_paid: 0,
    debt_amount: 9000,
    delivery_status: 'preparing',
    delivery_date: todayStr,
    delivery_time: '19:00',
    delivery_address: 'Retira por taller',
    notes: 'Pasa a retirar por la tarde con conservadora.',
    created_by: 'Daniela',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-103',
    order_number: 103,
    client_id: 'cli-3',
    client_name: 'Lucía Fernández',
    client_phone: '5491144332211',
    items: [
      {
        id: 'item-4',
        flavor_id: 'fl-4',
        flavor_name: 'Calabaza y Cebollita Caramelizada',
        quantity: 1,
        unit_price: 9000,
        subtotal: 9000
      },
      {
        id: 'item-5',
        flavor_id: 'fl-9',
        flavor_name: 'Brócoli y Queso',
        quantity: 1,
        unit_price: 9000,
        subtotal: 9000
      }
    ],
    total: 18000,
    payment_status: 'partial',
    payment_method: 'transfer',
    amount_paid: 10000,
    debt_amount: 8000,
    delivery_status: 'pending',
    delivery_date: tomorrowStr,
    delivery_time: '15:00',
    delivery_address: 'Juramento 1900, PB 1',
    notes: 'Dejó $10.000 de seña por MP. Resta saldo al entregar.',
    created_by: 'Marcos',
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'packaging',
    description: 'Compra 50 Cajas para freezer + 100 Separadores / Film',
    amount: 19500,
    date: todayStr,
    payment_method: 'transfer',
    created_by: 'Marcos',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'exp-2',
    category: 'insumos',
    description: '5kg Pechuga de pollo fresca + 3kg Muzzarella + 2kg Jamón cocido',
    amount: 32000,
    date: todayStr,
    payment_method: 'cash',
    created_by: 'Daniela',
    created_at: new Date().toISOString()
  }
];
