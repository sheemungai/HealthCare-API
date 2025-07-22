import { Module } from '@nestjs/common';
import { AiService } from './aimodel.service';
import { AiController } from './aimodel.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
