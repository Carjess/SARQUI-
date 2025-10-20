import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Valida un número de tarjeta de crédito usando el algoritmo de Luhn
 * @param cardNumber - El número de tarjeta como string (solo dígitos)
 * @returns true si el número es válido según Luhn, false en caso contrario
 */
export function validateLuhn(cardNumber: string): boolean {
  // Remover espacios y caracteres no numéricos
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Verificar que solo contenga dígitos y tenga entre 13 y 16 caracteres
  if (!/^\d{13,16}$/.test(cleanNumber)) {
    return false;
  }
  
  // Convertir a array de números
  const digits = cleanNumber.split('').map(Number);
  
  // Aplicar el algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  // Iterar desde la derecha hacia la izquierda
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  // El número es válido si la suma es divisible por 10
  return sum % 10 === 0;
}

/**
 * Detecta el tipo de tarjeta basado en el número
 * @param cardNumber - El número de tarjeta como string
 * @returns El tipo de tarjeta detectado
 */
export function detectCardType(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Visa: empieza con 4
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }
  
  // Mastercard: empieza con 5[1-5] o 2[2-7]
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }
  
  // American Express: empieza con 34 o 37
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }
  
  // Discover: empieza con 6
  if (/^6/.test(cleanNumber)) {
    return 'discover';
  }
  
  return 'unknown';
}

/**
 * Formatea un número de tarjeta agregando espacios cada 4 dígitos
 * @param cardNumber - El número de tarjeta como string
 * @returns El número formateado con espacios
 */
export function formatCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const cardType = detectCardType(cleanNumber);
  
  // Limitar a 16 dígitos máximo para tarjetas estándar, 15 para Amex
  const maxDigits = cardType === 'amex' ? 15 : 16;
  const limitedNumber = cleanNumber.slice(0, maxDigits);
  
  // American Express tiene formato diferente (4-6-5)
  if (cardType === 'amex') {
    return limitedNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }
  
  // Otros tipos de tarjeta tienen formato estándar (4-4-4-4)
  return limitedNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Función para obtener traducciones de destinos
export function getDestinationTranslation(slug: string, field: 'description' | 'highlights' | 'includes', language: string, translations: any) {
  const destination = translations.destinations?.[slug];
  if (destination && destination[field]) {
    return destination[field];
  }
  return null; // Si no hay traducción, devolver null para usar el valor de la BD
}