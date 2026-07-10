import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigurableAuthGuard } from '../auth/configurable-auth.guard';

@Controller('api/ai')
@UseGuards(ConfigurableAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; ticketContext?: any }) {
    return this.aiService.chat(body.message, body.ticketContext);
  }
}
