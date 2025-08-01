import express from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './Routes/authRoutes'
import indexRoutes from './Routes/index';

const app = express();
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes     
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { error: "Muitas requisições, tente novamente mais tarde." }
});
app.use(globalLimiter);

app.use('/auth', authRoutes);
app.use('/', indexRoutes);

app.listen(3000, () => {
  console.log('Estamos navegando em http://localhost:3000');
});
