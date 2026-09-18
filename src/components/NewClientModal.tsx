import React, { useState } from 'react';
import { Client } from '../types';
import { X, UserPlus, Phone, MapPin, FileText } from 'lucide-react';

interface NewClientModalProps {
  onClose: () => void;
  onSubmit: (clientData: any) => void;
  initialClient?: Client | null;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  onClose,
  onSubmit,
  initialClient,
}) => {
  const [name, setName] = useState(initialClient?.name || '');
  const [phone, setPhone] = useState(initialClient?.phone || '');
  const [address, setAddress] = useState(initialClient?.address || '');
  const [notes, setNotes] = useState(initialClient?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Nombre y Teléfono son requeridos.');
      return;
    }

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {initialClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-xs text-stone-500">Directorio de Clientes CRM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Nombre y Apellido *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Camila Rodriguez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              Teléfono / WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 5491155443322"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              Dirección de Entrega habitual
            </label>
            <input
              type="text"
              placeholder="Ej: Av. Libertador 4520, 4to B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              Notas y Preferencias
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Cumpleaños en mayo, pedir con merengue extra..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-95 text-sm"
            >
              {initialClient ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
