'use server';

import { prisma } from '../prisma';

export async function searchUsersByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error searching user by email:', error);
    return null;
  }
}
