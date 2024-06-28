import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, verifyEmail } from './services/authService';

const app = express();
const prisma = new PrismaClient();
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

// JWTの検証ミドルウェア
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        console.log('Token verification failed:', err);
        return res.sendStatus(403);
      }
      req.user = { userId: decoded.userId };
      next();
    },
  );
};


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World from Express!' });
});

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'A user with this email already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// 全ユーザーを取得するエンドポイント（全カラムを取得）
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// IDを指定してユーザーを削除するエンドポイント
app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// IDを指定してユーザー情報を更新するエンドポイント
app.put('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/users/:memberNumber', async (req: Request, res: Response) => {
  const { memberNumber } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { memberNumber },
      select: { id: true, name: true, memberNumber: true, email: true },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 現在のユーザー情報を取得するエンドポイント
app.get('/api/me', authenticateToken, async (req: Request, res: Response) => {
  console.log(req);
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, memberNumber: true }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

app.get('/verify-email/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await verifyEmail(token);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

// プロフィール取得エンドポイント
app.get('/api/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// プロフィール更新エンドポイント（名前のみ）
app.put('/api/profile', authenticateToken, async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.userId },
      data: { name },
    });
    res.json({ name: updatedUser.name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
