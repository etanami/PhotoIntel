import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from '../types/cloudinary.response';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  public async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'photo-intel',
        },
        (error, result) => {
          if (error) reject(error);
          return resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
