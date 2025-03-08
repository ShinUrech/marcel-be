/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ArticleType } from 'src/models/articles.models';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  baseUrl: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  dateText?: string;

  @IsOptional()
  @IsString()
  teaser?: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsString()
  originalContent?: string;

  @IsOptional()
  @IsString()
  generatedContent?: string;
}
