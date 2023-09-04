import { extractKey } from '../../src/lib/utils/common';

const Config = {
  Cors: true,
  DB: {
    user: 'root',
    password: '123456',
    ip: '127.0.0.1',
    port: 27017,
    url: '',
  },
  APP: {
    prefix: '/api',
    port: 8080,
    logDir: '/Users/wenqiang/Documents/work/personal/gitHub/CcServer/logs',
  },
  OSS: {
    RootPath: '/Users/wenqiang/Documents/work/personal/gitHub/CcServer/oss',
  },
  AesKey: '258c75b9-1c35-bde0-367f-79ea7672fd9c',
  JWT: {
    header_key: 't',
    secret: '4a06595b-c385-eeb7-0a58-ad81dec0278e',
    publicKey: extractKey('/config/cert/jwt.public.pem'),
    privateKey: extractKey('/config/cert/jwt.private.pem'),
    options: {
      expiresIn: '1d',
      algorithm: 'HS256',
    },
  },
  SWAGGER: {
    path: 'api_doc',
    title: 'CcServer Api',
    description: '',
    version: '1.0.0',
    tag: '',
  },
};
Config.DB.url = `mongodb://${Config.DB.user}:${Config.DB.password}@${Config.DB.ip}:${Config.DB.port}`;

export const BaseConfig = Config;
