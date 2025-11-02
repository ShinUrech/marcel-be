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
  });

  return {
    port: environment.PORT,
    nodeEnv: environment.NODE_ENV,
    appName: environment.APP_NAME,
    databaseUri: environment.MONGO_URI,
    chatGPT: environment.CHATGPT_API_KEY,
  };
};
