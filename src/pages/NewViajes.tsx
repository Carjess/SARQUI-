import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDestinationTranslation } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutDialog from "@/components/CheckoutDialog";
import { ArrowUpDown } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  duration: string;
}

export default function NewViajes() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
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

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");
  const [filterLocation, setFilterLocation] = useState<"all" | "chichiriviche" | "canaima" | "merida">("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{id: string; name: string; price: number; slug: string; location: string} | null>(null);

  useEffect(() => {
    fetchDestinations();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [destinations, sortBy, filterLocation]);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("id, name, slug, description, location, price, image_url, duration");
      
      if (error) throw error;
      setDestinations(data || []);
    } catch (error: any) {
      toast.error("Error al cargar destinos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...destinations];

    // Filtrar por ubicación
    if (filterLocation !== "all") {
      filtered = filtered.filter(dest => {
        const location = dest.location.toLowerCase();
        if (filterLocation === "chichiriviche") {
          return location.includes("chichiriviche") || location.includes("falcón");
        } else if (filterLocation === "canaima") {
          return location.includes("canaima") || location.includes("bolívar");
        } else if (filterLocation === "merida") {
          return location.includes("mérida");
        }
        return true;
      });
    }

    // Ordenar por precio
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredDestinations(filtered);
  };

  const handleBooking = (destination: Destination) => {
    if (!user) {
      toast.error(t.checkout.loginRequired);
      navigate("/auth");
      return;
    }
    setSelectedDestination({
      id: destination.id,
      name: destination.name,
      price: destination.price,
      slug: destination.slug,
      location: destination.location
    });
    setCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">{t.profile.loading}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <span className="text-sm text-secondary font-medium uppercase tracking-wider">
                {t.viajes.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
                {t.viajes.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t.viajes.description}
              </p>
            </div>
          </div>
        </section>
        
        {/* Filters Section */}
        <section className="section">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Select value={filterLocation} onValueChange={(value: any) => setFilterLocation(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filtrar por destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los destinos</SelectItem>
                    <SelectItem value="chichiriviche">Chichiriviche y Cayos</SelectItem>
                    <SelectItem value="canaima">Canaima</SelectItem>
                    <SelectItem value="merida">Mérida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Ordenar por precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por defecto</SelectItem>
                    <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination, index) => (
                <div
                  key={destination.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-card h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={getLocalImage(destination.slug)}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                        <p className="text-sm opacity-90">{destination.location}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
                        {getDestinationTranslation(destination.slug, 'description', language as 'en' | 'es', t) || destination.description}
                      </p>
                      
                      <div className="mb-4 text-sm text-muted-foreground">
                        <p><strong>{t.viajes.duration}:</strong> {destination.duration}</p>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Button 
                          variant="outline" 
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => navigate(`/destination/${destination.slug}`)}
                        >
                          {t.viajes.viewDetails}
                        </Button>
                        
                        <Button 
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                          onClick={() => handleBooking(destination)}
                        >
                          {t.viajes.schedule} - ${destination.price}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {filteredDestinations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {t.viajes.noDestinationsFound}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      
      {selectedDestination && (
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          destination={selectedDestination}
        />
      )}
    </div>
  );
}
