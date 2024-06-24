import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function registerUser(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const emailVerifyToken = crypto.randomBytes(32).toString('hex')

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerifyToken,
      emailVerified: true,  // 一時的に全てのユーザーを確認済みとする
    },
  })

  // ここで確認メールを送信する処理を追加します（後で実装）

  return { id: user.id, email: user.email, name: user.name }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('User not found')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }

  if (!user.emailVerified) {
    throw new Error('Email not verified')
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  )

  return { token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } })

  if (!user) {
    throw new Error('Invalid token')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null },
  })

  return { message: 'Email verified successfully' }
}
