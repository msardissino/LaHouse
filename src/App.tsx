import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import {
  UserProfile,
  Flavor,
  StockItem,
  Client,
  Order,
  Expense,
  BusinessSettings,
  DeliveryStatus,
  PaymentMethod
} from './types';

// Components
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { PinLoginModal } from './components/PinLoginModal';
import { NewOrderModal } from './components/NewOrderModal';
import { NewClientModal } from './components/NewClientModal';
import { ClientDetailModal } from './components/ClientDetailModal';
import { QuickPayModal } from './components/QuickPayModal';
import { NewFlavorModal } from './components/NewFlavorModal';
import { NewExpenseModal } from './components/NewExpenseModal';
import { NewPackagingModal } from './components/NewPackagingModal';

// Views
import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { StockView } from './views/StockView';
import { ClientsView } from './views/ClientsView';
import { FinanceView } from './views/FinanceView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

export function App() {
  // --- Global State ---
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<BusinessSettings>(db.getSettings());
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Navigation & Theme
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('lahouse_theme') === 'dark';
  });

  // --- Modal States ---
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false);
  const [showNewClientModal, setShowNewClientModal] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);
  const [showNewFlavorModal, setShowNewFlavorModal] = useState<boolean>(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState<boolean>(false);
  const [showNewPackagingModal, setShowNewPackagingModal] = useState<boolean>(false);
  const [quickPayOrder, setQuickPayOrder] = useState<Order | null>(null);

  // Load all initial data from DB
  const loadAllData = () => {
    const loadedProfiles = db.getProfiles();
    setProfiles(loadedProfiles);

    const savedUser = db.getActiveUser();
    if (savedUser) {
      setActiveUser(savedUser);
    } else if (loadedProfiles.length > 0) {
      // Default to first profile if not chosen
      setActiveUser(loadedProfiles[0]);
      db.setActiveUser(loadedProfiles[0]);
    }

    setSettings(db.getSettings());
    setFlavors(db.getFlavors());
    setStock(db.getStock());
    setClients(db.getClients());
    setOrders(db.getOrders());
    setExpenses(db.getExpenses());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lahouse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lahouse_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // --- Handlers ---
  const handleSelectUser = (user: UserProfile) => {
    setActiveUser(user);
    db.setActiveUser(user);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    db.updateProfile(updated);
    setProfiles(db.getProfiles());
    if (activeUser?.id === updated.id) {
      setActiveUser(updated);
    }
  };

  const handleSaveSettings = (newSettings: BusinessSettings) => {
    if (newSettings.standardPrice && newSettings.standardPrice !== settings.standardPrice) {
      db.updateStandardPrice(newSettings.standardPrice);
      setFlavors(db.getFlavors());
    } else {
      db.saveSettings(newSettings);
    }
    setSettings(newSettings);
  };

  const handleUpdateStandardPrice = (newPrice: number) => {
    db.updateStandardPrice(newPrice);
    setSettings(db.getSettings());
    setFlavors(db.getFlavors());
  };

  // Orders
  const handleCreateOrder = (orderData: any) => {
    const newOrder = db.createOrder(orderData);
    setOrders(db.getOrders());
    setStock(db.getStock());
    setClients(db.getClients());
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, status: DeliveryStatus) => {
    db.updateOrderStatus(orderId, status);
    setOrders(db.getOrders());
  };

  const handleConfirmPayment = (orderId: string, amount: number, method: PaymentMethod) => {
    db.registerOrderPayment(orderId, amount, method);
    setOrders(db.getOrders());
    setClients(db.getClients());
    if (selectedClientDetail) {
      const updatedCli = db.getClients().find((c) => c.id === selectedClientDetail.id);
      if (updatedCli) setSelectedClientDetail(updatedCli);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    db.deleteOrder(orderId);
    setOrders(db.getOrders());
    setClients(db.getClients());
  };

  // Stock & Flavors
  const handleUpdateStockQty = (itemId: string, delta: number) => {
    db.updateStockQuantity(itemId, delta);
    setStock(db.getStock());
  };

  const handleSetStockQty = (itemId: string, qty: number) => {
    db.setStockQuantity(itemId, qty);
    setStock(db.getStock());
  };

  const handleSaveFlavor = (flavorData: any) => {
    if (flavorData.id) {
      db.updateFlavor(flavorData);
    } else {
      db.addFlavor(flavorData);
    }
    setFlavors(db.getFlavors());
    setStock(db.getStock());
    setEditingFlavor(null);
  };

  const handleDeleteFlavor = (flavorId: string) => {
    db.deleteFlavor(flavorId);
    setFlavors(db.getFlavors());
  };

  const handleAddPackagingItem = (itemData: any) => {
    db.addStockItem(itemData);
    setStock(db.getStock());
  };

  // Clients
  const handleSaveClient = (clientData: any) => {
    if (editingClient) {
      db.updateClient({ ...editingClient, ...clientData });
      setEditingClient(null);
    } else {
      db.addClient(clientData);
    }
    setClients(db.getClients());
  };

  const handleAddClientDirectly = (clientData: any): Client => {
    const newClient = db.addClient(clientData);
    setClients(db.getClients());
    return newClient;
  };

  const handleDeleteClient = (clientId: string) => {
    db.deleteClient(clientId);
    setClients(db.getClients());
    setSelectedClientDetail(null);
  };

  // Expenses
  const handleAddExpense = (expenseData: any) => {
    db.addExpense(expenseData);
    setExpenses(db.getExpenses());
  };

  const handleDeleteExpense = (expenseId: string) => {
    db.deleteExpense(expenseId);
    setExpenses(db.getExpenses());
  };

  // Badges & Counters
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingOrdersToday = orders.filter(
    (o) => o.delivery_date === todayStr && o.delivery_status !== 'delivered' && o.delivery_status !== 'cancelled'
  ).length;

  const unpaidCount = orders.filter((o) => o.debt_amount > 0 && o.delivery_status !== 'cancelled').length;
  const hasLowStock = stock.some((s) => s.quantity <= s.min_threshold);

  return (
    <div className="min-h-screen bg-bakery-cream dark:bg-bakery-darkBg text-stone-900 dark:text-stone-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeUser={activeUser}
        onOpenProfileModal={() => setShowPinModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        hasLowStock={hasLowStock}
        onOpenLowStock={() => setCurrentTab('stock')}
        isCloudSync={db.isConnectedToSupabase()}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 pb-20">
        {currentTab === 'home' && (
          <DashboardView
            orders={orders}
            stock={stock}
            clients={clients}
            flavors={flavors}
            activeUser={activeUser}
            businessSettings={settings}
            onOpenNewOrder={() => setShowNewOrderModal(true)}
            onOpenNewExpense={() => setShowNewExpenseModal(true)}
            onSelectTab={setCurrentTab}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenQuickPay={setQuickPayOrder}
            onSelectClient={setSelectedClientDetail}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            clients={clients}
            businessSettings={settings}
            onOpenNewOrder={() => setShowNewOrderModal(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenQuickPay={setQuickPayOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {currentTab === 'stock' && (
          <StockView
            stock={stock}
            flavors={flavors}
            businessSettings={settings}
            onUpdateStockQty={handleUpdateStockQty}
            onSetStockQty={handleSetStockQty}
            onOpenNewFlavor={() => {
              setEditingFlavor(null);
              setShowNewFlavorModal(true);
            }}
            onEditFlavor={(flavor) => {
              setEditingFlavor(flavor);
              setShowNewFlavorModal(true);
            }}
            onDeleteFlavor={handleDeleteFlavor}
            onOpenNewPackagingItem={() => setShowNewPackagingModal(true)}
            onUpdateStandardPrice={handleUpdateStandardPrice}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            flavors={flavors}
            businessSettings={settings}
            onOpenNewClient={() => {
              setEditingClient(null);
              setShowNewClientModal(true);
            }}
            onSelectClient={setSelectedClientDetail}
          />
        )}

        {currentTab === 'finance' && (
          <FinanceView
            orders={orders}
            expenses={expenses}
            clients={clients}
            businessSettings={settings}
            onOpenNewExpense={() => setShowNewExpenseModal(true)}
            onOpenQuickPay={setQuickPayOrder}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            orders={orders}
            clients={clients}
            flavors={flavors}
            businessSettings={settings}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            profiles={profiles}
            onSaveSettings={handleSaveSettings}
            onUpdateProfile={handleUpdateProfile}
            onRefreshAllData={loadAllData}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewOrder={() => setShowNewOrderModal(true)}
        pendingOrdersCount={pendingOrdersToday}
        unpaidCount={unpaidCount}
      />

      {/* --- Modals & Overlays --- */}

      {/* PIN Login & User Switcher Modal */}
      {showPinModal && (
        <PinLoginModal
          profiles={profiles}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <NewOrderModal
          flavors={flavors}
          clients={clients}
          activeUser={activeUser}
          onClose={() => setShowNewOrderModal(false)}
          onSubmit={handleCreateOrder}
          businessSettings={settings}
          onAddClientDirectly={handleAddClientDirectly}
        />
      )}

      {/* New / Edit Client Modal */}
      {showNewClientModal && (
        <NewClientModal
          initialClient={editingClient}
          onClose={() => {
            setShowNewClientModal(false);
            setEditingClient(null);
          }}
          onSubmit={handleSaveClient}
        />
      )}

      {/* Client Detail Ficha Modal */}
      {selectedClientDetail && (
        <ClientDetailModal
          client={selectedClientDetail}
          orders={orders}
          flavors={flavors}
          businessSettings={settings}
          onClose={() => setSelectedClientDetail(null)}
          onEditClient={(c) => {
            setEditingClient(c);
            setShowNewClientModal(true);
          }}
          onDeleteClient={handleDeleteClient}
          onOpenQuickPay={setQuickPayOrder}
        />
      )}

      {/* Quick Pay Modal (Asentar Cobro) */}
      {quickPayOrder && (
        <QuickPayModal
          order={quickPayOrder}
          businessSettings={settings}
          onClose={() => setQuickPayOrder(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* New / Edit Flavor Modal */}
      {showNewFlavorModal && (
        <NewFlavorModal
          flavor={editingFlavor}
          onClose={() => {
            setShowNewFlavorModal(false);
            setEditingFlavor(null);
          }}
          onSubmit={handleSaveFlavor}
        />
      )}

      {/* New Expense Modal */}
      {showNewExpenseModal && (
        <NewExpenseModal
          activeUser={activeUser}
          onClose={() => setShowNewExpenseModal(false)}
          onSubmit={handleAddExpense}
        />
      )}

      {/* New Packaging Item Modal */}
      {showNewPackagingModal && (
        <NewPackagingModal
          onClose={() => setShowNewPackagingModal(false)}
          onSubmit={handleAddPackagingItem}
        />
      )}

    </div>
  );
}

export default App;
