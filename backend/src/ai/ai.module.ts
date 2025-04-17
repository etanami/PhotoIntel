import { Module } from '@nestjs/common';
import { AiService } from './providers/ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AiService],
  exports: [AiService],
})
export class AIModule {}
