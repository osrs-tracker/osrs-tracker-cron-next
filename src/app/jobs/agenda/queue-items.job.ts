import Agenda from 'agenda';
import Axios from 'axios';
import { MD5 } from 'object-hash';
import { config } from '../../../config/config';
import { ItemPage } from '../../models/item';
import { Logger } from '../../common/logger';
import { Job } from '../job';

export const QUEUE_ITEMS = 'QUEUE_ITEMS';
export const QUEUE_ITEMS_INTERVAL = '2 hours';

export async function queueItems(_: Agenda.Job, done: (err?: Error | undefined) => void): Promise<void> {
  Job.executeAgenda(QUEUE_ITEMS, done, async (jobId) => {
    const response = await Axios.get<{ alpha: { letter: string, items: number }[]; }>(
      `${config.osrsItemApiBase}/category.json?category=1`,
      config.axios,
    );

    const pages = parseResponse(response.data);

    await queueInsert(pages);

    Logger.logJob(QUEUE_ITEMS, jobId, `FINISHED QUEUING ${pages.length} PAGES`);
  });
}

function parseResponse(data: { alpha: { letter: string, items: number }[]; }): ItemPage[] {
  const categories = data.alpha
    .map(({ letter, items: itemCount }) => ({
      letter,
      pages: itemCount ? 1 + (itemCount - (itemCount % 12)) / 12 : 0,
    }));

  return categories.map(({ letter, pages }) => {
    const pageNumbers = [...new Array(pages)].map((_, i) => ++i);

    return pageNumbers.map(page => ({ letter, page }));
  }).flat();
}

async function queueInsert(payload: { letter: string, page: number }[]): Promise<void> {
  await Axios.post(`${config.toxMqUrl}-dbu/push?hashCode=${MD5(payload)}&expiresIn=3600`, payload);
}
