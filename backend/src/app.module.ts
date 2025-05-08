import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIModule } from './ai/ai.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkGuard } from './auth/clerk.guard';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClerkWebhookController } from './webhooks/clerk-webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        //synchronize: true,
      }),
    }),
    CloudinaryModule,
    ImagesModule,
    AIModule,
    UsersModule,
  ],
  controllers: [AppController, ClerkWebhookController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkGuard,
    },
  ],
})
export class AppModule {}
