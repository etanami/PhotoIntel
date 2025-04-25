import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty()
  @IsString()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  clerkId: string;
}
