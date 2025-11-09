import { Controller, Get } from '@nestjs/common';
import { PerformanceApiService } from './performance-api.service';
import { PerformanceSummaryDto } from './dto/performance-summary.dto';
import { ApiResponseDto } from './dto/api-response.dto';

@Controller('api/performances')
export class PerformanceApiController {
  constructor(private readonly performanceApiService: PerformanceApiService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
    const data = await this.performanceApiService.findAllSummaries();
    
    return {
      message: '공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }
}

