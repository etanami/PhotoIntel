import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(clerkId: string) {
    return this.prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId },
    });
  }
}
