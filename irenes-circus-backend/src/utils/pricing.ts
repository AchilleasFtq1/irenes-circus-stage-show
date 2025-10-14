export type OrderItemInput = { priceCents: number; quantity: number };

// Subset of EU VAT rates; defaults to 20% when country unknown
const VAT_BY_COUNTRY: Record<string, number> = {
  AT: 20,
  BE: 21,
  BG: 20,
  HR: 25,
  CY: 19,
  CZ: 21,
  DK: 25,
  EE: 22,
  FI: 24,
  FR: 20,
  DE: 19,
  GR: 24,
  HU: 27,
  IE: 23,
  IT: 22,
  LV: 21,
  LT: 21,
  LU: 17,
  MT: 18,
  NL: 21,
  PL: 23,
  PT: 23,
  RO: 19,
  SK: 20,
  SI: 22,
  ES: 21,
  SE: 25,
  NO: 25,
  CH: 8.1,
  GB: 20,
};

const EU_COUNTRIES = new Set(Object.keys(VAT_BY_COUNTRY));

export function getVatRate(country?: string): number {
  const code = (country || '').toUpperCase();
  if (code && VAT_BY_COUNTRY[code] !== undefined) return VAT_BY_COUNTRY[code];
  return 20; // default reasonable VAT
}

export function computeShippingCents(country: string | undefined, subtotalCents: number): number {
  const code = (country || 'GR').toUpperCase();
  // Simple, deterministic policy:
  // - EU/GB/NO/CH: €5 under €50; free at €50+
  // - Other countries: €15 flat
  if (EU_COUNTRIES.has(code)) {
    return subtotalCents >= 5000 ? 0 : 500;
  }
  if (code === 'GB' || code === 'NO' || code === 'CH') {
    return subtotalCents >= 5000 ? 0 : 700;
  }
  return 1500;
}

export type ShippingOption = {
  id: 'standard' | 'express';
  name: string;
  description: string;
  priceCents: number;
};

// Configurable shipping options derived centrally here (not hardcoded in UI)
export function getShippingOptions(country: string | undefined, subtotalCents: number): ShippingOption[] {
  const baseStandard = computeShippingCents(country, subtotalCents);
  // Express is a premium over standard, capped reasonably
  const expressPremium = 1000; // €10 premium
  const express = Math.max(baseStandard + expressPremium, baseStandard === 0 ? 1000 : baseStandard + expressPremium);
  return [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      priceCents: baseStandard
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      priceCents: express
    }
  ];
}

export function computeTotals(items: OrderItemInput[], country?: string, discountCents: number = 0): {
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
} {
  const rawSubtotal = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
  const discountApplied = Math.min(Math.max(0, discountCents), rawSubtotal);
  const subtotalCents = rawSubtotal - discountApplied;
  const shippingCents = computeShippingCents(country, subtotalCents);
  const vatRate = getVatRate(country);
  const taxCents = Math.round((subtotalCents * vatRate) / 100);
  const totalCents = subtotalCents + shippingCents + taxCents;
  return { subtotalCents, taxCents, shippingCents, totalCents };
}

export function computeTotalsWithShipping(items: OrderItemInput[], country: string | undefined, discountCents: number, shippingCents: number): {
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
} {
  const rawSubtotal = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
  const discountApplied = Math.min(Math.max(0, discountCents), rawSubtotal);
  const subtotalCents = rawSubtotal - discountApplied;
  const vatRate = getVatRate(country);
  const taxCents = Math.round((subtotalCents * vatRate) / 100);
  const totalCents = subtotalCents + shippingCents + taxCents;
  return { subtotalCents, taxCents, shippingCents, totalCents };
}


