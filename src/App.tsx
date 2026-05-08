/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Pedidos from "./pages/Pedidos";
import Kanban from "./pages/Kanban";
import Vendedores from "./pages/Vendedores";
import Proveedores from "./pages/Proveedores";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="vendedores" element={<Vendedores />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
