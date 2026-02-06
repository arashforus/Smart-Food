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
import { useEffect, useLayoutEffect } from "react";
import NotFound from "@/pages/not-found";
import MenuPage from "@/pages/menu";
import QRLandingPage from "@/pages/qr-landing";
import LoginPage from "@/pages/login";
import AdminLayout from "@/pages/admin/index";
import LandingPage from "@/pages/landing";
import ComingSoonPage from "@/pages/coming-soon";

function Router() {
  useAnalytics();
  const { data: settings } = useQuery<any>({ 
    queryKey: ["/api/settings"],
  });

  useLayoutEffect(() => {
    const primaryColor = settings?.primaryColor || "#4CAF50";
    applyPrimaryColor(primaryColor);
    
    // Dynamically update favicon from settings
    if (settings?.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
      
      // Also update apple-touch-icon and others if they exist
      const appleLink = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) (appleLink as HTMLLinkElement).href = settings.favicon;
    }
    
    const timer = setTimeout(() => applyPrimaryColor(primaryColor), 0);
    return () => clearTimeout(timer);
  }, [settings?.primaryColor, settings?.favicon]);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/coming-soon" component={ComingSoonPage} />
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
  const menuLang = localStorage.getItem('language') || 'en';
  const adminLang = localStorage.getItem('adminLanguage') || 'en';
  
  const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';
  const currentLang = isAdmin ? adminLang : menuLang;
  
  const isRtl = currentLang === 'fa' || currentLang === 'ar';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={isRtl ? 'font-vazir' : ''}>
          <AuthProvider>
            <LanguageProvider>
              <Toaster />
              <Router />
            </LanguageProvider>
          </AuthProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
