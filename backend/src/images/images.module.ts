import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './providers/images.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AIModule } from 'src/ai/ai.module';

@Module({
  imports: [CloudinaryModule, AIModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
