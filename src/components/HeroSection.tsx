import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/canaima.jpg"
          alt="Venezuelan landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>
      
      <div className="container relative z-10 text-center text-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
         
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in [animation-delay:100ms]">
            {t.hero.title}
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            {t.hero.description}
          </p>
          
          <Button 
            asChild 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/about">{t.hero.cta}</Link>
          </Button>
        </div>
        
      
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
