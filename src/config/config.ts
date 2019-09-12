import { IConfig } from './config.interface';
import { globalConfig } from './config.global';

export const config: IConfig = {
  ...globalConfig,

  axios: {
    timeout: 2000,
  },

  mongo: {
    url: process.env.MONGO_URL!,
    database: process.env.MONGO_DATABASE!,
    options: {
      auth: {
        user: process.env.MONGO_USER!,
        password: process.env.MONGO_PASSWORD!,
      },
      authSource: process.env.MONGO_AUTH_SOURCE,
      authMechanism: 'SCRAM-SHA-1',
      autoReconnect: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  toxMqUrl: `${process.env.TOX_MQ_URL}/queue/osrs-tracker-next`,
};
