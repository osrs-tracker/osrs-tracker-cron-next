import { config } from '../../../config/config';
import { Db, MongoClient, Collection } from 'mongodb';

/**
 * Short for MongoUtils.
 *
 * Collection of helper functions for MongoDB.
 */
export class MU {

  static COLLECTIONS = {
    ITEM_COLLECTION: 'item',
  };

  static db(mongo: MongoClient): Db {
    return mongo.db(config.mongo.database);
  }

  static col(mongo: MongoClient, collection: string): Collection {
    return this.db(mongo).collection(collection);
  }
}
