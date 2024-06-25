import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUniqueMemberNumber(): Promise<string> {
  while (true) {
    const memberNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existingUser = await prisma.user.findUnique({ where: { memberNumber } });
    if (!existingUser) {
      return memberNumber;
    }
  }
}
