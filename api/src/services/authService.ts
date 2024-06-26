import { PrismaClient, Prisma } from '@prisma/client';
import { generateUniqueMemberNumber } from '../utils/generateMemberNumber';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function registerUser(email: string, password: string, name: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const memberNumber = await generateUniqueMemberNumber();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        memberNumber,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('A user with this email already exists');
      }
    }
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  if (!user.emailVerified) {
    throw new Error('Email not verified');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1d',
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      memberNumber: user.memberNumber
    }
  };
}
