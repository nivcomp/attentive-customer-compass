
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DynamicBoards from "./pages/DynamicBoards";
import BoardManagement from "./pages/BoardManagement";
import Contacts from "./pages/Contacts";
import Activities from "./pages/Activities";
import Deals from "./pages/Deals";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// עמודי placeholder לנתיבים שעדיין לא פותחו
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto p-6 text-center">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600 text-lg">הדף הזה בפיתוח - בקרוב!</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/dynamic-boards" element={<DynamicBoards />} />
              <Route path="/board-builder" element={<PlaceholderPage title="בונה לוחות" />} />
              <Route path="/board-management" element={<BoardManagement />} />
              <Route path="/automations" element={<PlaceholderPage title="אוטומציות" />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
