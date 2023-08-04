const ENV = process.env.NODE_ENV || 'dev';
let Config = null;

switch (ENV) {
  case 'dev':
    // tslint:disable-next-line:no-var-requires
    Config = require('./env/base.dev.config').BaseConfig;
    break;
  case 'production':
    // tslint:disable-next-line:no-var-requires
    Config = require('./env/base.prod.config').BaseConfig;
    break;
  default:
    throw new Error('Env config could not be found for environment');
}
console.log(process.env.NODE_ENV);
console.log(Config);
// Custom application configuration
export const AppConfig = Config;
