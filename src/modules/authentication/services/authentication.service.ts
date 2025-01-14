/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { hashPassword } from 'src/common/helpers/hash-password.func';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserTokenizeDataDto } from '../dtos/user-tokenize-data.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthenticationService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  async signup(userData) {
    const users = await this.usersService.findByEmail(userData.email);
    if (users) {
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL);
    }
    // Hash the users password
    const result = await hashPassword(userData.password);
    delete userData.password;
    // Create a new user and save it
    const user = await this.usersService.createUser({
      ...userData,
      password: result,
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException(MSG_EXCEPTION.OTHER_BAD_PASSWORD);
    }

    // Serialize User For Token
    const userPlain = instanceToPlain(user);
    const userToken = plainToInstance(UserTokenizeDataDto, userPlain, { excludeExtraneousValues: true });

    const { accessToken, refreshToken } = await this.generateUserTokens(userToken);
    await this.storeRefreshToken(refreshToken, user);
    return { ...user, accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    return this.tokenService.remove(refreshToken);
  }

  async refreshTokens(refreshToken: string) {
    if (refreshToken == null) {
      throw new UnauthorizedException();
    }
    const token = await this.tokenService.findOne(refreshToken);

    if (!token) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_TOKEN);
    }
    const { user } = await this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('auth.refreshToken'),
    });

    const { accessToken } = await this.generateUserTokens(user);
    return { accessToken };
  }

  private async generateUserTokens(user) {
    delete user.password;
    const accessToken = this.jwtService.sign({ user }, { expiresIn: '3d' });
    const refreshToken = this.jwtService.sign({ user }, { secret: this.config.get<string>('auth.refreshToken') });
    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(refreshToken, user) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);
      await this.tokenService.create(refreshToken, user, expiryDate);
    } catch (error) {
      console.log(error);
    }
  }
}
