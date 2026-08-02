// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import { ThemeProvider } from "./contexts/ThemeContext"; // <-- Theme context
import BottomNav from "./components/BottomNav";

import Splash from "./pages/Splash";
import Index from "./pages/Index";
import ScanMeter from "./pages/ScanMeter";
import BillInput from "./pages/BillInput";
import BillResult from "./pages/BillResult";
import BillHistory from "./pages/BillHistory";
import Tariffs from "./pages/Tariffs";
import Complaint from "./pages/Complaint";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings"; // <-- Add Settings route
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          {/* Routes */}
          <Routes>
            <Route path="/splash" element={<Splash />} />
            <Route path="/" element={<Index />} />
            <Route path="/scan" element={<ScanMeter />} />
            <Route path="/bill-input" element={<BillInput />} />
            <Route path="/bill-result" element={<BillResult />} />
            <Route path="/history" element={<BillHistory />} />
            <Route path="/tariffs" element={<Tariffs />} />
            <Route path="/complaint" element={<Complaint />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} /> {/* <-- New route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;