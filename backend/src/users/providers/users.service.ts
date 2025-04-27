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
    return await this.userRepository.findOne({ where: { clerkId } });
  }

  async createUser(userId: string, email: string) {
    try {
      const newUser = this.userRepository.create({ clerkId: userId, email });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
