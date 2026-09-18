import React from 'react';
import { UserProfile } from '../types';
import { Moon, Sun, AlertTriangle, Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeUser: UserProfile | null;
  onOpenProfileModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  hasLowStock: boolean;
  onOpenLowStock: () => void;
  isCloudSync: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  onOpenProfileModal,
  isDarkMode,
  onToggleDarkMode,
  hasLowStock,
  onOpenLowStock,
  isCloudSync,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <span className="text-xl font-black">🥧</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-stone-900 dark:text-white leading-none">
                La House
              </h1>
              <span className="inline-block w-2 h-2 rounded-full bg-brand-500"></span>
            </div>
            <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase flex items-center gap-1">
              Tartas Caseras • Frizadas ❄️
            </p>
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Low Stock Warning Button */}
          {hasLowStock && (
            <button
              onClick={onOpenLowStock}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold animate-pulse border border-amber-300 dark:border-amber-800"
              title="Stock bajo detectado"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Stock Bajo</span>
            </button>
          )}

          {/* Cloud Sync Status Indicator */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            title={isCloudSync ? 'Sincronizado con Supabase en la nube' : 'Modo almacenamiento local'}
          >
            {isCloudSync ? (
              <Cloud className="w-4 h-4 text-emerald-500" />
            ) : (
              <CloudOff className="w-4 h-4 text-stone-400" />
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* User Profile Switcher */}
          {activeUser && (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700/60 transition-all active:scale-95"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: activeUser.avatarColor || '#F97316' }}
              >
                {activeUser.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {activeUser.name}
              </span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
