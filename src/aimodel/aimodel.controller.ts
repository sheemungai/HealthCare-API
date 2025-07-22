import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './aimodel.service';
import { Public } from 'src/auth/decorators';

@Public()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/ava')
  async askAva(
    @Body()
    body: {
      message: string;
      role: 'doctor' | 'patient';
    },
  ) {
    const { message, role } = body;

    const reply = await this.aiService.askAva(message, role);
    return {
      success: true,
      assistant: 'Ava',
      data: { reply },
      timestamp: new Date().toISOString(),
    };
  }
}
