import Agenda from 'agenda';
import { MongoClient } from 'mongodb';
import { config } from '../config/config';
import { Logger } from './common/logger';
import { Job } from './jobs/job';

export class App {

  private agenda: Agenda;
  private mongo: MongoClient;

  static async run(): Promise<App> {
    const app = new App();
    try {
      await app.start();
    } catch (e) {
      app.kill();
      Logger.logTask('APP_START', 'FAILED TO START APP', e);
    }
    return app;
  }

  private constructor() {
    this.mongo = new MongoClient(config.mongo.url, config.mongo.options);
    this.agenda = new Agenda();
  }

  kill(): void {
    this.agenda.stop();
    this.mongo.close(true);
  }

  private async start(): Promise<void> {
    this.mongo = await this.mongo.connect();

    this.agenda.mongo(this.mongo.db(config.mongo.database));

    await Job.startAgendaJobs(this.agenda);
    Job.startCommonJobs(this.mongo);
  }

}
