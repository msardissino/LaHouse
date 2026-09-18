import React, { useState } from 'react';
import { BusinessSettings, UserProfile } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../services/supabaseSchema';
import { db } from '../services/db';
import {
  Settings,
  Cloud,
  Database,
  Copy,
  Check,
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Phone,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface SettingsViewProps {
  settings: BusinessSettings;
  profiles: UserProfile[];
  onSaveSettings: (settings: BusinessSettings) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onRefreshAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  profiles,
  onSaveSettings,
  onUpdateProfile,
  onRefreshAllData,
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Profile PIN edit state
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [tempPin, setTempPin] = useState('');
  const [tempName, setTempName] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadBackup = () => {
    const json = db.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LaHouse_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text && db.importBackup(text)) {
        alert('¡Respaldo importado correctamente!');
        onRefreshAllData();
      } else {
        alert('Error al leer el archivo de respaldo.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('¿Estás seguro de restablecer los datos de ejemplo iniciales?')) {
      db.resetToDefault();
      onRefreshAllData();
      alert('Datos restablecidos con éxito.');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-500" />
          Ajustes & Sincronización
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Configuración de negocio, nube Supabase, PINs y respaldos
        </p>
      </div>

      {/* Business Info Form */}
      <form onSubmit={handleSaveSettings} className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          Datos del Emprendimiento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Nombre del Negocio
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-400" />
              Teléfono / WhatsApp Oficial
            </label>
            <input
              type="tel"
              placeholder="Ej: 5491123456789"
              value={formData.businessPhone}
              onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Alias de Cobro (MercadoPago / Banco)
            </label>
            <input
              type="text"
              placeholder="Ej: lahouse.tartas.mp"
              value={formData.paymentAlias}
              onChange={(e) => setFormData({ ...formData, paymentAlias: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              CBU / CVU Opcional
            </label>
            <input
              type="text"
              placeholder="Ej: 0000003100012345678901"
              value={formData.paymentCbu || ''}
              onChange={(e) => setFormData({ ...formData, paymentCbu: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>🏷️</span>
              Precio Único de Tartas Saladas ($)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              required
              value={formData.standardPrice || 9000}
              onChange={(e) => setFormData({ ...formData, standardPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500/80 bg-emerald-50/30 dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-black focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">
              Al guardar, este precio se aplicará automáticamente a todos los sabores del menú.
            </span>
          </div>
        </div>

        {/* Supabase Cloud Connection */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-brand-500" />
              Sincronización en la Nube (Supabase Gratuito)
            </h4>
            <button
              type="button"
              onClick={() => setShowSqlModal(true)}
              className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Ver Script SQL de Tablas
            </button>
          </div>

          <p className="text-[11px] text-stone-500">
            Conectá tu proyecto gratuito de Supabase para que los dos celulares se sincronicen en tiempo real con 0 costo.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            <input
              type="text"
              placeholder="Supabase Project URL (https://xxxx.supabase.co)"
              value={formData.supabaseUrl || ''}
              onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none font-mono"
            />
            <input
              type="password"
              placeholder="Supabase Anon Key (eyJhbGciOi...)"
              value={formData.supabaseAnonKey || ''}
              onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:ring-2 focus:ring-brand-500 outline-none font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? '¡Ajustes Guardados con Éxito!' : 'Guardar Ajustes'}</span>
        </button>
      </form>

      {/* Profile & PIN Management */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-500" />
          Cuentas y Claves PIN
        </h3>

        <div className="space-y-2.5">
          {profiles.map((p) => {
            const isEditing = editingProfileId === p.id;
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="px-2 py-1 rounded-lg border text-xs w-28 bg-white dark:bg-stone-900"
                        placeholder="Nombre"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={tempPin}
                        onChange={(e) => setTempPin(e.target.value)}
                        className="px-2 py-1 rounded-lg border text-xs w-20 bg-white dark:bg-stone-900 font-mono text-center"
                        placeholder="PIN"
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">{p.name}</span>
                      <span className="text-stone-400">PIN: •••• ({p.role === 'owner' ? 'Titular' : 'Socia'})</span>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <button
                      onClick={() => {
                        if (tempName && tempPin.length === 4) {
                          onUpdateProfile({ ...p, name: tempName, pin: tempPin });
                          setEditingProfileId(null);
                        } else {
                          alert('El PIN debe tener 4 dígitos.');
                        }
                      }}
                      className="px-3 py-1 bg-brand-500 text-white font-bold rounded-lg text-xs"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingProfileId(p.id);
                        setTempName(p.name);
                        setTempPin(p.pin);
                      }}
                      className="px-3 py-1 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold rounded-lg text-xs hover:bg-stone-300"
                    >
                      Cambiar PIN
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backups & Restore */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-3">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-500" />
          Copias de Seguridad (Backup)
        </h3>
        <p className="text-xs text-stone-500">
          Guardá un archivo con todos tus clientes, precios, ventas y gastos en tu celular o PC.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleDownloadBackup}
            className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-100 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar JSON</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-100 cursor-pointer active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar JSON</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={handleResetData}
            className="text-[11px] text-stone-400 hover:text-rose-500 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer datos de ejemplo iniciales</span>
          </button>
        </div>
      </div>

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl shadow-2xl p-6 border border-stone-100 dark:border-stone-800 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-500" />
                Script SQL para Supabase
              </h3>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-xs text-stone-500 hover:text-stone-700"
              >
                Cerrar
              </button>
            </div>

            <div className="py-3 text-xs text-stone-500">
              Copiá este código y pegalo en el <strong>SQL Editor</strong> de tu proyecto Supabase para crear todas las tablas automáticamente:
            </div>

            <pre className="flex-1 overflow-y-auto p-3 rounded-xl bg-stone-950 text-amber-400 font-mono text-[11px] leading-relaxed select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={handleCopySql}
                className="py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? '¡Copiado al Portapapeles!' : 'Copiar Código SQL'}</span>
              </button>

              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 text-xs text-stone-500"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
