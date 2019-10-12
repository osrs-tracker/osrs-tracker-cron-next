import Axios from 'axios';
import { plainToClass } from 'class-transformer';
import { MongoClient } from 'mongodb';
import { config } from '../../../config/config';
import { Logger } from '../../common/logger';
import { ItemPage, ItemResponse } from '../../models/item';
import { ToxMqResponse } from '../../models/tox-mq-response';
import { Job } from '../job';
import { MU } from '../../common/utils/mongo.utils';

export const PROCESS_ITEMS = 'PROCESS_ITEMS';
export const PROCESS_ITEMS_CRON = '*/7 * * * * *';

export async function processItems(mongo: MongoClient): Promise<void> {
  Job.execute(PROCESS_ITEMS, async (jobId) => {
    const toxMqResponse = await popFromItemQueue();

    if (toxMqResponse === null) {
      Logger.logJob(PROCESS_ITEMS, jobId, 'QUEUE IS EMPTY');
      return;
    }

    const itemPage = toxMqResponse.payload;

    Logger.logJob(PROCESS_ITEMS, jobId, `PROCESSING ${JSON.stringify(itemPage)}`);

    const items = await fetchItems(itemPage);

    const bulkWrite = await MU.col(mongo, MU.COLLECTIONS.ITEM_COLLECTION).bulkWrite(
      items.map(item => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: item },
          upsert: true,
        },
      })),
    );

    const updatedCount = (bulkWrite.matchedCount || 0) + (bulkWrite.upsertedCount || 0);

    if (updatedCount > 0) {
      ackToxMqMessage(toxMqResponse);
      Logger.logJob(PROCESS_ITEMS, jobId, `FINISHED PROCESSING ${updatedCount} ITEMS`);
    } else {
      throw new Error('no items were updated');
    }
  });
}

async function popFromItemQueue(): Promise<ToxMqResponse<ItemPage> | null> {
  const toxMqResponse = await Axios.post<ToxMqResponse<ItemPage>>(
    `${config.toxMqUrl}-dbu/pop`, undefined, config.axios,
  );

  if (toxMqResponse.status === 204) return null;

  return toxMqResponse.data;
}

async function fetchItems({ letter, page }: ItemPage): Promise<ItemResponse[]> {
  const osrsResponse = await Axios.get<{ items: ItemResponse[] }>(
    `${config.osrsItemApiBase}/items.json?category=1&alpha=${encodeURIComponent(letter)}&page=${page}`,
    config.axios,
  );

  if (osrsResponse.headers['content-length'] === '0') {
    throw Error('Content-Size was 0');
  }

  return plainToClass(ItemResponse, osrsResponse.data.items);
}

async function ackToxMqMessage(toxMqResponse: ToxMqResponse<ItemPage>): Promise<void> {
  await Axios.post<ToxMqResponse<ItemPage>>(
    `${config.toxMqUrl}-dbu/ack`, [toxMqResponse._id], config.axios,
  );
}
