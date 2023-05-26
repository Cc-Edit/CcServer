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
    SECRET: 'AAAABBBBCCCCDDDD',
    publicKey: extractKey('/config/cert/jwt.public.pem'),
    privateKey: extractKey('/config/cert/jwt.private.pem'),
    OPTIONS: {
      expiresIn: '3d',
      algorithm: 'RS256',
    },
  }
};
Config.DB.URI = `mongodb://${Config.DB.USER}:${Config.DB.PASSWORD}@${Config.DB.IP}:${Config.DB.PORT}`;

export const BaseConfig = Config;

