import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 UUID' })
  uuid: string;

  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '이메일', nullable: true })
  email: string | null;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT 토큰' })
  accessToken: string;

  @ApiProperty({ description: '사용자 정보', type: UserResponseDto })
  user: UserResponseDto;
}
