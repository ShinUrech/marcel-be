import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { TokenService } from './services/token.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

@Module({
  providers: [AuthenticationService, TokenService],
  controllers: [AuthenticationController],
  imports: [UsersModule, TypeOrmModule.forFeature([RefreshToken])],
})
export class AuthenticationModule {}
