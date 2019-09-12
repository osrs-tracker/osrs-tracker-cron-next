import { config } from '../../../config/config';
import { Db, MongoClient, Collection } from 'mongodb';

/**
 * Short for MongoUtils.
 *
 * Collection of helper functions for MongoDB.
 */
export class MU {
  static DB(mongo: MongoClient): Db {
    return mongo.db(config.mongo.database);
  }

  static COL(mongo: MongoClient, collection: string): Collection {
    return this.DB(mongo).collection(collection);
  }
}
