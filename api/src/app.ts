import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const port = process.env.PORT || 3000;

// CORS設定
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], // フロントエンドのURL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(express.json());

app.get('/', (_, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
