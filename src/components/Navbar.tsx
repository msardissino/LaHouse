import React from 'react';
import {
  Home,
  CalendarDays,
  PlusCircle,
  Package,
  Users,
  Wallet,
  BarChart3,
  Settings
} from 'lucide-react';

export type TabType = 'home' | 'orders' | 'stock' | 'clients' | 'finance' | 'analytics' | 'settings';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewOrder: () => void;
  pendingOrdersCount: number;
  unpaidCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewOrder,
  pendingOrdersCount,
  unpaidCount,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Inicio', icon: Home },
    { id: 'orders' as TabType, label: 'Agenda', icon: CalendarDays, badge: pendingOrdersCount },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
    { id: 'clients' as TabType, label: 'Clientes', icon: Users },
    { id: 'finance' as TabType, label: 'Caja', icon: Wallet, badge: unpaidCount },
    { id: 'analytics' as TabType, label: 'Métricas', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Floating Action Button (Nueva Venta) on mobile */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={onOpenNewOrder}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white rounded-full font-bold shadow-lg shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Nueva Venta</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-5xl mx-auto flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
