import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { ApiResponseDto } from '../performance/dto/api-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../../user/entities/user.entity';

@ApiTags('auth')
@ApiExtraModels(AuthResponseDto, UserResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/UserResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 409, description: '이미 존재하는 ID' })
  async signup(@Body() signupDto: SignupDto): Promise<ApiResponseDto<UserResponseDto>> {
    const result = await this.authService.signup(signupDto);
    return {
      message: '회원가입이 완료되었습니다.',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/AuthResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return {
      message: '로그인에 성공했습니다.',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/UserResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getMe(@GetUser() user: User): Promise<ApiResponseDto<UserResponseDto>> {
    return {
      message: '사용자 정보를 조회했습니다.',
      data: this.authService.toUserResponseDto(user),
    };
  }
}
