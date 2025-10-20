import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface Purchase {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  travel_date: string;
  destinations: {
    name: string;
    location: string;
  };
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast.error(t.profile.loadError);
      } else {
        setProfile(data);
      }
    };

    const fetchPurchases = async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          id,
          created_at,
          total_amount,
          status,
          travel_date,
          destinations (
            name,
            location
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPurchases(data as any);
      }
      setLoading(false);
    };

    fetchProfile();
    fetchPurchases();
  }, [user, navigate, t]);

  const handleLogout = async () => {
    await signOut();
    toast.success(t.profile.logoutSuccess);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t.profile.loading}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 section">
        <div className="container max-w-4xl">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold">{t.profile.title}</h1>
            <Button onClick={handleLogout} variant="outline">
              {t.profile.logout}
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="animate-fade-in [animation-delay:100ms] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t.profile.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.full_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t.profile.memberSince} {new Date(profile?.created_at || "").toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in [animation-delay:200ms] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {t.profile.myPurchases}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t.profile.noPurchases}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <Card
                        key={purchase.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{purchase.destinations.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {purchase.destinations.location}
                              </p>
                            </div>
                            <span className="text-lg font-bold text-primary">
                              ${purchase.total_amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{t.profile.travelDate}: {new Date(purchase.travel_date).toLocaleDateString()}</span>
                            <span className="capitalize">{purchase.status}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
