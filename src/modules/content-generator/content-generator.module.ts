/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ContentGeneratorService } from './services/content-generator.service';

@Module({
  providers: [ContentGeneratorService],
  exports: [ContentGeneratorService],
})
export class ContentGeneratorModule {}
