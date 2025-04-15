import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';
import { extractExifData } from 'src/utils/exif-parser';

@Injectable()
export class ImagesService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  public async uploadToCloudinary(file: Express.Multer.File) {
    const uploadedFile = await this.cloudinary.uploadFile(file);
    // console.log(uploadedFile);

    const exifData = extractExifData(file.buffer);
    console.log('EXIF Data:', exifData);

    return {
      message: 'File upload successful',
      url: uploadedFile.secure_url,
      public_id: uploadedFile.public_id,
      exifData,
    };
  }
}
