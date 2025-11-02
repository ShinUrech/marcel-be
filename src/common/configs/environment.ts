import { cleanEnv, port, str } from 'envalid';

export default () => {
  const isTest = process.env.NODE_ENV === 'test';

  const environment = cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production', 'staging'],
      default: 'development',
    }),
    PORT: port({ default: 3000 }),
    MONGO_URI: str({
      default: isTest ? 'mongodb://localhost:27017/test' : undefined,
    }),
    APP_NAME: str({ default: 'Marcel_Backend' }),
    CHATGPT_API_KEY: str({
      default: isTest ? 'test-key-not-used' : undefined,
    }),
    LINKEDIN_EMAIL: str({
      default: isTest ? 'a7195031@gmail.com' : undefined,
    }),
    LINKEDIN_PASSWORD: str({
      default: isTest ? 'Mutsumi8139' : undefined,
    }),
    LINKEDIN_HEADLESS: str({
      choices: ['true', 'false'],
      default: 'true',
    }),
  });

  return {
    port: environment.PORT,
    nodeEnv: environment.NODE_ENV,
    appName: environment.APP_NAME,
    databaseUri: environment.MONGO_URI,
    chatGPT: environment.CHATGPT_API_KEY,
    linkedInEmail: environment.LINKEDIN_EMAIL,
    linkedInPassword: environment.LINKEDIN_PASSWORD,
    linkedInHeadless: environment.LINKEDIN_HEADLESS === 'true',
  };
};
