/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScraperController } from './controllers/scraper.controller';
import { ScraperService } from './services/scraper.service';
import { ContentGeneratorModule } from '../content-generator/content-generator.module';
import { ScraperDeeperService } from './services/scraper-deeper.service';
import { ArticlesService } from './services/articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/models/articles.models';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, ScraperDeeperService, ArticlesService],
  imports: [ContentGeneratorModule, MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
})
export class ScraperModule {}
