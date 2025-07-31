import express from 'express';
import authRoutes from './Routes/authRoutes'
import indexRoutes from './Routes/index';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', indexRoutes);

app.listen(3000, () => {
  console.log('Estamos navegando em http://localhost:3000');
});
