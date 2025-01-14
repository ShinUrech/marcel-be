/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class UserTokenizeDataDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
