import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  Flavor,
  StockItem,
  Client,
  Order,
  Expense,
  BusinessSettings,
  PaymentStatus,
  DeliveryStatus
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_FLAVORS,
  INITIAL_STOCK,
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_SETTINGS
} from './initialData';

const STORAGE_KEYS = {
  PROFILES: 'lahouse_profiles',
  ACTIVE_USER: 'lahouse_active_user',
  FLAVORS: 'lahouse_flavors',
  STOCK: 'lahouse_stock',
  CLIENTS: 'lahouse_clients',
  ORDERS: 'lahouse_orders',
  EXPENSES: 'lahouse_expenses',
  SETTINGS: 'lahouse_settings',
  THEME: 'lahouse_theme',
};

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private isSupabaseConnected = false;

  constructor() {
    this.initSupabase();
  }

  public initSupabase(): boolean {
    const settings = this.getSettings();
    if (settings.supabaseUrl && settings.supabaseAnonKey) {
      try {
        this.supabase = createClient(settings.supabaseUrl, settings.supabaseAnonKey);
        this.isSupabaseConnected = true;
        return true;
      } catch (err) {
        console.error('Error connecting to Supabase:', err);
        this.isSupabaseConnected = false;
        return false;
      }
    }
    return false;
  }

  public isConnectedToSupabase(): boolean {
    return this.isSupabaseConnected;
  }

  // --- Profiles & Auth ---
  public getProfiles(): UserProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!data || data.includes('Tomás') || data.includes('1234')) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      this.setActiveUser(INITIAL_PROFILES[0]);
      return INITIAL_PROFILES;
    }
    return JSON.parse(data);
  }

  public saveProfiles(profiles: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  public getActiveUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (!data) return null;
    return JSON.parse(data);
  }

  public setActiveUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  }

  public verifyPin(userId: string, pin: string): boolean {
    const profiles = this.getProfiles();
    const user = profiles.find((p) => p.id === userId);
    return user ? user.pin === pin : false;
  }

  public updateProfile(updated: UserProfile): void {
    const profiles = this.getProfiles().map((p) => (p.id === updated.id ? updated : p));
    this.saveProfiles(profiles);
    const active = this.getActiveUser();
    if (active && active.id === updated.id) {
      this.setActiveUser(updated);
    }
  }

  // --- Settings ---
  public getSettings(): BusinessSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
  }

  public saveSettings(settings: BusinessSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.initSupabase();
  }

  public updateStandardPrice(newPrice: number): void {
    const settings = this.getSettings();
    settings.standardPrice = newPrice;
    this.saveSettings(settings);

    // Update all flavor prices
    const flavors = this.getFlavors().map((f) => ({
      ...f,
      price: newPrice,
    }));
    this.saveFlavors(flavors);
  }

  // --- Flavors ---
  public getFlavors(): Flavor[] {
    const data = localStorage.getItem(STORAGE_KEYS.FLAVORS);
    if (!data || data.includes('Lemon Pie') || data.includes('8900') || data.includes('9500')) {
      localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(INITIAL_FLAVORS));
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_FLAVORS;
    }
    return JSON.parse(data);
  }

  public saveFlavors(flavors: Flavor[]): void {
    localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(flavors));
  }

  public addFlavor(flavor: Omit<Flavor, 'id' | 'created_at'>): Flavor {
    const newFlavor: Flavor = {
      ...flavor,
      id: 'fl-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const flavors = [newFlavor, ...this.getFlavors()];
    this.saveFlavors(flavors);

    // Automatically create a ready_tarta stock item for this flavor
    this.addStockItem({
      type: 'ready_tarta',
      name: `${newFlavor.name} (Lista)`,
      flavor_id: newFlavor.id,
      quantity: 0,
      min_threshold: 2,
      unit: 'tartas',
      updated_at: new Date().toISOString()
    });

    return newFlavor;
  }

  public updateFlavor(updated: Flavor): void {
    const flavors = this.getFlavors().map((f) => (f.id === updated.id ? updated : f));
    this.saveFlavors(flavors);
  }

  public deleteFlavor(flavorId: string): void {
    const flavors = this.getFlavors().filter((f) => f.id !== flavorId);
    this.saveFlavors(flavors);
  }

  // --- Stock ---
  public getStock(): StockItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
      return INITIAL_STOCK;
    }
    return JSON.parse(data);
  }

  public saveStock(stock: StockItem[]): void {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  }

  public addStockItem(item: Omit<StockItem, 'id'>): StockItem {
    const newItem: StockItem = {
      ...item,
      id: 'st-' + Date.now()
    };
    const stock = [...this.getStock(), newItem];
    this.saveStock(stock);
    return newItem;
  }

  public updateStockQuantity(itemId: string, delta: number): StockItem | null {
    const stock = this.getStock();
    const item = stock.find((s) => s.id === itemId);
    if (!item) return null;

    item.quantity = Math.max(0, item.quantity + delta);
    item.updated_at = new Date().toISOString();
    this.saveStock(stock);
    return item;
  }

  public setStockQuantity(itemId: string, quantity: number): StockItem | null {
    const stock = this.getStock();
    const item = stock.find((s) => s.id === itemId);
    if (!item) return null;

    item.quantity = Math.max(0, quantity);
    item.updated_at = new Date().toISOString();
    this.saveStock(stock);
    return item;
  }

  public deleteStockItem(itemId: string): void {
    const stock = this.getStock().filter((s) => s.id !== itemId);
    this.saveStock(stock);
  }

  // --- Clients ---
  public getClients(): Client[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  }

  public saveClients(clients: Client[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  public addClient(clientData: Omit<Client, 'id' | 'total_orders' | 'total_spent' | 'favorite_flavor_ids' | 'debt' | 'created_at'>): Client {
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now(),
      total_orders: 0,
      total_spent: 0,
      favorite_flavor_ids: [],
      debt: 0,
      created_at: new Date().toISOString()
    };
    const clients = [newClient, ...this.getClients()];
    this.saveClients(clients);
    return newClient;
  }

  public updateClient(updated: Client): void {
    const clients = this.getClients().map((c) => (c.id === updated.id ? updated : c));
    this.saveClients(clients);
  }

  public deleteClient(clientId: string): void {
    const clients = this.getClients().filter((c) => c.id !== clientId);
    this.saveClients(clients);
  }

  // --- Orders & Sales ---
  public getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  }

  public saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  public createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Order {
    const orders = this.getOrders();
    const nextNumber = orders.length > 0 ? Math.max(...orders.map((o) => o.order_number || 100)) + 1 : 101;

    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      order_number: nextNumber,
      created_at: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    this.saveOrders(updatedOrders);

    // Update Client Stats & Debt if client_id exists
    if (newOrder.client_id) {
      this.recalculateClientStats(newOrder.client_id);
    }

    // Auto-decrement ready tarta stock and packaging (1 box + 1 base per pie)
    const stock = this.getStock();
    let totalPies = 0;

    newOrder.items.forEach((item) => {
      totalPies += item.quantity;
      const readyItem = stock.find((s) => s.flavor_id === item.flavor_id && s.type === 'ready_tarta');
      if (readyItem) {
        readyItem.quantity = Math.max(0, readyItem.quantity - item.quantity);
        readyItem.updated_at = new Date().toISOString();
      }
    });

    // Deduct packaging
    const boxItem = stock.find((s) => s.type === 'packaging' && s.name.toLowerCase().includes('caja'));
    if (boxItem) {
      boxItem.quantity = Math.max(0, boxItem.quantity - totalPies);
    }
    const baseItem = stock.find((s) => s.type === 'packaging' && s.name.toLowerCase().includes('base'));
    if (baseItem) {
      baseItem.quantity = Math.max(0, baseItem.quantity - totalPies);
    }

    this.saveStock(stock);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: DeliveryStatus): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.delivery_status = status;
    this.saveOrders(orders);
    return order;
  }

  public registerOrderPayment(orderId: string, amount: number, paymentMethod: any): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.amount_paid += amount;
    order.debt_amount = Math.max(0, order.total - order.amount_paid);
    if (order.debt_amount <= 0) {
      order.payment_status = 'paid';
    } else {
      order.payment_status = 'partial';
    }
    if (paymentMethod) {
      order.payment_method = paymentMethod;
    }

    this.saveOrders(orders);

    if (order.client_id) {
      this.recalculateClientStats(order.client_id);
    }

    return order;
  }

  public deleteOrder(orderId: string): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    const updated = orders.filter((o) => o.id !== orderId);
    this.saveOrders(updated);

    if (order?.client_id) {
      this.recalculateClientStats(order.client_id);
    }
  }

  public recalculateClientStats(clientId: string): void {
    const clients = this.getClients();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const clientOrders = this.getOrders().filter((o) => o.client_id === clientId && o.delivery_status !== 'cancelled');

    client.total_orders = clientOrders.length;
    client.total_spent = clientOrders.reduce((sum, o) => sum + o.total, 0);
    client.debt = clientOrders.reduce((sum, o) => sum + (o.debt_amount || 0), 0);

    if (clientOrders.length > 0) {
      const dates = clientOrders.map((o) => new Date(o.created_at).getTime());
      client.last_order_date = new Date(Math.max(...dates)).toISOString();

      // Find top favorite flavors
      const flavorCounts: Record<string, number> = {};
      clientOrders.forEach((o) => {
        o.items.forEach((item) => {
          flavorCounts[item.flavor_id] = (flavorCounts[item.flavor_id] || 0) + item.quantity;
        });
      });

      client.favorite_flavor_ids = Object.entries(flavorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([fid]) => fid);
    }

    this.saveClients(clients);
  }

  // --- Expenses ---
  public getExpenses(): Expense[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(data);
  }

  public saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  public addExpense(expenseData: Omit<Expense, 'id' | 'created_at'>): Expense {
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const expenses = [newExpense, ...this.getExpenses()];
    this.saveExpenses(expenses);
    return newExpense;
  }

  public deleteExpense(expenseId: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== expenseId);
    this.saveExpenses(expenses);
  }

  // --- Backups & Restore ---
  public exportFullBackup(): string {
    const backupData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      profiles: this.getProfiles(),
      settings: this.getSettings(),
      flavors: this.getFlavors(),
      stock: this.getStock(),
      clients: this.getClients(),
      orders: this.getOrders(),
      expenses: this.getExpenses()
    };
    return JSON.stringify(backupData, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.flavors) this.saveFlavors(data.flavors);
      if (data.stock) this.saveStock(data.stock);
      if (data.clients) this.saveClients(data.clients);
      if (data.orders) this.saveOrders(data.orders);
      if (data.expenses) this.saveExpenses(data.expenses);
      if (data.settings) this.saveSettings(data.settings);
      if (data.profiles) this.saveProfiles(data.profiles);
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  }

  public resetToDefault(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(INITIAL_FLAVORS));
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  }
}

export const db = new DatabaseService();
