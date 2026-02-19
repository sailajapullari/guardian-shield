import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Behaviors from "./pages/Behaviors";
import Analytics from "./pages/Analytics";
import RealCases from "./pages/RealCases";
import HowItWorks from "./pages/HowItWorks";
import Simulator from "./pages/Simulator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/behaviors" element={<Behaviors />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/real-cases" element={<RealCases />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/simulator" element={<Simulator />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
