
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error(t.footer.enterEmail);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t.footer.enterValidEmail);
      return;
    }

    setIsSubscribing(true);

    try {
      // Simular llamada a API (aquí podrías integrar con tu servicio de email)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t.footer.newsletterSuccess, {
        description: t.footer.newsletterSuccessDesc
      });
      
      setEmail(""); // Limpiar el campo
    } catch (error) {
      toast.error(t.footer.newsletterError, {
        description: t.footer.newsletterErrorDesc
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-card-foreground pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in [animation-delay:100ms] text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">SARQUI</h4>
            <p className="text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {/*
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              */}
              <a href="https://www.instagram.com/sarqui.ve" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              {/*
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              */}
            </div>
          </div>
          
          <div className="animate-fade-in [animation-delay:200ms] text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 flex flex-col items-center md:items-start">
              {[
                { name: t.nav.home, path: "/" },
                { name: t.nav.viajes, path: "/viajes" },
                { name: t.nav.explore, path: "/explore" },
                { name: t.nav.about, path: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-fade-in [animation-delay:300ms] text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  {t.footer.addressText}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">+58 412 5093738</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">sarqui@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in [animation-delay:400ms] text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">{t.footer.newsletter}</h4>
            <p className="text-muted-foreground mb-4">
              {t.footer.newsletterDesc}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder={t.footer.yourEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted text-foreground"
                required 
                disabled={isSubscribing}
              />
              <Button 
                type="submit" 
                className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Suscribiendo..." : t.footer.subscribe}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} SERQUI. {t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
