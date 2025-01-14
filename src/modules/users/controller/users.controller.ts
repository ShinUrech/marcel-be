/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';

@Controller('users')
export class UsersController {
  @UseGuards(AuthenticationGuard)
  @Get('protected')
  async protected() {
    const mock = {
      msg: 'Hello Secret World!',
      code: '99X99',
    };
    return mock;
  }

  @Get('public')
  async public() {
    const mock = {
      msg: 'Hello World!',
      code: '00X00',
    };
    return mock;
  }
}
