/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import OpenAI from 'openai';

@Injectable()
export class ContentGeneratorService {
  constructor(private readonly config: ConfigService) {}

  async generateArticleRequest(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this article and generate a different version: "${originalArticle}"`;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Generated Article:', response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
  async generateArticle(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this article and generate a different version: "${originalArticle}"`;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: prompt }],
    });

    return (await completion).choices[0].message.content;
  }
}
