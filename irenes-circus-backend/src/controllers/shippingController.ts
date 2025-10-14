import { Request, Response } from 'express';
import ShippingConfig from '../models/ShippingConfig';
import logger from '../config/logger';

export const getShippingOptionsByCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const country = String(req.params.country || '').toUpperCase();
    if (!country || country.length !== 2) { res.status(400).json({ message: 'Invalid country' }); return; }
    const cfg = await ShippingConfig.findOne({ country });
    res.json((cfg?.options || []).filter(o => o.active !== false));
  } catch (error) {
    logger.error('Error fetching shipping options:', error);
    res.status(500).json({ message: 'Failed to fetch shipping options' });
  }
};

export const upsertShippingConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, options } = req.body as { country: string; options: Array<{ id: string; name: string; description?: string; priceCents: number; active?: boolean }> };
    if (!country || !Array.isArray(options)) { res.status(400).json({ message: 'Invalid payload' }); return; }
    const normalizedCountry = country.toUpperCase();
    const cfg = await ShippingConfig.findOneAndUpdate(
      { country: normalizedCountry },
      { country: normalizedCountry, options },
      { new: true, upsert: true }
    );
    res.json(cfg);
  } catch (error) {
    logger.error('Error upserting shipping config:', error);
    res.status(500).json({ message: 'Failed to save shipping config' });
  }
};

export const listShippingConfigs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cfgs = await ShippingConfig.find().sort({ country: 1 });
    res.json(cfgs);
  } catch (error) {
    logger.error('Error listing shipping configs:', error);
    res.status(500).json({ message: 'Failed to list shipping configs' });
  }
};

export const deleteShippingConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country } = req.params;
    await ShippingConfig.findOneAndDelete({ country: String(country).toUpperCase() });
    res.json({ message: 'Deleted' });
  } catch (error) {
    logger.error('Error deleting shipping config:', error);
    res.status(500).json({ message: 'Failed to delete shipping config' });
  }
};


