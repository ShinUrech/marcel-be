/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from 'src/models/articles.models';
import { CreateArticleDto } from '../dtos/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async createArticle(article: CreateArticleDto) {
    const existingArticle = await this.articleModel.findOne({ url: article.url });

    if (existingArticle) {
      return null;
    }

    const newArticle = new this.articleModel(article);
    return newArticle.save();
  }

  FindAll() {
    return this.articleModel.find();
  }

  FindOne(id: string) {
    return this.articleModel.findOne({ _id: id });
  }

  Update(id: string, article) {
    return this.articleModel.findByIdAndUpdate({ _id: id }, { $set: article }, { new: true });
  }

  Delete(id: string) {
    return this.articleModel.deleteOne({ _id: id });
  }
}
