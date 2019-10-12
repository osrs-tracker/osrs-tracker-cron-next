
import Agenda from 'agenda';
import { generate as generateId } from 'shortid';
import { Logger } from '../common/logger';
import { queueItems, QUEUE_ITEMS, QUEUE_ITEMS_INTERVAL } from './agenda/queue-items.job';
import { MongoClient } from 'mongodb';
import { CronJob } from 'cron';
import { PROCESS_ITEMS_CRON, processItems } from './common/process-items.job';

export class Job {

  static async execute(name: string, action: (jobId: string) => Promise<void>): Promise<void> {
    const jobId = generateId();

    try {
      Logger.logJob(name, jobId, 'STARTING');
      await action(jobId);
    } catch (err) {
      Logger.logJob(name, jobId, 'ERROR', err);
    }
  }

  static startCommonJobs(mongo: MongoClient): void {
    [
      new CronJob(PROCESS_ITEMS_CRON, async () => processItems(mongo)),
    ].forEach(job => job.start());
  }

  static async executeAgenda(name: string, done: (err?: Error | undefined) => void, action: (jobId: string) => Promise<void>): Promise<void> {
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

  static async startAgendaJobs(agenda: Agenda): Promise<void> {
    this.defineAgendaJobs(agenda);

    await agenda.start();
    await this.scheduleAgendaJobs(agenda);

    agenda.purge();
  }

  private static defineAgendaJobs(agenda: Agenda): void {
    agenda.define(QUEUE_ITEMS, { lockLimit: 2, concurrency: 1, lockLifetime: 30000 }, queueItems);
  }

  private static async scheduleAgendaJobs(agenda: Agenda): Promise<void> {
    agenda.every(QUEUE_ITEMS_INTERVAL, QUEUE_ITEMS);
  }

}
