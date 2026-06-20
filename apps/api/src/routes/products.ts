import { Router } from 'express';
import { products } from '../data/products.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.status(200).json(products);
});
