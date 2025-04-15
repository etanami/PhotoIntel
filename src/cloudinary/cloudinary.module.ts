import { Module } from '@nestjs/common';
import { CloudinaryService } from './providers/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from 'src/cloudinary/providers/cloudinary.provider';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  imports: [ConfigService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
