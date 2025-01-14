/* eslint-disable prettier/prettier */
import { cleanEnv, host, port, str } from 'envalid';

export default () => {
  const environment = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
    PORT: port(),
    DB_TYPE: str({ choices: ['mysql', 'sqlite'] }),
    DB_HOST: host(),
    DB_PORT: port(),
    DB_NAME: str(),
    APP_NAME: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
  });

  return {
    port: environment.PORT,
    nodeEnv: environment.NODE_ENV,
    appName: environment.APP_NAME,
    databaseType: environment.DB_TYPE,
    database: {
      dbName: environment.DB_NAME,
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      username: environment.DB_USER,
      password: environment.DB_PASSWORD,
    },
    auth: {
      accessToken: environment.ACCESS_TOKEN_SECRET,
      refreshToken: environment.REFRESH_TOKEN_SECRET,
    },
  };
};
