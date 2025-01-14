/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateUserSignUpDto } from 'src/modules/users/dtos/create-user-sign-up.dto';
import { UserTokenizeDataDto } from '../dtos/user-tokenize-data.dto';
import { UserLoginDto } from '../dtos/user-login.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { RefreshTokenDto } from '../dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService,
  ) {}

  @Serialize(UserTokenizeDataDto)
  @Post('/signup')
  async createSimpleUser(@Body() signupData: CreateUserSignUpDto) {
    return this.authService.signup(signupData);
  }

  @Serialize(UserTokenizeDataDto)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() credentials: UserLoginDto) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Serialize(UserTokenizeDataDto)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @Get('/me')
  async authMe(@GetUser() user: Partial<User>) {
    return this.usersService.findByEmail(user.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticationGuard)
  @Post('/logout')
  async logout(@Body() tokens: RefreshTokenDto) {
    return this.authService.logout(tokens.refreshToken);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/refresh')
  async refreshTokens(@Body() tokens: RefreshTokenDto) {
    return this.authService.refreshTokens(tokens.refreshToken);
  }
}
