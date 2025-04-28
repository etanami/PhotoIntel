import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiService } from 'src/ai/providers/ai.service';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';
import { UsersService } from 'src/users/providers/users.service';
import { extractExifData } from 'src/utils/exif-parser';
import { Image } from '../image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    // Inject cloudinary
    private readonly cloudinary: CloudinaryService,

    // Inject AIservice
    private readonly aiService: AiService,

    // Inject usersService
    private readonly usersService: UsersService,

    // Inject imageRepository
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  public async uploadImage(file: Express.Multer.File, clerkId: string) {
    try {
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
      const user = await this.usersService.findUser(clerkId);
      console.log(user);

      // Save image details to DB
      const image = this.imageRepository.create({
        url: uploadedFile.secure_url,
        metadata: exifData,
        aiSummary: summary,
        user,
      });
      
      try {
        await this.imageRepository.save(image);
      } catch (error) {
        console.error('Error saving image to database:', error);
        throw new InternalServerErrorException(`Failed to save image to database: ${error.message}`);
      }

      return {
        message: 'Image upload successful',
        image,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
