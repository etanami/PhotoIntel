import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/providers/ai.service';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';
import { UsersService } from 'src/users/providers/users.service';
import { extractExifData } from 'src/utils/exif-parser';
import { UploadImageDto } from '../dtos/upload-image-dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(
    // Inject cloudinary
    private readonly cloudinary: CloudinaryService,

    // Inject AIservice
    private readonly aiService: AiService,

    // Inject usersService
    private readonly usersService: UsersService,

    // Inject prisma
    private readonly prisma: PrismaService,
  ) {}

  public async uploadImage(file: Express.Multer.File, clerkId: string) {
    // Upload file
    const uploadedFile = await this.cloudinary.uploadFile(file);

    // Extract metadata from uploaded image
    const exifData = extractExifData(file.buffer);

    // Image summary using AI
    const summary = await this.aiService.summarizeImage(
      exifData,
      uploadedFile.secure_url,
    );

    // Find user
    const user = await this.usersService.findOrCreateUser(clerkId);
    console.log(user);

    // Save image details to DB
    const image = await this.prisma.image.create({
      data: {
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        metadata: exifData,
        image_summary: summary,
      },
    });

    return {
      message: 'Image upload successful',
      image,
    };
  }
}
