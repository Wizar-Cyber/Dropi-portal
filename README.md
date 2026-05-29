# Dropi Portal

Plataforma administrativa SaaS para gestión de logística, e-commerce y dropshipping — con módulos de inventario, pedidos, proveedores, vendedores, equipo y servicios.

## Credenciales de prueba

| Email             | Password  | Rol             |
| ----------------- | --------- | --------------- |
| admin@dropi.co    | admin123  | Administrador   |

También puedes registrarte desde `/register` (rol **Visualizador** por defecto).

## Roles

| Rol             | Acceso                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Administrador   | Todas las secciones, CRUD completo                                     |
| Editor          | CRUD en Pedidos, Inventario, Proveedores; solo lectura en el resto     |
| Visualizador    | Solo lectura en todas las secciones                                    |

## Stack Tecnológico

| Categoría         | Tecnologías                                                           |
| ----------------- | --------------------------------------------------------------------- |
| Core              | React 19 + Vite + TypeScript                                          |
| Estilos           | Tailwind CSS v4                                                       |
| Estado            | Zustand (persistencia local)                                          |
| Formularios       | react-hook-form                                                       |
| Gráficos          | recharts                                                              |
| Exportación       | jspdf (PDF), CSV nativo                                               |
| Iconos            | lucide-react                                                          |
| Fechas            | dayjs                                                                 |
| Enrutamiento      | React Router DOM v7                                                   |
| UI/UX             | Frammer Motion (animaciones), Sonner (notificaciones)                 |

## Funcionalidades

- **Autenticación** con login/register y control de roles (RBAC)
- **Dashboard** con KPIs principales, gráficas de tendencia y resumen de actividad
- **Pedidos** — CRUD, inline editing, bulk actions, exportación PDF individual y masiva (guías de envío)
- **Inventario** — CRUD, carga de imágenes/CSV, exportación PDF
- **Proveedores** — directorio con métricas de despacho y exportación PDF
- **Vendedores** — CRM básico para afiliados
- **Equipo** — gestión de miembros con roles
- **Servicios** — catálogo con precios y duraciones
- **Kanban** — tablero visual drag-and-drop con persistencia en store
- **Reportes** — analíticas con gráficos (recharts) y exportación CSV
- **Configuración** — ajustes globales conectados al store, perfil y notificaciones
- Sidebar y rutas protegidas por rol

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Construir para producción

```bash
npm run build
npm run preview
```

## Estado actual

Frontend funcional con datos mock. Los CRUD, exportaciones y Kanban operan sobre el store local de Zustand. Sin backend conectado todavía.
