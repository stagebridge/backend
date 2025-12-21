import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PerformanceModule } from './performance/performance.module';
import { PerformanceApiModule } from './api/performance/performance-api.module';
import { KopisModule } from './external/kopis/kopis.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    KopisModule,
    PerformanceModule,
    PerformanceApiModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
