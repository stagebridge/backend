import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id: signupDto.id },
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 ID입니다.');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.userRepository.create({
      id: signupDto.id,
      password: hashedPassword,
      nickname: signupDto.nickname,
      email: signupDto.email || null,
    });

    const savedUser = await this.userRepository.save(user);

    return this.toUserResponseDto(savedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const userId = loginDto.id.trim();
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const hashedPassword = user?.password;

    if (!user || !hashedPassword) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    return {
      accessToken: this.signAccessToken(user),
      user: this.toUserResponseDto(user),
    };
  }

  async validateUser(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  toUserResponseDto(user: User): UserResponseDto {
    return {
      uuid: user.uuid,
      id: user.id,
      nickname: user.nickname,
      email: user.email || null,
    };
  }

  private signAccessToken(user: User): string {
    const payload = { sub: user.uuid, id: user.id };
    return this.jwtService.sign(payload);
  }
}
