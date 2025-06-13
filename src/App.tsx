
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Activities from "./pages/Activities";
import Deals from "./pages/Deals";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Organizations from "./pages/Organizations";
import Tenants from "./pages/Tenants";
import BoardManagement from "./pages/BoardManagement";
import DynamicBoards from "./pages/DynamicBoards";
import OrgDashboard from "./pages/OrgDashboard";
import OrgSettings from "./pages/OrgSettings";
import Automations from "./pages/Automations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full">
          <Navigation />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/board-management" element={<BoardManagement />} />
              <Route path="/dynamic-boards" element={<DynamicBoards />} />
              <Route path="/org-dashboard" element={<OrgDashboard />} />
              <Route path="/org-settings" element={<OrgSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
