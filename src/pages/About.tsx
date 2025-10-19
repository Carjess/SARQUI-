import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <span className="text-sm text-secondary font-medium uppercase tracking-wider">
                {t.about.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
                {t.about.title}
              </h1>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t.about.mission.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t.about.mission.description}
                </p>
              </div>
              
              <div className="relative animate-fade-in [animation-delay:200ms]">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src="/assets/SARQUI COMPLETO.jpg"
                    alt="Venezuela Tourism" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="section bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative animate-fade-in order-2 lg:order-1">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src="/assets/oficina sarqui.jpg"
                    alt="Travel Planning" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="animate-fade-in order-1 lg:order-2 [animation-delay:200ms]">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t.about.story.title}
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                  {t.about.story.description}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="section">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t.about.values.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="animate-fade-in border-0 bg-card hover:shadow-lg transition-all duration-300" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t.about.values.quality.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.about.values.quality.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in border-0 bg-card hover:shadow-lg transition-all duration-300" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t.about.values.transparency.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.about.values.transparency.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in border-0 bg-card hover:shadow-lg transition-all duration-300" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                    <Heart className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t.about.values.passion.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.about.values.passion.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
