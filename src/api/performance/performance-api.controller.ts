import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { PerformanceApiService } from './performance-api.service';
import { PerformanceSummaryDto } from './dto/performance-summary.dto';
import { PerformanceDetailDto } from './dto/performance-detail.dto';
import { ApiResponseDto } from './dto/api-response.dto';

@ApiTags('performances')
@ApiExtraModels(PerformanceSummaryDto, PerformanceDetailDto)
@Controller('performances')
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

  @Get('main/ranked')
  @ApiOperation({
    summary: '순위별 공연 목록 조회',
    description: '모든 장르에서 순위(rnum)가 있는 공연만 순위순으로 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '순위별 공연 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '순위별 공연 목록을 성공적으로 조회했습니다.' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PerformanceSummaryDto' },
        },
      },
    },
  })
  async findRankedPerformances(): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
    const data = await this.performanceApiService.findRankedPerformances();
    
    return {
      message: '순위별 공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }

  @Get('main/by-genre')
  @ApiOperation({
    summary: '장르별 공연 목록 조회',
    description: '지정한 장르의 모든 공연을 순위순으로 반환합니다.',
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
    description: '장르별 공연 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '장르별 공연 목록을 성공적으로 조회했습니다.' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PerformanceSummaryDto' },
        },
      },
    },
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
  async findPerformancesByGenre(
    @Query('genre') genre?: string,
  ): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
    if (!genre) {
      throw new BadRequestException('genre 파라미터는 필수입니다.');
    }
    
    const data = await this.performanceApiService.findPerformancesByGenre(genre);
    
    return {
      message: '장르별 공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }

  @Get('main/by-sidonm')
  @ApiOperation({
    summary: '지역별 공연 목록 조회',
    description: '지정한 지역(시도)의 모든 공연을 순위순으로 반환합니다.',
  })
  @ApiQuery({
    name: 'sidonm',
    description: '지역명(시도) (필수)',
    example: '서울',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '지역별 공연 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '지역별 공연 목록을 성공적으로 조회했습니다.' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PerformanceSummaryDto' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'sidonm 파라미터가 없을 경우',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'sidonm 파라미터는 필수입니다.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async findPerformancesBySidonm(
    @Query('sidonm') sidonm?: string,
  ): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
    if (!sidonm) {
      throw new BadRequestException('sidonm 파라미터는 필수입니다.');
    }
    
    const data = await this.performanceApiService.findPerformancesBySidonm(sidonm);
    
    return {
      message: '지역별 공연 목록을 성공적으로 조회했습니다.',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '공연 상세 정보 조회',
    description: '공연 ID를 파라미터로 받아 공연의 상세 정보를 반환합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공연 ID',
    example: 'PF277653',
  })
  @ApiResponse({
    status: 200,
    description: '공연 상세 정보 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '공연 상세 정보를 성공적으로 조회했습니다.' },
        data: { $ref: '#/components/schemas/PerformanceDetailDto' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '공연을 찾을 수 없을 경우',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '공연 ID PF277653를 찾을 수 없습니다.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<PerformanceDetailDto>> {
    const data = await this.performanceApiService.findOne(id);
    
    return {
      message: '공연 상세 정보를 성공적으로 조회했습니다.',
      data,
    };
  }
}

