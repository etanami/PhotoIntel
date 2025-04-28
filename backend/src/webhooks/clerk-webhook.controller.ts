// src/webhooks/clerk.controller.ts
import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/providers/users.service';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';

@Controller('webhooks')
export class ClerkWebhookController {
  private readonly webhookSecret: string;

  constructor(
    // Inject usersService
    private usersService: UsersService,

    // Inject configService
    private readonly configService: ConfigService,
  ) {
    // Get webhook secret key
    this.webhookSecret = this.configService.get('CLERK_WEBHOOK_SIGNING_SECRET');
  }

  @Post('clerk')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const wh = new Webhook(this.webhookSecret);
    const headers = req.headers;
    const payload = req.rawBody.toString('utf-8');

    let msg;

    //console.log('Webhook Headers:', headers);
    try {
      msg = wh.verify(payload, {
        'svix-id': headers['svix-id'] as string,
        'svix-timestamp': headers['svix-timestamp'] as string,
        'svix-signature': headers['svix-signature'] as string,
      });

      console.log('Message', msg);
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return res.status(401).send('Invalid signature');
    }

    // If the webhookEvent contains user details, create a new user in the database
    const userId = msg.data.id;
    const email = msg.data.email_addresses[0].email_address;
    const createdAt = new Date(msg.data.created_at);

    if (userId && email && createdAt) {
      try {
        await this.usersService.createUser(userId, email, createdAt);
        return res.status(200).send('User created successfully');
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Failed to create user');
      }
    } else {
      console.error('Missing required information in webhook event');
      return res.status(400).send('Missing required information');
    }
  }
}
