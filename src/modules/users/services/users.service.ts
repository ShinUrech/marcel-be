/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserSignUpDto } from '../dtos/create-user-sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findOneById(id: string) {
    if (!id) {
      return null;
    }
    const user = this.repo.findOneBy({ id });
    return user;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async createUser(userData: Partial<CreateUserSignUpDto>) {
    const user = this.repo.create({ ...userData });
    return this.repo.save(user);
  }
}
