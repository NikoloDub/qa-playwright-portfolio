import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
