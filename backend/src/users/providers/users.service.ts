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
}
