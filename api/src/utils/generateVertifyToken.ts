import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateVerifyToken(): Promise<string> {
  while (true) {
    const emailVerifyToken = generateRandomToken(); // 36文字のランダムな英数字を生成
    const existingUser = await prisma.user.findUnique({ where: { emailVerifyToken } });
    if (!existingUser) {
      return emailVerifyToken;
    }
  }
}

function generateRandomToken(): string {
  return crypto.randomBytes(18).toString('hex');
}
