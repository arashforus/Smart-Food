import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import { LanguageProvider } from "@/hooks/use-language";
import { useAnalytics } from "@/hooks/use-analytics";
import { useQuery } from "@tanstack/react-query";
import { applyPrimaryColor } from "@/lib/color-utils";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import MenuPage from "@/pages/menu";
import QRLandingPage from "@/pages/qr-landing";
import LoginPage from "@/pages/login";
import AdminLayout from "@/pages/admin/index";
import LandingPage from "@/pages/landing";

function Router() {
  useAnalytics();
  const { data: settings } = useQuery<any>({ 
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings?.primaryColor) {
      applyPrimaryColor(settings.primaryColor);
    }
  }, [settings?.primaryColor]);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/qr" component={QRLandingPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin">
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      </Route>
      <Route path="/admin/:rest*">
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Router />
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
