# 🥧 La House - Sistema de Gestión de Tartas Caseras Saladas

Sistema web progresivo (**PWA**) diseñado específicamente para la gestión integral de un emprendimiento gastronómico de tartas caseras saladas (frizadas, listas para el horno).

---

## 🚀 Características Principales

- **📱 Mobile-First & PWA**: Instalable en celulares Android e iOS como una app nativa.
- **🔐 Perfiles con PIN Rápido**: 2 cuentas de acceso ágil (Tomás y Sofi) con clave PIN de 4 dígitos.
- **🥧 Catálogo de 9 Sabores Salados**:
  - Jamón y Queso
  - Cebolla y Queso (Fugazzeta)
  - Calabaza y Queso
  - Calabaza y Cebollita Caramelizada
  - Verduras Asadas
  - Pollo y Puerro
  - Pollo y Roquefort
  - Pollo y Cebollita Caramelizada
  - Brócoli y Queso
- **📦 Stock Híbrido**: Control de tartas frizadas elaboradas + insumos de packaging (cajas, film, bases) con alertas de stock bajo.
- **🛒 Punto de Venta & WhatsApp**:
  - Registro de ventas en 3 toques.
  - Generación de mensajes automáticos de confirmación, aviso de "Pedido Listo" (con instrucciones de horneado) y recordatorio de cobros.
- **💰 Cobros, Fiados & Gastos**:
  - Arqueo de caja (Efectivo vs MercadoPago / Transferencia).
  - Cuentas corrientes con botón de cobro rápido.
  - Registro de gastos y cálculo de **Ganancia Neta Real**.
- **👥 CRM de Clientes**: Ficha con sabores favoritos, historial de compras y detección de clientes inactivos (+20 días).
- **📊 Estadísticas & Exportación Excel**: Gráficos de facturación, ranking de sabores más vendidos y exportación completa a `.xlsx`.
- **☁️ Supabase Cloud Sync**: Listo para sincronizar en tiempo real entre múltiples dispositivos con Supabase PostgreSQL.

---

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, Vite
- **Estilos**: TailwindCSS, Lucide Icons, Canvas Confetti
- **Gráficos & Exportación**: Recharts, SheetJS (XLSX)
- **Base de Datos**: LocalStorage / Supabase PostgreSQL con Realtime

---

## 💻 Instalación y Desarrollo Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/msardissino/LaHouse.git
   cd LaHouse
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor local:
   ```bash
   npm run dev
   ```
   Abrir `http://localhost:5173/` en el navegador.

4. Compilar para producción:
   ```bash
   npm run build
   ```
