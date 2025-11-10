import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
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

  @Get('main')
  async findMainPerformances(
    @Query('genre') genre?: string,
  ): Promise<ApiResponseDto<{
    ranked: Omit<PerformanceSummaryDto, 'mt20id'>[];
    byGenre: Omit<PerformanceSummaryDto, 'mt20id'>[];
  }>> {
    if (!genre) {
      throw new BadRequestException('genre 파라미터는 필수입니다.');
    }
    
    const data = await this.performanceApiService.findMainPerformances(genre);
    
    return {
      message: '메인 화면 공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }
}

