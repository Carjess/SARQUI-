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
import { validateLuhn, detectCardType, formatCardNumber } from "@/lib/utils";

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
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    cardType: '',
    error: ''
  });
  
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
    lastName: "",
    documentType: "cedula",
    documentNumber: "",
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

  // Función para limpiar el formulario
  const resetForm = () => {
    setFormData({
      fullName: "",
      lastName: "",
      documentType: "cedula",
      documentNumber: "",
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
    setCardValidation({
      isValid: false,
      cardType: '',
      error: ''
    });
  };

  // Función para manejar el cierre del diálogo
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm(); // Limpiar formulario al cerrar
    }
    onOpenChange(open);
  };

  const handleChange = (field: string, value: string | number) => {
    // Validaciones específicas para campos
    if (field === 'documentNumber') {
      if (formData.documentType === 'cedula') {
        // Solo números, máximo 8 dígitos
        value = (value as string).replace(/\D/g, '').slice(0, 8);
      } else if (formData.documentType === 'pasaporte') {
        // Solo letras y números, máximo 15 caracteres, sin signos
        value = (value as string).replace(/[^A-Za-z0-9]/g, '').slice(0, 15).toUpperCase();
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar tarjeta en tiempo real cuando se cambia el número
    if (field === 'cardNumber') {
      validateCardNumber(value as string);
    }
  };

  // Función para validar el número de tarjeta
  const validateCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanNumber.length === 0) {
      setCardValidation({
        isValid: false,
        cardType: '',
        error: ''
      });
      return;
    }
    
    const cardType = detectCardType(cleanNumber);
    const isValid = validateLuhn(cleanNumber);
    
    let error = '';
    if (cleanNumber.length < 13) {
      error = 'El número de tarjeta es demasiado corto';
    } else if (cleanNumber.length > 16) {
      error = 'El número de tarjeta es demasiado largo';
    } else if (!isValid) {
      error = 'Número de tarjeta inválido';
    } else if (cardType === 'unknown') {
      error = 'Tipo de tarjeta no reconocido';
    }
    
    setCardValidation({
      isValid,
      cardType,
      error
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t.checkout.loginRequired);
      navigate("/auth");
      return;
    }

    if (!formData.fullName || !formData.lastName || !formData.documentNumber || !formData.email || !formData.phone || !formData.travelDate) {
      toast.error(t.checkout.fillAllRequired);
      return;
    }

    // Validar documento de identidad
    if (formData.documentType === 'cedula' && formData.documentNumber.length < 7) {
      toast.error("La cédula debe tener al menos 7 dígitos");
      return;
    }
    
    if (formData.documentType === 'pasaporte' && formData.documentNumber.length < 5) {
      toast.error("El pasaporte debe tener al menos 5 caracteres");
      return;
    }

    if (formData.paymentMethod === "mobile_payment" && !formData.referenciaPagoMovil) {
      toast.error(t.checkout.fillMobilePaymentRef);
      return;
    }

    if ((formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && 
        (!formData.cardNumber || !formData.cardHolder || !formData.cardExpiry || !formData.cardCVV)) {
      toast.error(t.checkout.fillCardDetails);
      return;
    }

    // Validar número de tarjeta con Luhn si es pago con tarjeta
    if ((formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card")) {
      if (!cardValidation.isValid) {
        toast.error(cardValidation.error || t.checkout.invalidCardNumber);
        return;
      }
    }

    setLoading(true);

    try {
      const totalAmount = destination.price * formData.numTravelers;
      
      const { error } = await (supabase as any).from("purchases").insert([{
        user_id: user.id,
        destination_id: destination.id,
        full_name: `${formData.fullName} ${formData.lastName}`,
        email: formData.email,
        phone: `${formData.phoneCountryCode}${formData.phone}`,
        num_travelers: formData.numTravelers,
        travel_date: formData.travelDate,
        payment_method: formData.paymentMethod,
        total_amount: totalAmount,
        status: "pendiente",
        referencia_bancaria: formData.paymentMethod === "mobile_payment" ? formData.referenciaPagoMovil : null,
        document_type: formData.documentType,
        document_number: formData.documentNumber
      }]);

      if (error) throw error;

      toast.success("¡Pago realizado exitosamente!", {
        description: "En los próximos minutos SARQUI se contactará con usted vía Gmail y WhatsApp"
      });
      
      // Reset form
      setFormData({
        fullName: "",
        lastName: "",
        documentType: "cedula",
        documentNumber: "",
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
      
      handleOpenChange(false);
      navigate("/profile");
    } catch (error: any) {
      toast.error(t.checkout.error, {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const exchangeRate = 210.28; // Tasa de cambio USD a Bs.
  const totalAmountUSD = destination.price * formData.numTravelers;
  const totalAmountBS = totalAmountUSD * exchangeRate;

  const displayAmount = formData.paymentMethod === "mobile_payment" 
    ? (
      <div className="text-right">
        <span className="text-2xl font-bold text-primary">Bs. {totalAmountBS.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground ml-2">(${totalAmountUSD.toFixed(2)})</span>
      </div>
    )
    : `$${totalAmountUSD.toFixed(2)}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                  placeholder={t.checkout.fullName}
                  required
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                  title={t.checkout.onlyLetters}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t.checkout.lastName}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    // Solo permitir letras, espacios y caracteres especiales del español
                    const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    handleChange("lastName", value);
                  }}
                  placeholder={t.checkout.lastName}
                  required
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                  title={t.checkout.onlyLetters}
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
                    title={t.checkout.onlyNumbers}
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">{t.checkout.documentType}</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => {
                    handleChange("documentType", value);
                    // Limpiar el número de documento cuando cambie el tipo
                    handleChange("documentNumber", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cedula">{t.checkout.documentTypes.cedula}</SelectItem>
                    <SelectItem value="pasaporte">{t.checkout.documentTypes.pasaporte}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">
                  {formData.documentType === 'cedula' ? t.checkout.documentNumberPlaceholders.cedula : t.checkout.documentNumberPlaceholders.pasaporte}
                </Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => handleChange("documentNumber", e.target.value)}
                  placeholder={formData.documentType === 'cedula' ? '12345678' : 'AB123456789'}
                  required
                  maxLength={formData.documentType === 'cedula' ? 8 : 15}
                  title={formData.documentType === 'cedula' ? 'Máximo 8 dígitos' : 'Máximo 15 caracteres'}
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.documentType === 'cedula' 
                    ? '' 
                    : ''
                  }
                </p>
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
                      <SelectValue placeholder={t.checkout.selectDate} />
                    </SelectTrigger>
                    <SelectContent>
                      {(availableDates as string[]).map((date) => {
                        const dateObj = new Date(date);
                        const locale = language === 'en' ? 'en-US' : 'es-ES';
                        const dayName = dateObj.toLocaleDateString(locale, { weekday: 'long' });
                        const formattedDate = dateObj.toLocaleDateString(locale, { 
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
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          handleChange("cardNumber", formatted);
                        }}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                        className={cardValidation.error ? "border-red-500" : cardValidation.isValid ? "border-green-500" : ""}
                      />
                      {cardValidation.cardType && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs font-medium text-muted-foreground capitalize">
                            {cardValidation.cardType}
                          </span>
                        </div>
                      )}
                    </div>
                    {cardValidation.error && (
                      <p className="text-sm text-red-500">{cardValidation.error}</p>
                    )}
                    {cardValidation.isValid && (
                      <p className="text-sm text-green-500">✓ Tarjeta válida</p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      
                    </div>
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
                      placeholder={t.checkout.cardHolder}
                      required
                      pattern="[A-ZÁÉÍÓÚÑ\s]+"
                      title={t.checkout.onlyLettersUppercase}
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
                    maxLength={12}
                    title={t.checkout.onlyNumbers}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">{t.checkout.total}:</span>
              {formData.paymentMethod === "mobile_payment" ? (
                displayAmount
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {displayAmount}
                </span>
              )}
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
