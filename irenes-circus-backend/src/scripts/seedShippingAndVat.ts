import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import ShippingConfig from '../models/ShippingConfig';
import { writeFileSync } from 'fs';
import path from 'path';

// Official VAT list (standard rates) for many European countries; update as needed
const VAT_BY_COUNTRY: Record<string, number> = {
  AT: 20, BE: 21, BG: 20, HR: 25, CY: 19, CZ: 21, DK: 25, EE: 22, FI: 24, FR: 20,
  DE: 19, GR: 24, HU: 27, IE: 23, IT: 22, LV: 21, LT: 21, LU: 17, MT: 18, NL: 21,
  PL: 23, PT: 23, RO: 19, SK: 20, SI: 22, ES: 21, SE: 25, NO: 25, CH: 8.1, GB: 20
};

// Sensible default shipping: standard and express in cents
const defaultOptions = (country: string) => {
  // Example heuristic: base depending on region
  const eu = new Set(Object.keys(VAT_BY_COUNTRY));
  const base = eu.has(country) ? 500 : 1500; // €5 in EU, €15 elsewhere
  return [
    { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', priceCents: base, active: true },
    { id: 'express', name: 'Express Shipping', description: '2-3 business days', priceCents: base + 1000, active: true }
  ];
};

async function main() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
  await mongoose.connect(mongoURI);

  const countries = Object.keys(VAT_BY_COUNTRY);

  for (const c of countries) {
    await ShippingConfig.updateOne(
      { country: c },
      { country: c, options: defaultOptions(c) },
      { upsert: true }
    );
    console.log(`Upserted shipping options for ${c}`);
  }

  // Write VAT file for frontend/backed reference if needed
  const vatPath = path.resolve(__dirname, '../../shared/vat.json');
  try {
    writeFileSync(vatPath, JSON.stringify(VAT_BY_COUNTRY, null, 2));
    console.log(`Wrote VAT data to ${vatPath}`);
  } catch (e) {
    console.warn('Could not write VAT shared file (optional):', e);
  }

  await mongoose.disconnect();
}

main().then(() => { console.log('Seed completed'); process.exit(0); }).catch(err => { console.error(err); process.exit(1); });


