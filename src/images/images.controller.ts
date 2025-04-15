import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './providers/images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaxFileSize } from './constants/max-image.filesize';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MaxFileSize } }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.uploadToCloudinary(file);
  }
}
