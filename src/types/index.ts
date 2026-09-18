export type UserProfile = {
  id: string;
  name: string;
  pin: string;
  avatarColor: string;
  role: 'owner' | 'partner';
};

export type Flavor = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  color: string; // Hex for badge
  category?: string;
  created_at: string;
};

export type StockType = 'ready_tarta' | 'packaging' | 'supply';

export type StockItem = {
  id: string;
  type: StockType;
  name: string;
  flavor_id?: string;
  quantity: number;
  min_threshold: number; // For low stock alert
  unit: string; // 'unidades', 'cajas', 'kg', etc.
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  total_orders: number;
  total_spent: number;
  favorite_flavor_ids: string[];
  last_order_date?: string;
  debt: number; // Outstanding balance
  created_at: string;
};

export type OrderItem = {
  id: string;
  flavor_id: string;
  flavor_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type PaymentStatus = 'paid' | 'pending' | 'partial';
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'other';
export type DeliveryStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  order_number: number;
  client_id?: string;
  client_name: string;
  client_phone?: string;
  items: OrderItem[];
  total: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  amount_paid: number;
  debt_amount: number;
  delivery_status: DeliveryStatus;
  delivery_date: string; // YYYY-MM-DD
  delivery_time?: string; // HH:mm
  delivery_address?: string;
  notes?: string;
  created_by: string; // user name or id
  created_at: string;
};

export type ExpenseCategory = 'insumos' | 'packaging' | 'servicios' | 'equipamiento' | 'otros';

export type Expense = {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  payment_method: PaymentMethod;
  created_by: string;
  created_at: string;
};

export type BusinessSettings = {
  businessName: string;
  businessPhone: string;
  paymentAlias: string;
  paymentCbu?: string;
  currencySymbol: string;
  standardPrice: number; // Single standard price for all savory pies
  enableSound: boolean;
  lowStockAlert: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};
