import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';

@Injectable()
export class ImagesService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  public async uploadToCloudinary(file: Express.Multer.File) {
    const uploadedFile = await this.cloudinary.uploadFile(file);
    // console.log(uploadedFile);

    return {
      message: 'File upload successful',
      url: uploadedFile.secure_url,
      public_id: uploadedFile.public_id,
    };
  }
}
