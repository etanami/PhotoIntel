import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/providers/ai.service';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';
import { extractExifData } from 'src/utils/exif-parser';

@Injectable()
export class ImagesService {
  constructor(
    // Inject cloudinary
    private readonly cloudinary: CloudinaryService,

    // Inject AIservice
    private readonly aiService: AiService,
  ) {}

  public async uploadToCloudinary(file: Express.Multer.File) {
    // Upload file
    const uploadedFile = await this.cloudinary.uploadFile(file);

    // Extract metadata from uploaded image
    const exifData = extractExifData(file.buffer);

    // Image summary using AI
    const summary = await this.aiService.summarizeImage(
      exifData,
      uploadedFile.secure_url,
    );

    return {
      message: 'Image upload successful',
      url: uploadedFile.secure_url,
      public_id: uploadedFile.public_id,
      metadata: exifData,
      image_summary: summary,
    };
  }
}
