export function paiseToCurrency(paise: number): string {
  const rupees = paise / 100;
  return rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(paise: number, symbol: string = "₹"): string {
  return `${symbol}${paiseToCurrency(paise)}`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function calculateLineTotal(unitPriceInPaise: number, quantity: number): number {
  return unitPriceInPaise * quantity;
}

export function calculateSubtotal(items: Array<{ unitPriceInPaise: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item.unitPriceInPaise, item.quantity), 0);
}

export function calculateDiscount(subtotalInPaise: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent > 100) return 0;
  return Math.round(subtotalInPaise * (discountPercent / 100));
}

export function calculateTax(amountInPaise: number, taxPercent: number): number {
  if (taxPercent <= 0) return 0;
  return Math.round(amountInPaise * (taxPercent / 100));
}

export function calculateServiceCharge(amountInPaise: number, servicePercent: number): number {
  if (servicePercent <= 0) return 0;
  return Math.round(amountInPaise * (servicePercent / 100));
}

export interface BillCalculation {
  subtotalInPaise: number;
  discountInPaise: number;
  taxableAmountInPaise: number;
  taxInPaise: number;
  serviceInPaise: number;
  totalInPaise: number;
}

export function calculateBill(
  items: Array<{ unitPriceInPaise: number; quantity: number }>,
  discountPercent: number = 0,
  taxPercent: number = 5,
  servicePercent: number = 0
): BillCalculation {
  const subtotalInPaise = calculateSubtotal(items);
  const discountInPaise = calculateDiscount(subtotalInPaise, discountPercent);
  const taxableAmountInPaise = subtotalInPaise - discountInPaise;
  const taxInPaise = calculateTax(taxableAmountInPaise, taxPercent);
  const serviceInPaise = calculateServiceCharge(taxableAmountInPaise, servicePercent);
  const totalInPaise = taxableAmountInPaise + taxInPaise + serviceInPaise;

  return {
    subtotalInPaise,
    discountInPaise,
    taxableAmountInPaise,
    taxInPaise,
    serviceInPaise,
    totalInPaise,
  };
}
