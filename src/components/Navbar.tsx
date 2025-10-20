
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import BrandLogo from "./BrandLogo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const { t } = useLanguage();
  const { user, signOut, setRedirectPath } = useAuth();
  const { isAdmin } = useUserRole();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.viajes, path: "/viajes" },
    { name: t.nav.explore, path: "/explore" },
    { name: t.nav.about, path: "/about" }
  ];

  // Función para manejar el clic en "Iniciar Sesión"
  const handleLoginClick = () => {
    // Solo guardar la ruta si no estamos ya en la página de auth
    if (location.pathname !== '/auth') {
      setRedirectPath(location.pathname);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Inicializar estado al montar
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Recalcular al cambiar de ruta (por si se entra en una página con scroll distinto)
  useEffect(() => {
    setScrolled(window.scrollY > 20);
    // cerrar el menú móvil al navegar
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const headerSolid = isMobile || scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        headerSolid
          ? "bg-white dark:bg-card py-3 shadow-md"
          : "bg-transparent py-5"
      )}
    >
      <nav className="container flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BrandLogo />
          <LanguageSelector />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <li key={link.name} className="relative">
              <Link
                to={link.path}
                className="font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link to="/admin">
                    <Shield className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                onClick={() => signOut()}
                variant="outline" 
                className="rounded-full px-6 py-2.5 font-medium"
              >
                {t.nav.logout}
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleLoginClick}
              asChild 
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 py-2.5 font-medium"
            >
              <Link to="/auth">{t.nav.login}</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className={cn("fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card shadow-xl p-6 transition-transform duration-300 ease-in-out", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between mb-8">
                <LanguageSelector />
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <ul className="space-y-6">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-lg font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {user ? (
              <div className="space-y-3 mt-6">
                {isAdmin && (
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full" variant="outline">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    {t.nav.profile}
                  </Link>
                </Button>
                <Button 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  {t.nav.logout}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  handleLoginClick();
                  setMobileMenuOpen(false);
                }}
                asChild 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 py-2.5 font-medium mt-6"
              >
                <Link to="/auth">
                  {t.nav.login}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}