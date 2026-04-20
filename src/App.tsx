import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LocationPage from "./pages/LocationPage";
import AreaPage from "./pages/AreaPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminAreas from "./pages/admin/AdminAreas";
import AdminModels from "./pages/admin/AdminModels";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./lib/supabase"
import GlobalLayout from "./components/GlobalLayout";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<GlobalLayout/>}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/locations" element={<ProtectedRoute><AdminLocations /></ProtectedRoute>} />
          <Route path="/admin/areas" element={<ProtectedRoute><AdminAreas /></ProtectedRoute>} />
          <Route path="/admin/models" element={<ProtectedRoute><AdminModels /></ProtectedRoute>} />
          <Route path="/admin/enquiries" element={<ProtectedRoute><AdminEnquiries /></ProtectedRoute>} />
          <Route path="/:locationSlug" element={<LocationPage />} />
          <Route path="/:locationSlug/:areaSlug" element={<AreaPage />} />
          <Route path="/:locationSlug/:areaSlug/:modelSlug" element={<ModelDetailPage />} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
