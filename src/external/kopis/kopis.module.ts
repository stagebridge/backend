import { Module } from '@nestjs/common';
import { KopisService } from './kopis.service';

@Module({
  providers: [KopisService],
  exports: [KopisService],
})
export class KopisModule {}

