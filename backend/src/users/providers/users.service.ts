import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    // Injecting userRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUser(clerkId: string) {
    try {
      return await this.userRepository.findOne({where: { clerkId } });
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Failed to find user');
    }
  }

  async createUser(userId: string, email: string, createdAt: Date) {
    try {
      const newUser = this.userRepository.create({ clerkId: userId, email, createdAt });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
