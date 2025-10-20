import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDestinationTranslation } from "@/lib/utils";
import { MapPin, Clock, DollarSign, Users, CheckCircle } from "lucide-react";
import CheckoutDialog from "@/components/CheckoutDialog";

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  full_description: string;
  price: number;
  duration: string;
  departure_location: string;
  includes: string[];
  highlights: string[];
  image_url: string;
  gallery_urls: string[] | null;
}

export default function DestinationDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Función para obtener imágenes locales
  const getLocalImage = (slug: string) => {
    const imageMap: { [key: string]: string } = {
      'cayo-sombrero': '/assets/cayo-sombrero.jpg',
      'cayo-sal': '/assets/cayo-sal.jpg',
      'cayo-peraza': '/assets/cayo-peraza.jpg',
      'cayo-muerto': '/assets/cayo-muerto.jpg',
      'salto-angel': '/assets/canaima.jpg',
      'recorrido-tepuyes': '/assets/Recorrido Tepuyes.jpg',
      'laguna-canaima': '/assets/laguna-canaima.jpg',
      'parque-sierra-nevada': '/assets/merida-andes.jpg',
      'pico-el-aguila': '/assets/Pico el aguila.jpg'
    };
    
    return imageMap[slug] || '/assets/SARQUI.jpg';
  };

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setDestination(data);
      }
      setLoading(false);
    };

    fetchDestination();
  }, [slug]);

  const handleBooking = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t.destination.loading}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t.destination.notFound}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={getLocalImage(slug || '')}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                {destination.name}
              </h1>
              <p className="text-xl text-white/90 flex items-center gap-2 animate-fade-in [animation-delay:100ms]">
                <MapPin className="h-5 w-5" />
                {destination.location}
              </p>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="container max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="animate-fade-in shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t.destination.about}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify">
                      {getDestinationTranslation(destination.slug, 'description', language as 'en' | 'es', t) || destination.full_description}
                    </p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in [animation-delay:100ms] shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t.destination.highlights}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {(getDestinationTranslation(destination.slug, 'highlights', language as 'en' | 'es', t) || destination.highlights).map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in [animation-delay:200ms] shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t.destination.includes}</h2>
                    <div className="space-y-3">
                      {(getDestinationTranslation(destination.slug, 'includes', language as 'en' | 'es', t) || destination.includes).map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24 animate-fade-in [animation-delay:300ms] shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${destination.price.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">{t.destination.perPerson}</p>
                    </div>

                    <div className="space-y-4 border-t border-b py-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{t.destination.duration}</p>
                          <p className="text-sm text-muted-foreground">{destination.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{t.destination.departure}</p>
                          <p className="text-sm text-muted-foreground">{destination.departure_location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{t.destination.groupSize}</p>
                          <p className="text-sm text-muted-foreground">{t.destination.groupSizeDetails}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="lg"
                    >
                      {t.destination.bookNow}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.destination.bookingNote}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {destination && (
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          destination={{
            id: destination.id,
            name: destination.name,
            price: destination.price,
            slug: destination.slug,
            location: destination.location
          }}
        />
      )}
    </div>
  );
}
