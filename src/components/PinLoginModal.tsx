import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Delete, UserCheck, ShieldCheck } from 'lucide-react';

interface PinLoginModalProps {
  profiles: UserProfile[];
  activeUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  onClose?: () => void;
  isMandatory?: boolean;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({
  profiles,
  activeUser,
  onSelectUser,
  onClose,
  isMandatory = false,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(activeUser || profiles[0] || null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError(false);

      if (next.length === 4 && selectedProfile) {
        if (selectedProfile.pin === next || next === '1234') {
          onSelectUser(selectedProfile);
          if (onClose) onClose();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800 text-center">
        
        {/* Header */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">
          ¿Quién está usando la app?
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
          Elegí tu perfil e ingresá tu PIN de 4 dígitos
        </p>

        {/* Profile Switcher */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {profiles.map((p) => {
            const isSelected = selectedProfile?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedProfile(p);
                  setPin('');
                  setError(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm ring-2 ring-brand-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm"
                  style={{ backgroundColor: p.avatarColor || '#F97316' }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm text-stone-800 dark:text-stone-100 truncate">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {p.role === 'owner' ? 'Titular' : 'Socia'}
                  </span>
                </div>
                {isSelected && <UserCheck className="w-4 h-4 text-brand-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex justify-center items-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 animate-bounce'
                    : filled
                    ? 'bg-brand-500 scale-110 shadow-glow'
                    : 'bg-stone-200 dark:bg-stone-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-500 mb-3 animate-shake">
            PIN incorrecto. (Por defecto: 1234)
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num.toString())}
              className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 font-bold text-xl text-stone-800 dark:text-stone-100 transition-all shadow-sm flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          {/* Empty spacer or quick fill */}
          <div className="flex items-center justify-center text-[10px] text-stone-400 font-mono">
            PIN: 1234
          </div>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 font-bold text-xl text-stone-800 dark:text-stone-100 transition-all shadow-sm flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 text-stone-600 dark:text-stone-300 transition-all shadow-sm flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {!isMandatory && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 py-1"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};
