import { MongoClientOptions } from 'mongodb';
import { IConfigGlobal } from './config.global';

export interface IConfig extends IConfigGlobal {
  axios: {
    timeout: number,
  };
  mongo: {
    url: string,
    database: string,
    options: MongoClientOptions,
  };
  toxMqUrl: string;
}
