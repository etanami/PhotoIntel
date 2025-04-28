import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './providers/images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaxFileSize } from './constants/max-image.filesize';
import { User } from 'src/auth/user.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MaxFileSize } }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @User() user) {
    console.log(user)
    const clerkId = user.id;
    return this.imagesService.uploadImage(file, clerkId);
  }
}
