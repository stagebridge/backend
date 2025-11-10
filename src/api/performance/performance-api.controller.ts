import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerformanceApiService } from './performance-api.service';
import { PerformanceSummaryDto } from './dto/performance-summary.dto';
import { ApiResponseDto } from './dto/api-response.dto';
import { MainPerformanceResponseDto } from './dto/main-performance-response.dto';

@ApiTags('performances')
@Controller('api/performances')
export class PerformanceApiController {
  constructor(private readonly performanceApiService: PerformanceApiService) {}

  @Get()
  @ApiOperation({
    summary: '공연 목록 조회',
    description: '모든 공연 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공연 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '공연 목록을 성공적으로 조회했습니다.' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PerformanceSummaryDto' },
        },
      },
    },
  })
  async findAll(): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
    const data = await this.performanceApiService.findAllSummaries();
    
    return {
      message: '공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }

  @Get('main')
  @ApiOperation({
    summary: '메인 화면 공연 목록 조회',
    description: '순위별 및 장르별 공연 목록을 조회합니다. 순위별(ranked)은 모든 장르를 순위순으로, 장르별(byGenre)은 지정한 장르의 공연을 순위순으로 반환합니다.',
  })
  @ApiQuery({
    name: 'genre',
    description: '장르명 (필수)',
    example: '대중음악',
    required: true,
    enum: [
      '복합',
      '연극',
      '뮤지컬',
      '대중무용',
      '대중음악',
      '서양음악(클래식)',
      '한국음악(국악)',
      '서커스/마술',
      '무용(서양/한국무용)',
    ],
  })
  @ApiResponse({
    status: 200,
    description: '메인 화면 공연 목록 조회 성공',
    type: MainPerformanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'genre 파라미터가 없을 경우',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'genre 파라미터는 필수입니다.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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

