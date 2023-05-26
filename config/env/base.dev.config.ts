import { extractKey } from "../../src/lib/utils/common";

const Config = {
  DB: {
    USER: 'root',
    PASSWORD: '123456',
    IP: '127.0.0.1',
    PORT: 27017,
    URI: ''
  },
  APP: {
    prefix: '/api',
    port: 8080,
  },
  JWT: {
    HEADER_KEY: 't',
    SECRET: '4a06595b-c385-eeb7-0a58-ad81dec0278e',
    publicKey: extractKey('/config/cert/jwt.public.pem'),
    privateKey: extractKey('/config/cert/jwt.private.pem'),
    OPTIONS: {
      expiresIn: '1d',
      algorithm: 'HS256',
    },
  }
};
Config.DB.URI = `mongodb://${Config.DB.USER}:${Config.DB.PASSWORD}@${Config.DB.IP}:${Config.DB.PORT}`;

export const BaseConfig = Config;

