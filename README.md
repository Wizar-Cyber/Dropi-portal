# 🚀 Dropy (SaaS Admin) / Plataforma Administrativa

## 📖 Descripción del Proyecto
Este proyecto es un prototipo frontend de una plataforma SASS avanzada de administración. Originalmente concebida para la gestión de **Logística, E-commerce y Dropshipping (Dropy)**, pero ampliada paramódulos de **Gestión de Servicios y Equipos** (similar a soluciones de clínicas/AgendaPro).

Actualmente, el proyecto contiene una UI/UX moderna, profesional, "mobile-friendly" (responsive) y animada, construida con los mejores estándares. Todas las interfaces, modales y tablas están diseñadas, pero las interacciones operan con **datos estáticos (mockups)** y simulan las acciones a través de notificaciones emergentes (Toasts).

## 🛠️ Stack Tecnológico Actual
- **Core:** React 19 + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Iconografía:** Lucide React
- **Animaciones:** Framer Motion
- **Notificaciones:** Sonner
- **Gráficos (Charts):** Recharts y visualizaciones CSS nativas
- **Enrutamiento:** React Router DOM v7

## 📁 Estructura de Módulos (Vistas Construidas)
- **Dashboard (`/`):** Tarjetas de KPIs principales, gráficas de tendencia y resumen de actividad.
- **Inventario (`/inventario`):** Data-table para gestión de productos, niveles de stock y precios.
- **Logística Kanban (`/kanban`):** Tablero visual (tipo Trello) para rastreo del estado de órdenes logísticas (Pendiente, Empacado, En Tránsito) e impresión de guías masivas.
- **Pedidos (`/pedidos`):** Sistema de gestión de órdenes de clientes con opciones para imprimir guías de envío y simular mensajería (WhatsApp/Email).
- **Vendedores (`/vendedores`):** CRM básico para la red de dropshippers o vendedores afiliados.
- **Proveedores (`/proveedores`):** Directorio de suplidores y métricas de despacho.
- **Reportes (`/reportes`):** Analíticas de ingresos, canales de adquisición y reportes financieros exportables.
- **Configuración (`/configuracion`):** Ajustes globales del tenant, Webhooks, API keys, seguridad, perfil y notificaciones.
- **Servicios (`/src/pages/Services.tsx`):** Gestión de catálogo de servicios (precios y duraciones). *(Requiere enlace en el router)*.
- **Equipo y Roles (`/src/pages/Team.tsx`):** Sistema de invitaciones y niveles de acceso (RBAC) para empleados. *(Requiere enlace en el router)*.

## 🚧 Estado Actual (Fase Mockup)
El Frontend está terminado a nivel de diseño corporativo. Cuando se presiona la mayoría de botones (ej. "Añadir Vendedor", "Imprimir PDF", "Guardar Cambios"), la UI reacciona abriendo un modal o mostrando un mensaje simulado ("toast") sin alterar bases de datos, ya que **no existe un Backend conectado todavía**.

## 🚀 Cómo correr el proyecto localmente
1. Instalar las dependencias: `npm install`
2. Correr el entorno de desarrollo: `npm run dev`
3. Construir para producción (dist): `npm run build`

## 🧠 Siguientes Pasos (Roadmap de Integración)
1. **Base de Datos & Backend:** Diseñar schemas e implementar una API REST o GraphQL (ej. Node.js + Express, NestJS, Supabase, Firebase o Next.js API Routes).
2. **Autenticación (Auth):** Reemplazar el acceso libre por un Login real (JWT, OAuth) protegiendo el enrutador.
3. **Gestión de Estado y Fetching:** Implementar librerías como `React Query` para consumir las APIs reales y reemplazar los estados locales `useState(INITIAL_DATA)`.
4. **Formularios (Validación):** Integrar `react-hook-form` + `zod` para capturar datos en los modales de creación (ej. crear proveedor, invitar miembro de equipo).
