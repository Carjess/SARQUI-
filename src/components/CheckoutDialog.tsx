import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { CreditCard, Smartphone } from "lucide-react";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: {
    id: string;
    name: string;
    price: number;
    slug: string;
    location: string;
  };
}

export default function CheckoutDialog({ open, onOpenChange, destination }: CheckoutDialogProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Determinar si es destino Canaima o Full-day
  const isCanaima = destination.location.toLowerCase().includes('canaima') || 
                    destination.slug.toLowerCase().includes('canaima');
  const departureLocation = isCanaima 
    ? "Aeropuerto Internacional de Maiquetía Simón Bolívar" 
    : "Plaza Venezuela, Caracas";
  
  // Generar fechas disponibles
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    
    if (isCanaima) {
      // Canaima: cualquier fecha desde 3 días en adelante
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 3);
      return minDate.toISOString().split('T')[0];
    } else {
      // Full-day: próximos 4 viernes y sábados
      let currentDate = new Date(today);
      while (dates.length < 4) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        // 5 = Viernes, 6 = Sábado
        if (dayOfWeek === 5 || dayOfWeek === 6) {
          dates.push(currentDate.toISOString().split('T')[0]);
        }
      }
      return dates;
    }
  };

  const availableDates = getAvailableDates();
  const minTravelers = 1; // Mínimo 1 persona para todos los viajes

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    phoneCountryCode: "+58",
    numTravelers: minTravelers,
    travelDate: "",
    paymentMethod: "credit_card",
    referenciaPagoMovil: "",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCVV: ""
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t.checkout.loginRequired);
      navigate("/auth");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.travelDate) {
      toast.error(t.checkout.fillAllFields);
      return;
    }

    if (formData.paymentMethod === "mobile_payment" && !formData.referenciaPagoMovil) {
      toast.error("Por favor ingrese el número de referencia del pago móvil");
      return;
    }

    if ((formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && 
        (!formData.cardNumber || !formData.cardHolder || !formData.cardExpiry || !formData.cardCVV)) {
      toast.error("Por favor complete todos los datos de la tarjeta");
      return;
    }

    setLoading(true);

    try {
      const totalAmount = destination.price * formData.numTravelers;
      
      const { error } = await (supabase as any).from("purchases").insert([{
        user_id: user.id,
        destination_id: destination.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: `${formData.phoneCountryCode}${formData.phone}`,
        num_travelers: formData.numTravelers,
        travel_date: formData.travelDate,
        payment_method: formData.paymentMethod,
        total_amount: totalAmount,
        status: "pendiente",
        referencia_bancaria: formData.paymentMethod === "mobile_payment" ? formData.referenciaPagoMovil : null
      }]);

      if (error) throw error;

      toast.success("¡Pago realizado exitosamente!", {
        description: "En los próximos minutos SARQUI se contactará con usted vía Gmail y WhatsApp"
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        phoneCountryCode: "+58",
        numTravelers: 1,
        travelDate: "",
        paymentMethod: "credit_card",
        referenciaPagoMovil: "",
        cardNumber: "",
        cardHolder: "",
        cardExpiry: "",
        cardCVV: ""
      });
      
      onOpenChange(false);
      navigate("/profile");
    } catch (error: any) {
      toast.error(t.checkout.error, {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = destination.price * formData.numTravelers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t.checkout.title}</DialogTitle>
          <p className="text-muted-foreground">{destination.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Formulario seguro
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Por seguridad, este formulario no guarda datos en el navegador. 
                    Los datos de pago se procesan de forma segura y no se almacenan localmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.checkout.personalInfo}</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.checkout.fullName}</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    // Solo permitir letras, espacios y caracteres especiales del español
                    const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    handleChange("fullName", value);
                  }}
                  placeholder="Juan Pérez"
                  required
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                  title="Solo letras y espacios"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.checkout.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.checkout.phone}</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.phoneCountryCode}
                    onValueChange={(value) => handleChange("phoneCountryCode", value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+58">🇻🇪 +58</SelectItem>
                      <SelectItem value="+57">🇨🇴 +57</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+34">🇪🇸 +34</SelectItem>
                      <SelectItem value="+52">🇲🇽 +52</SelectItem>
                      <SelectItem value="+54">🇦🇷 +54</SelectItem>
                      <SelectItem value="+56">🇨🇱 +56</SelectItem>
                      <SelectItem value="+51">🇵🇪 +51</SelectItem>
                      <SelectItem value="+55">🇧🇷 +55</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ''))}
                    placeholder="4121234567"
                    required
                    pattern="[0-9]+"
                    maxLength={10}
                    title="Solo números"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numTravelers">{t.checkout.numTravelers}</Label>
                <Input
                  id="numTravelers"
                  type="number"
                  min={minTravelers}
                  max="20"
                  value={formData.numTravelers}
                  onChange={(e) => handleChange("numTravelers", parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="travelDate">{t.checkout.travelDate}</Label>
                {isCanaima ? (
                  <Input
                    id="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => handleChange("travelDate", e.target.value)}
                    min={availableDates as string}
                    required
                  />
                ) : (
                  <Select
                    value={formData.travelDate}
                    onValueChange={(value) => handleChange("travelDate", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      {(availableDates as string[]).map((date) => {
                        const dateObj = new Date(date);
                        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
                        const formattedDate = dateObj.toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        });
                        return (
                          <SelectItem key={date} value={date}>
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1)} - {formattedDate}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
                
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.checkout.paymentInfo}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">{t.checkout.paymentMethod}</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t.checkout.creditCard}
                    </div>
                  </SelectItem>
                  <SelectItem value="debit_card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t.checkout.debitCard}
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile_payment">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      {t.checkout.mobilePayment}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleChange("cardNumber", e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      required
                      pattern="[0-9]{16}"
                      maxLength={16}
                      title="16 dígitos"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardHolder">{t.checkout.cardHolder}</Label>
                    <Input
                      id="cardHolder"
                      value={formData.cardHolder}
                      onChange={(e) => {
                        // Solo permitir letras y espacios, convertir a mayúsculas
                        const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').toUpperCase();
                        handleChange("cardHolder", value);
                      }}
                      placeholder="NOMBRE APELLIDO"
                      required
                      pattern="[A-ZÁÉÍÓÚÑ\s]+"
                      title="Solo letras mayúsculas y espacios"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">{t.checkout.cardExpiry}</Label>
                    <Input
                      id="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        handleChange("cardExpiry", value);
                      }}
                      placeholder="MM/YY"
                      required
                      pattern="[0-9]{2}/[0-9]{2}"
                      maxLength={5}
                      title="Formato MM/YY"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardCVV">{t.checkout.cardCVV}</Label>
                    <Input
                      id="cardCVV"
                      type="password"
                      value={formData.cardCVV}
                      onChange={(e) => handleChange("cardCVV", e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                      pattern="[0-9]{3,4}"
                      maxLength={4}
                      title="3 o 4 dígitos"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === "mobile_payment" && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Datos para Pago Móvil:</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Banco:</strong> Venezuela 0102</p>
                    <p><strong>C.I:</strong> 30.715.615</p>
                    <p><strong>Teléfono:</strong> 0412-5093738</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenciaPagoMovil">Número de Referencia</Label>
                  <Input
                    id="referenciaPagoMovil"
                    value={formData.referenciaPagoMovil}
                    onChange={(e) => handleChange("referenciaPagoMovil", e.target.value.replace(/\D/g, ''))}
                    placeholder="123456789012"
                    required
                    pattern="[0-9]+"
                    maxLength={20}
                    title="Solo números"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">{t.checkout.total}:</span>
              <span className="text-2xl font-bold text-primary">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              disabled={loading}
            >
              {loading ? t.checkout.processing : t.checkout.confirmPayment}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}