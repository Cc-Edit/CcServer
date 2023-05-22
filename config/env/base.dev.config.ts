const Config = {
  DB: {
    USER: 'root',
    PASSWORD: '123456',
    IP: '127.0.0.1',
    PORT: 27017,
    URI: ''
  },
  PORT: 8080,
  JWT: {
    SECRET: 'AAAABBBBCCCCDDDD'
  }
};
Config.DB.URI = `mongodb://${Config.DB.USER}:${Config.DB.PASSWORD}@${Config.DB.IP}:${Config.DB.PORT}`;

export const BaseConfig = Config;

