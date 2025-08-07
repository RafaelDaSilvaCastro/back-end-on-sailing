import express from 'express';
import authRoutes from './Routes/authRoutes';
import indexRoutes from './Routes/index';
import vesselRoutes from './Routes/vesselRoutes';

const app = express();
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/vessels', vesselRoutes); 

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});