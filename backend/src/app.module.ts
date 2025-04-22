import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkGuard } from './auth/clerk.guard';

@Module({
  imports: [ConfigModule.forRoot(), CloudinaryModule, ImagesModule, AIModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkGuard,
    },
  ],
})
export class AppModule {}
