/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(RefreshToken) private repo: Repository<RefreshToken>) {}
  create(refreshToken: string, user: User, expiryDate: Date) {
    const token = this.repo.create({ token: refreshToken, user, expiryDate });
    return this.repo.save(token);
  }

  findOne(refreshToken: string) {
    if (!refreshToken) {
      return null;
    }
    const token = this.repo.findOneBy({ token: refreshToken });
    return token;
  }

  async remove(refreshToken: string) {
    const token = await this.findOne(refreshToken);
    if (!token) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return this.repo.remove(token);
  }
}
