import express from 'express';
import authRoutes from './Routes/authRoutes'

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
