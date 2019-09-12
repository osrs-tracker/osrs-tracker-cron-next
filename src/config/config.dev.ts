import { globalConfig } from './config.global';
import { IConfig } from './config.interface';

const hidden = require('./config.dev.hidden');

export const config: IConfig = {
  ...globalConfig,

  axios: {
    timeout: 2000,
  },

  mongo: {
    url: hidden.mongo.url,
    database: hidden.mongo.database,
    options: {
      auth: {
        user: hidden.mongo.user,
        password: hidden.mongo.password,
      },
      authSource: hidden.mongo.authSource,
      authMechanism: 'SCRAM-SHA-1',
      autoReconnect: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  toxMqUrl: 'http://localhost:8081/queue/osrs-tracker-next',
};
