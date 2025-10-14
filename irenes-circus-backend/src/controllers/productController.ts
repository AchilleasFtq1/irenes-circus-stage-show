import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import logger from '../config/logger';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { active, category, q, sort } = req.query as any;
    const filter: any = {};
    if (active !== undefined) filter.active = active === 'true';
    if (category) filter.category = category;
    if (q) filter.$text = { $search: String(q) };
    let query = Product.find(filter);
    // Sorting: priceAsc, priceDesc, newest
    if (sort === 'priceAsc') query = query.sort({ priceCents: 1 });
    else if (sort === 'priceDesc') query = query.sort({ priceCents: -1 });
    else query = query.sort({ createdAt: -1 });
    const products = await query.exec();
    res.json(products);
  } catch (error: any) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
    res.json(product);
  } catch (error: any) {
    logger.error('Error fetching product by id:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
    res.json(product);
  } catch (error: any) {
    logger.error('Error fetching product by slug:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    logger.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
    res.json(product);
  } catch (error: any) {
    logger.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ message: 'Product not found' }); return; }
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    logger.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category', { active: true, category: { $ne: null, $ne: '' } });
    res.json(categories.sort());
  } catch (error: any) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};


