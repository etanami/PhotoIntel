import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [ConfigModule.forRoot(), CloudinaryModule, ImagesModule, AIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
