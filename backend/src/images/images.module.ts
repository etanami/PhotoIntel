import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './providers/images.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AIModule } from 'src/ai/ai.module';
import { UsersModule } from 'src/users/users.module';
import { Image } from './image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    CloudinaryModule,
    AIModule,
    UsersModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
