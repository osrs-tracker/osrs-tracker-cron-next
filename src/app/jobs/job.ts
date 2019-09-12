
import Agenda from 'agenda';
import { MongoClient } from 'mongodb';
import { generate as generateId } from 'shortid';
import { Logger } from '../common/logger';
import { processItems, PROCESS_ITEMS, PROCESS_ITEMS_INTERVAL } from './process-items.job';
import { queueItems, QUEUE_ITEMS, QUEUE_ITEMS_INTERVAL } from './queue-items.job';

export class Job {

  static async execute(name: string, done: (err?: Error | undefined) => void, action: (jobId: string) => Promise<void>): Promise<void> {
    const jobId = generateId();

    try {
      Logger.logJob(name, jobId, 'STARTING');
      await action(jobId);
    } catch (err) {
      Logger.logJob(name, jobId, 'ERROR', err);
      return done(err);
    }

    done();
  }

  public static async startJobs(mongo: MongoClient, agenda: Agenda): Promise<void> {
    this.defineJobs(mongo, agenda);

    await agenda.start();
    await this.scheduleJobs(agenda);

    agenda.purge();
  }

  private static defineJobs(mongo: MongoClient, agenda: Agenda): void {
    agenda.define(QUEUE_ITEMS, { lockLimit: 5, concurrency: 1, lockLifetime: 30000 }, queueItems);
    agenda.define(PROCESS_ITEMS, { lockLimit: 5, concurrency: 1, lockLifetime: 30000 }, (_, done) => processItems(mongo, done));
  }

  private static async scheduleJobs(agenda: Agenda): Promise<void> {
    agenda.every(QUEUE_ITEMS_INTERVAL, QUEUE_ITEMS);
    agenda.every(PROCESS_ITEMS_INTERVAL, PROCESS_ITEMS);
  }

}
