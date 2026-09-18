import React, { useState } from 'react';
import { StockItem, Flavor, BusinessSettings } from '../types';
import { formatCurrency } from '../utils/helpers';
import {
  Package,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  Boxes,
  Edit2,
  Trash2,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

interface StockViewProps {
  stock: StockItem[];
  flavors: Flavor[];
  businessSettings: BusinessSettings;
  onUpdateStockQty: (itemId: string, delta: number) => void;
  onSetStockQty: (itemId: string, qty: number) => void;
  onOpenNewFlavor: () => void;
  onEditFlavor: (flavor: Flavor) => void;
  onDeleteFlavor: (flavorId: string) => void;
  onOpenNewPackagingItem: () => void;
  onUpdateStandardPrice: (price: number) => void;
}

type StockTab = 'ready_tartas' | 'flavors' | 'packaging';

export const StockView: React.FC<StockViewProps> = ({
  stock,
  flavors,
  businessSettings,
  onUpdateStockQty,
  onSetStockQty,
  onOpenNewFlavor,
  onEditFlavor,
  onDeleteFlavor,
  onOpenNewPackagingItem,
  onUpdateStandardPrice,
}) => {
  const [activeTab, setActiveTab] = useState<StockTab>('ready_tartas');
  const [isEditingGlobalPrice, setIsEditingGlobalPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(businessSettings.standardPrice?.toString() || '9000');

  const readyTartas = stock.filter((s) => s.type === 'ready_tarta');
  const packagingItems = stock.filter((s) => s.type === 'packaging' || s.type === 'supply');

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            Stock & Sabores
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Tartas elaboradas, lista de precios y packaging
          </p>
        </div>

        {activeTab === 'flavors' ? (
          <button
            onClick={onOpenNewFlavor}
            className="py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Sabor</span>
          </button>
        ) : (
          <button
            onClick={onOpenNewPackagingItem}
            className="py-2.5 px-4 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ítem Stock</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('ready_tartas')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ready_tartas'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <span>🥧 Tartas Listas</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {readyTartas.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('flavors')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'flavors'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sabores y Precios ({flavors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packaging')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'packaging'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Packaging / Cajas</span>
        </button>
      </div>

      {/* Tab 1: Ready-made Tartas */}
      {activeTab === 'ready_tartas' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200">
            🥧 <strong>Tartas listas para entrega inmediata:</strong> Sumá stock cuando termines de cocinar para tener disponible para clientes que piden en el día.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {readyTartas.map((item) => {
              const flavor = flavors.find((f) => f.id === item.flavor_id);
              const isLow = item.quantity <= item.min_threshold;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl bg-white dark:bg-stone-900 border transition-all shadow-soft flex items-center justify-between ${
                    isLow
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30'
                      : 'border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: flavor?.color || '#F97316' }}
                    >
                      🥧
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-stone-900 dark:text-white truncate">
                        {item.name.replace('(Lista)', '').trim()}
                      </p>
                      <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {flavor ? formatCurrency(flavor.price) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateStockQty(item.id, -1)}
                      disabled={item.quantity === 0}
                      className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 disabled:opacity-30 active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-black text-lg text-stone-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => onUpdateStockQty(item.id, 1)}
                      className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Flavors & Prices Catalog */}
      {activeTab === 'flavors' && (
        <div className="space-y-4">
          
          {/* Global Single Price Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-amber-500/10 border border-emerald-500/30 dark:border-emerald-500/20 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20">
                🏷️
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Precio Único de Tartas: <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(businessSettings.standardPrice || 9000)}</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Todas las tartas saladas tienen el mismo valor estándar.
                </p>
              </div>
            </div>

            {isEditingGlobalPrice ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-emerald-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-xs outline-none"
                  placeholder="9000"
                />
                <button
                  type="button"
                  onClick={() => {
                    const num = parseFloat(tempPrice);
                    if (num > 0) {
                      onUpdateStandardPrice(num);
                      setIsEditingGlobalPrice(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingGlobalPrice(false)}
                  className="px-2.5 py-1.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs rounded-xl"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempPrice(businessSettings.standardPrice?.toString() || '9000');
                  setIsEditingGlobalPrice(true);
                }}
                className="py-2 px-3.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-xs rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm transition-all shrink-0 active:scale-95"
              >
                Cambiar Precio General
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flavors.map((flavor) => (
              <div
                key={flavor.id}
                className={`p-4 rounded-3xl bg-white dark:bg-stone-900 border shadow-soft transition-all space-y-2.5 ${
                  flavor.active
                    ? 'border-stone-200/80 dark:border-stone-800'
                    : 'border-stone-200 dark:border-stone-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: flavor.color }}
                    />
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                        {flavor.name}
                      </h4>
                      <p className="text-xs font-black text-brand-600 dark:text-brand-400">
                        {formatCurrency(flavor.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditFlavor(flavor)}
                      className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                      title="Editar precio y datos"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el sabor ${flavor.name}?`)) {
                          onDeleteFlavor(flavor.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                      title="Eliminar sabor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {flavor.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {flavor.description}
                  </p>
                )}

                <div className="pt-1 flex items-center justify-between text-[11px] border-t border-stone-100 dark:border-stone-800">
                  <span className={flavor.active ? 'text-emerald-600 font-semibold' : 'text-stone-400'}>
                    {flavor.active ? '● Activo en menú' : '○ Pausado'}
                  </span>
                  <span className="text-stone-400">Tamaño único estándar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Packaging & Supplies */}
      {activeTab === 'packaging' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300">
            📦 El stock de cajas y bases se descuenta automáticamente con cada pedido registrado.
          </div>

          <div className="space-y-2.5">
            {packagingItems.map((item) => {
              const isLow = item.quantity <= item.min_threshold;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl bg-white dark:bg-stone-900 border shadow-soft flex items-center justify-between ${
                    isLow
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20'
                      : 'border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {item.name}
                      </h4>
                      {isLow && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Stock Bajo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Mínimo deseado: {item.min_threshold} {item.unit}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateStockQty(item.id, -1)}
                      disabled={item.quantity === 0}
                      className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 disabled:opacity-30 active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-10 text-center font-black text-base text-stone-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => onUpdateStockQty(item.id, 1)}
                      className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
