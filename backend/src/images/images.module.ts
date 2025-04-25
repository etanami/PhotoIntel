import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './providers/images.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AIModule } from 'src/ai/ai.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [CloudinaryModule, AIModule, UsersModule, PrismaModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
