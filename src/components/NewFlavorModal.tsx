import React, { useState } from 'react';
import { Flavor } from '../types';
import { X, Sparkles, Tag, DollarSign, Palette } from 'lucide-react';

interface NewFlavorModalProps {
  flavor?: Flavor | null;
  onClose: () => void;
  onSubmit: (flavorData: any) => void;
}

const COLOR_PALETTE = [
  '#EAB308', // Lemon yellow
  '#E11D48', // Strawberry red
  '#78350F', // Chocolate dark
  '#D97706', // Caramel / DDL
  '#CA8A04', // Ricota gold
  '#15803D', // Apple green
  '#9333EA', // Berry purple
  '#0D9488', // Teal
  '#F97316', // Orange
  '#EC4899', // Pink
];

export const NewFlavorModal: React.FC<NewFlavorModalProps> = ({
  flavor,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(flavor?.name || '');
  const [description, setDescription] = useState(flavor?.description || '');
  const [price, setPrice] = useState(flavor ? flavor.price.toString() : '9500');
  const [color, setColor] = useState(flavor?.color || COLOR_PALETTE[0]);
  const [active, setActive] = useState(flavor ? flavor.active : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('Nombre y Precio son requeridos.');
      return;
    }

    onSubmit({
      ...(flavor ? { id: flavor.id, created_at: flavor.created_at } : {}),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      color,
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {flavor ? 'Editar Sabor' : 'Nuevo Sabor de Tarta'}
              </h2>
              <p className="text-xs text-stone-500">Catálogo de Sabores y Precios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Nombre del Sabor *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Lemon Pie Clásico"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-stone-400" />
              Precio de Venta ($) *
            </label>
            <input
              type="number"
              required
              min={0}
              step={100}
              placeholder="Ej: 9500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Descripción e Ingredientes
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Masa sableé crocante, crema de limón suave y merengue italiano..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            />
          </div>

          {/* Color tag */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-400" />
              Color identificador
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-stone-800 dark:ring-white shadow-md' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="flavor-active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="flavor-active" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Sabor activo para la venta
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 text-sm"
            >
              {flavor ? 'Guardar Cambios' : 'Crear Sabor'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
