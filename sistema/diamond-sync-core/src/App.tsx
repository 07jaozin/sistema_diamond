import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Index";
import Clients from "@/pages/Clients";
import ClientDetail from "@/pages/ClientDetail";
import Works from "@/pages/Works";
import WorkDetail from "@/pages/WorkDetail";
import ServiceOrders from "@/pages/ServiceOrders";
import CreateServiceOrder from "@/pages/CreateServiceOrder";
import EditServiceOrder from "./pages/EditOrdemService";
import NotFound from "./pages/NotFound";
import ReportForm from "./pages/ReportForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/:id" element={<ClientDetail />} />
              <Route path="/obras" element={<Works />} />
              <Route path="/obras/:id" element={<WorkDetail />} />
              <Route path="/ordens-servico" element={<ServiceOrders />} />
              <Route path="/ordens-servico/nova" element={<CreateServiceOrder />} />
              <Route path="/ordens-servico/:os_id" element={<EditServiceOrder />} />
              <Route path="/reportForm" element={<ReportForm/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
