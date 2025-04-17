import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  public async summarizeImage(exif: any, url: string): Promise<string> {
    const prompt = this.prompt(exif, url);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "You're a photo analysis assistant.",
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_completion_tokens: 200,
    });

    return response.choices[0].message?.content ?? '';
  }

  private prompt(exif: any, url: string): string {
    return `
      Generate a summary of the image at this URL: ${url}. Make sure it's 
      human-readable and descriptive enough. No need to reference the 'url' in
       your summary. Make it natural as though you can see the image too.

      Here's the available metadata:
      - Camera Make: ${exif.cameraMake ?? 'Unknown'}
      - Camera Model: ${exif.cameraModel ?? 'Unknown'}
      - Date Taken: ${exif.dateTaken ?? 'Unknown'}
      - Latitude: ${exif.latitude ?? 'Unknown'}
      - Longitude: ${exif.longitude ?? 'Unknown'}

      If exact values are missing or unknown, include a creative interpretation in regards 
      to the image. And not a random one.
    `;
  }
}
