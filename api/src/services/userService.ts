import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserByMemberNumber(memberNumber: string) {
  return prisma.user.findUnique({
    where: { memberNumber },
    select: { id: true, name: true, memberNumber: true, email: true },
  });
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, memberNumber: true },
  });
}

export async function updateUser(userId: number, updateData: any) {
  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
}
