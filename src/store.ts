import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface Producto {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  active: boolean;
}

export type ProveedorEstado = "Activo" | "Inactivo" | "En Revisión";

export interface Proveedor {
  id: string;
  code: string;
  name: string;
  razonSocial: string;
  category: string;
  products: number;
  leadTime: number;
  rating: number;
  status: ProveedorEstado;
  email: string;
  init: string;
}

export interface Servicio {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  active: boolean;
}

export type RolMiembro = "Administrador" | "Editor" | "Visualizador";

export interface MiembroEquipo {
  id: string;
  name: string;
  title: string;
  role: RolMiembro;
  active: boolean;
  email: string;
  avatarUrl: string;
}

export type VendedorEstado = "Activo" | "Inactivo" | "Pendiente";

export interface Vendedor {
  id: string;
  name: string;
  company: string;
  orders: number;
  gmv: number;
  commission: number;
  status: VendedorEstado;
  lastActive: string;
  init: string;
  trend: "up" | "down" | "none";
}

export type PedidoEstado =
  | "Pendiente"
  | "En Preparación"
  | "Empacado"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export interface PedidoProducto {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Pedido {
  id: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  vendedor: string;
  vendedorInit: string;
  commission: number;
  status: PedidoEstado;
  items: PedidoProducto[];
  shipping: number;
  discount: number;
  createdAt: string;
  assigned: string | null;
}

export interface EmpresaPerfil {
  name: string;
  nit: string;
  email: string;
  logoBase64: string;
  currency: string;
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  autoAssignEnabled: boolean;
  darkModeEnabled: boolean;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RolMiembro;
  avatarUrl: string;
}

export type Accion = "crear" | "editar" | "eliminar" | "gestionar_equipo" | "gestionar_roles";

export function can(role: RolMiembro, accion: Accion): boolean {
  switch (role) {
    case "Administrador":
      return true;
    case "Editor":
      return accion !== "gestionar_equipo" && accion !== "gestionar_roles";
    case "Visualizador":
      return false;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const calcTotal = (pedido: Pedido) =>
  pedido.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) +
  pedido.shipping -
  pedido.discount;

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_PRODUCTOS: Producto[] = [
  { id: "1", sku: "AU-WRLS-2023", name: "Audífonos Wireless X-200", category: "Electrónica", stock: 5, cost: 45.0, price: 89.9, active: true },
  { id: "2", sku: "WAT-NEO-V3", name: "Reloj Inteligente V3 Neo", category: "Accesorios", stock: 12, cost: 110.0, price: 199.0, active: true },
  { id: "3", sku: "CHG-65W-GAN", name: "Cargador Rápido 65W GaN", category: "Electrónica", stock: 150, cost: 18.5, price: 34.5, active: true },
  { id: "4", sku: "KB-MECH-RGB", name: "Teclado Mecánico RGB", category: "Computación", stock: 8, cost: 52.0, price: 115.0, active: false },
  { id: "5", sku: "CAM-4K-PRO", name: "Cámara de Seguridad 4K", category: "Hogar", stock: 45, cost: 35.0, price: 79.99, active: true },
];

const SEED_PROVEEDORES: Proveedor[] = [
  { id: "1", code: "PROV-001", name: "Global Electronics", razonSocial: "Global Electronics S.A.", category: "Electrónica", products: 145, leadTime: 3, rating: 4.8, status: "Activo", email: "ventas@globalelec.com", init: "GE" },
  { id: "2", code: "PROV-002", name: "Fashion Wholesale LTDA", razonSocial: "Fashion Wholesale LTDA.", category: "Moda", products: 320, leadTime: 5, rating: 4.5, status: "Activo", email: "contact@fashionwh.com", init: "FW" },
  { id: "3", code: "PROV-003", name: "Mega Distribuciones", razonSocial: "Mega Dist. S.A.", category: "Hogar", products: 89, leadTime: 2, rating: 4.9, status: "Activo", email: "pedidos@megadist.co", init: "MD" },
  { id: "4", code: "PROV-004", name: "Tech Imports", razonSocial: "Tech Imports Corp.", category: "Computación", products: 56, leadTime: 10, rating: 3.8, status: "En Revisión", email: "info@techimports.co", init: "TI" },
  { id: "5", code: "PROV-005", name: "Accesorios Prime", razonSocial: "Accesorios Prime LTDA.", category: "Accesorios", products: 210, leadTime: 4, rating: 4.2, status: "Inactivo", email: "ventas@accprime.co", init: "AP" },
];

const SEED_SERVICIOS: Servicio[] = [
  { id: "1", name: "Consulta de Cardiología", duration: "45 min", price: 85000, description: "", active: true },
  { id: "2", name: "Ecocardiograma Doppler", duration: "30 min", price: 120000, description: "", active: true },
  { id: "3", name: "Prueba de Esfuerzo", duration: "1h 30m", price: 150000, description: "", active: false },
  { id: "4", name: "Holter de Arritmia 24h", duration: "30 min", price: 95000, description: "", active: true },
];

const SEED_EQUIPO: MiembroEquipo[] = [
  { id: "1", name: "Dr. Roberto Mendoza", title: "Cardiólogo Principal", role: "Administrador", active: true, email: "rmendoza@clinica.com", avatarUrl: "https://ui-avatars.com/api/?name=Roberto+Mendoza&background=2952B2&color=fff" },
  { id: "2", name: "Dra. Laura Jiménez", title: "Médico General", role: "Editor", active: true, email: "ljimenez@clinica.com", avatarUrl: "https://ui-avatars.com/api/?name=Laura+Jimenez&background=2952B2&color=fff" },
  { id: "3", name: "Carlos Villagrán", title: "Fisioterapeuta", role: "Editor", active: false, email: "cvillagran@clinica.com", avatarUrl: "https://ui-avatars.com/api/?name=Carlos+Villagran&background=2952B2&color=fff" },
  { id: "4", name: "Ana Sofía Peláez", title: "Recepcionista", role: "Visualizador", active: true, email: "apelaez@clinica.com", avatarUrl: "https://ui-avatars.com/api/?name=Ana+Sofia&background=2952B2&color=fff" },
];

const SEED_VENDEDORES: Vendedor[] = [
  { id: "1", name: "Juan Pérez", company: "DropKing", orders: 345, gmv: 34500.5, commission: 15.5, status: "Activo", lastActive: "Hace 5 min", init: "JP", trend: "up" },
  { id: "2", name: "Tienda Tech", company: "Tech Store LC", orders: 289, gmv: 28900.0, commission: 12.0, status: "Activo", lastActive: "Hace 1 hora", init: "TT", trend: "up" },
  { id: "3", name: "María Gómez", company: "Moda Express", orders: 150, gmv: 15050.25, commission: 18.2, status: "Activo", lastActive: "Hace 2 horas", init: "MG", trend: "down" },
  { id: "4", name: "Carlos López", company: "Accesorios CL", orders: 45, gmv: 4500.0, commission: 10.0, status: "Inactivo", lastActive: "Hace 5 días", init: "CL", trend: "down" },
  { id: "5", name: "Super Ofertas", company: "Ofertas INC", orders: 89, gmv: 8900.8, commission: 14.5, status: "Pendiente", lastActive: "Nunca", init: "SO", trend: "none" },
];

const SEED_PEDIDOS: Pedido[] = [
  {
    id: "DP-9025", client: "Fernando Ruiz", clientEmail: "fruiz@example.com", clientPhone: "+57 310 000 0001", clientAddress: "Cra 7 #25-10, Bogotá", vendedor: "Juan Pérez", vendedorInit: "JP", commission: 15.5,
    status: "Pendiente", assigned: null, createdAt: "2024-01-15T10:00:00Z", shipping: 10, discount: 0,
    items: [{ sku: "AU-WRLS-2023", name: "Audífonos Wireless X-200", qty: 2, unitPrice: 89.9 }, { sku: "KB-MECH-RGB", name: "Teclado Mecánico RGB", qty: 1, unitPrice: 115.0 }],
  },
  {
    id: "DP-9024", client: "Sofía Vergara", clientEmail: "svergara@example.com", clientPhone: "+57 310 000 0002", clientAddress: "Calle 80 #10-30, Medellín", vendedor: "Tienda Tech", vendedorInit: "TT", commission: 12.0,
    status: "Pendiente", assigned: null, createdAt: "2024-01-15T09:15:00Z", shipping: 10, discount: 0,
    items: [{ sku: "WAT-NEO-V3", name: "Reloj Inteligente V3 Neo", qty: 1, unitPrice: 199.0 }],
  },
  {
    id: "DP-9023", client: "Miguel Torres", clientEmail: "mtorres@example.com", clientPhone: "+57 320 000 0003", clientAddress: "Av. El Dorado #68B-31, Bogotá", vendedor: "María Gómez", vendedorInit: "MG", commission: 18.2,
    status: "Pendiente", assigned: "LM", createdAt: "2024-01-15T08:00:00Z", shipping: 8, discount: 0,
    items: [{ sku: "KB-MECH-RGB", name: "Teclado Mecánico RGB", qty: 1, unitPrice: 115.0 }],
  },
  {
    id: "DP-9022", client: "Lucía Gómez", clientEmail: "lgomez@example.com", clientPhone: "+57 315 000 0004", clientAddress: "Transversal 60 #49-30, Cali", vendedor: "Juan Pérez", vendedorInit: "JP", commission: 15.5,
    status: "En Preparación", assigned: "CM", createdAt: "2024-01-14T18:00:00Z", shipping: 10, discount: 5,
    items: [{ sku: "CHG-65W-GAN", name: "Cargador Rápido 65W GaN", qty: 3, unitPrice: 34.5 }],
  },
  {
    id: "DP-9021", client: "Andrés Silva", clientEmail: "andres.silva@example.com", clientPhone: "+57 300 123 4567", clientAddress: "Calle 100 #15-20, Apto 402, Bogotá", vendedor: "Tienda Tech", vendedorInit: "TT", commission: 12.0,
    status: "En Preparación", assigned: "CM", createdAt: "2024-01-14T17:45:00Z", shipping: 10, discount: 5,
    items: [{ sku: "AU-WRLS-2023", name: "Audífonos Wireless X-200", qty: 2, unitPrice: 89.9 }, { sku: "CHG-65W-GAN", name: "Cargador Rápido 65W GaN", qty: 1, unitPrice: 34.5 }],
  },
  {
    id: "DP-9019", client: "Carlos Vives", clientEmail: "cvives@example.com", clientPhone: "+57 305 000 0006", clientAddress: "Calle 45 #10-25, Santa Marta", vendedor: "María Gómez", vendedorInit: "MG", commission: 18.2,
    status: "Empacado", assigned: "LM", createdAt: "2024-01-14T12:00:00Z", shipping: 12, discount: 0,
    items: [{ sku: "CAM-4K-PRO", name: "Cámara de Seguridad 4K", qty: 1, unitPrice: 79.99 }],
  },
  {
    id: "DP-9017", client: "Patricia López", clientEmail: "plopez@example.com", clientPhone: "+57 318 000 0007", clientAddress: "Carrera 30 #5-40, Barranquilla", vendedor: "Tienda Tech", vendedorInit: "TT", commission: 12.0,
    status: "Empacado", assigned: "CM", createdAt: "2024-01-14T11:00:00Z", shipping: 10, discount: 10,
    items: [{ sku: "WAT-NEO-V3", name: "Reloj Inteligente V3 Neo", qty: 2, unitPrice: 199.0 }],
  },
  {
    id: "DP-9010", client: "Juan Diego", clientEmail: "jdiego@example.com", clientPhone: "+57 312 000 0008", clientAddress: "Calle 10 #3-45, Pereira", vendedor: "Juan Pérez", vendedorInit: "JP", commission: 15.5,
    status: "Enviado", assigned: "CM", createdAt: "2024-01-13T09:00:00Z", shipping: 8, discount: 0,
    items: [{ sku: "AU-WRLS-2023", name: "Audífonos Wireless X-200", qty: 1, unitPrice: 89.9 }],
  },
  {
    id: "DP-9005", client: "Ana Rivas", clientEmail: "arivas@example.com", clientPhone: "+57 316 000 0009", clientAddress: "Av. 4 Norte #20-15, Cali", vendedor: "Carlos López", vendedorInit: "CL", commission: 10.0,
    status: "Entregado", assigned: "LM", createdAt: "2024-01-12T08:00:00Z", shipping: 10, discount: 0,
    items: [{ sku: "WAT-NEO-V3", name: "Reloj Inteligente V3 Neo", qty: 1, unitPrice: 199.0 }],
  },
  {
    id: "DP-9001", client: "Luisa Méndez", clientEmail: "lmendez@example.com", clientPhone: "+57 301 000 0010", clientAddress: "Calle 15 #8-20, Bogotá", vendedor: "María Gómez", vendedorInit: "MG", commission: 18.2,
    status: "Cancelado", assigned: null, createdAt: "2024-01-11T10:00:00Z", shipping: 10, discount: 0,
    items: [{ sku: "CHG-65W-GAN", name: "Cargador Rápido 65W GaN", qty: 2, unitPrice: 34.5 }],
  },
];

const SEED_EMPRESA: EmpresaPerfil = {
  name: "Dropi Portal",
  nit: "900.123.456-7",
  email: "soporte@dropi.co",
  logoBase64: "",
  currency: "COP",
  language: "Español",
  timezone: "America/Bogota",
  notificationsEnabled: true,
  autoAssignEnabled: true,
  darkModeEnabled: false,
};

// ─── Store Shape ───────────────────────────────────────────────────────────────

interface AppState {
  // --- Entidades ---
  productos: Producto[];
  proveedores: Proveedor[];
  servicios: Servicio[];
  equipo: MiembroEquipo[];
  vendedores: Vendedor[];
  pedidos: Pedido[];
  empresa: EmpresaPerfil;

  // --- Auth ---
  authUser: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;

  // --- Productos CRUD ---
  addProducto: (p: Omit<Producto, "id">) => void;
  updateProducto: (id: string, updates: Partial<Producto>) => void;
  deleteProducto: (id: string) => void;
  toggleProductoStatus: (id: string) => void;

  // --- Proveedores CRUD ---
  addProveedor: (p: Omit<Proveedor, "id" | "code" | "init">) => void;
  updateProveedor: (id: string, updates: Partial<Proveedor>) => void;
  deleteProveedor: (id: string) => void;
  toggleProveedorStatus: (id: string) => void;

  // --- Servicios CRUD ---
  addServicio: (s: Omit<Servicio, "id">) => void;
  updateServicio: (id: string, updates: Partial<Servicio>) => void;
  deleteServicio: (id: string) => void;
  toggleServicioStatus: (id: string) => void;

  // --- Equipo CRUD ---
  addMiembro: (m: Omit<MiembroEquipo, "id" | "avatarUrl">) => void;
  updateMiembro: (id: string, updates: Partial<MiembroEquipo>) => void;
  deleteMiembro: (id: string) => void;
  toggleMiembroStatus: (id: string) => void;

  // --- Vendedores CRUD ---
  addVendedor: (v: Omit<Vendedor, "id" | "init" | "orders" | "gmv" | "trend" | "lastActive">) => void;
  updateVendedor: (id: string, updates: Partial<Vendedor>) => void;
  deleteVendedor: (id: string) => void;
  toggleVendedorStatus: (id: string) => void;

  // --- Pedidos CRUD ---
  addPedido: (p: Omit<Pedido, "id" | "createdAt">) => void;
  updatePedido: (id: string, updates: Partial<Pedido>) => void;
  deletePedido: (id: string) => void;
  movePedido: (id: string, newStatus: PedidoEstado) => void;
  bulkMoveEmpacadosToEnviado: () => void;

  // --- Empresa ---
  updateEmpresa: (updates: Partial<EmpresaPerfil>) => void;

  // --- Selectores / KPIs derivados ---
  getKPIs: () => {
    ingresosTotales: number;
    pedidosActivos: number;
    pedidosCompletados: number;
    ticketPromedio: number;
    vendedoresActivos: number;
    tasaDevolucion: number;
    gmvTotal: number;
    comisionPromedio: number;
  };
  getPedidosByStatus: (status: PedidoEstado) => Pedido[];
  getTopVendedores: (limit?: number) => Array<{ name: string; gmv: number; init: string }>;
  getRecentPedidos: (limit?: number) => Pedido[];
  getPedidoTotal: (id: string) => number;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Estado inicial ──────────────────────────────────────────────────────
      productos: SEED_PRODUCTOS,
      proveedores: SEED_PROVEEDORES,
      servicios: SEED_SERVICIOS,
      equipo: SEED_EQUIPO,
      vendedores: SEED_VENDEDORES,
      pedidos: SEED_PEDIDOS,
      empresa: SEED_EMPRESA,
      authUser: null,

      // ── Auth ───────────────────────────────────────────────────────────────
      login: (email, password) => {
        if (email === "admin@dropi.co" && password === "admin123") {
          set({
            authUser: {
              id: "admin",
              name: "Admin Global",
              email: "admin@dropi.co",
              role: "Administrador",
              avatarUrl: "https://ui-avatars.com/api/?name=Admin+Global&background=2952B2&color=fff",
            },
          });
          return true;
        }
        const member = get().equipo.find((m) => m.email.toLowerCase() === email.toLowerCase());
        if (member) {
          set({
            authUser: {
              id: member.id,
              name: member.name,
              email: member.email,
              role: member.role,
              avatarUrl: member.avatarUrl,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ authUser: null }),
      register: (name, email) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2952B2&color=fff`;
        const newMember: MiembroEquipo = {
          id: uid(), name, title: "Nuevo Miembro",
          role: "Visualizador", active: true, email, avatarUrl,
        };
        set((s) => ({
          equipo: [...s.equipo, newMember],
          authUser: { id: newMember.id, name, email, role: "Visualizador", avatarUrl },
        }));
      },

      // ── Productos ──────────────────────────────────────────────────────────
      addProducto: (p) =>
        set((s) => ({ productos: [...s.productos, { ...p, id: uid() }] })),
      updateProducto: (id, updates) =>
        set((s) => ({ productos: s.productos.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deleteProducto: (id) =>
        set((s) => ({ productos: s.productos.filter((p) => p.id !== id) })),
      toggleProductoStatus: (id) =>
        set((s) => ({ productos: s.productos.map((p) => (p.id === id ? { ...p, active: !p.active } : p)) })),

      // ── Proveedores ────────────────────────────────────────────────────────
      addProveedor: (p) => {
        const idx = get().proveedores.length + 1;
        const code = `PROV-${String(idx).padStart(3, "0")}`;
        const init = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        set((s) => ({ proveedores: [...s.proveedores, { ...p, id: uid(), code, init }] }));
      },
      updateProveedor: (id, updates) =>
        set((s) => ({ proveedores: s.proveedores.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deleteProveedor: (id) =>
        set((s) => ({ proveedores: s.proveedores.filter((p) => p.id !== id) })),
      toggleProveedorStatus: (id) =>
        set((s) => ({
          proveedores: s.proveedores.map((p) =>
            p.id === id ? { ...p, status: p.status === "Activo" ? "Inactivo" : "Activo" } : p
          ),
        })),

      // ── Servicios ──────────────────────────────────────────────────────────
      addServicio: (s) =>
        set((st) => ({ servicios: [...st.servicios, { ...s, id: uid() }] })),
      updateServicio: (id, updates) =>
        set((s) => ({ servicios: s.servicios.map((sv) => (sv.id === id ? { ...sv, ...updates } : sv)) })),
      deleteServicio: (id) =>
        set((s) => ({ servicios: s.servicios.filter((sv) => sv.id !== id) })),
      toggleServicioStatus: (id) =>
        set((s) => ({ servicios: s.servicios.map((sv) => (sv.id === id ? { ...sv, active: !sv.active } : sv)) })),

      // ── Equipo ─────────────────────────────────────────────────────────────
      addMiembro: (m) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=2952B2&color=fff`;
        set((s) => ({ equipo: [...s.equipo, { ...m, id: uid(), avatarUrl }] }));
      },
      updateMiembro: (id, updates) =>
        set((s) => ({ equipo: s.equipo.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteMiembro: (id) =>
        set((s) => ({ equipo: s.equipo.filter((m) => m.id !== id) })),
      toggleMiembroStatus: (id) =>
        set((s) => ({ equipo: s.equipo.map((m) => (m.id === id ? { ...m, active: !m.active } : m)) })),

      // ── Vendedores ─────────────────────────────────────────────────────────
      addVendedor: (v) => {
        const init = v.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        set((s) => ({
          vendedores: [...s.vendedores, { ...v, id: uid(), init, orders: 0, gmv: 0, trend: "none", lastActive: "Recién registrado" }],
        }));
      },
      updateVendedor: (id, updates) =>
        set((s) => ({ vendedores: s.vendedores.map((v) => (v.id === id ? { ...v, ...updates } : v)) })),
      deleteVendedor: (id) =>
        set((s) => ({ vendedores: s.vendedores.filter((v) => v.id !== id) })),
      toggleVendedorStatus: (id) =>
        set((s) => ({
          vendedores: s.vendedores.map((v) =>
            v.id === id ? { ...v, status: v.status === "Activo" ? "Inactivo" : "Activo" } : v
          ),
        })),

      // ── Pedidos ────────────────────────────────────────────────────────────
      addPedido: (p) =>
        set((s) => ({ pedidos: [{ ...p, id: `DP-${Math.floor(Math.random() * 9000 + 1000)}`, createdAt: new Date().toISOString() }, ...s.pedidos] })),
      updatePedido: (id, updates) =>
        set((s) => ({ pedidos: s.pedidos.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deletePedido: (id) =>
        set((s) => ({ pedidos: s.pedidos.filter((p) => p.id !== id) })),
      movePedido: (id, newStatus) =>
        set((s) => ({ pedidos: s.pedidos.map((p) => (p.id === id ? { ...p, status: newStatus } : p)) })),
      bulkMoveEmpacadosToEnviado: () =>
        set((s) => ({
          pedidos: s.pedidos.map((p) => (p.status === "Empacado" ? { ...p, status: "Enviado" as PedidoEstado } : p)),
        })),

      // ── Empresa ────────────────────────────────────────────────────────────
      updateEmpresa: (updates) =>
        set((s) => ({ empresa: { ...s.empresa, ...updates } })),

      // ── Selectores ─────────────────────────────────────────────────────────
      getKPIs: () => {
        const { pedidos, vendedores } = get();
        const completados = pedidos.filter((p) => p.status === "Entregado");
        const activos = pedidos.filter((p) => !["Cancelado", "Entregado"].includes(p.status));
        const cancelados = pedidos.filter((p) => p.status === "Cancelado");
        const ingresosTotales = completados.reduce((s, p) => s + calcTotal(p), 0);
        const ticketPromedio = completados.length ? ingresosTotales / completados.length : 0;
        const tasaDevolucion = pedidos.length ? (cancelados.length / pedidos.length) * 100 : 0;
        const gmvTotal = vendedores.reduce((s, v) => s + v.gmv, 0);
        const comisionPromedio = vendedores.length
          ? vendedores.reduce((s, v) => s + v.commission, 0) / vendedores.length
          : 0;
        return {
          ingresosTotales,
          pedidosActivos: activos.length,
          pedidosCompletados: completados.length,
          ticketPromedio,
          vendedoresActivos: vendedores.filter((v) => v.status === "Activo").length,
          tasaDevolucion,
          gmvTotal,
          comisionPromedio,
        };
      },
      getPedidosByStatus: (status) => get().pedidos.filter((p) => p.status === status),
      getTopVendedores: (limit = 4) =>
        [...get().vendedores].sort((a, b) => b.gmv - a.gmv).slice(0, limit).map((v) => ({ name: v.name, gmv: v.gmv, init: v.init })),
      getRecentPedidos: (limit = 5) =>
        [...get().pedidos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit),
      getPedidoTotal: (id) => {
        const p = get().pedidos.find((x) => x.id === id);
        return p ? calcTotal(p) : 0;
      },
    }),
    { name: "dropi-store" }
  )
);

// ─── Utilitario CSV ────────────────────────────────────────────────────────────

export function exportToCSV<T extends Record<string, unknown>>(rows: T[], filename: string): void {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? "").replace(/"/g, '""');
        return `"${val}"`;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
