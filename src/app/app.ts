import Agenda from 'agenda';
import { Worker } from 'cluster';
import { MongoClient } from 'mongodb';
import { config } from '../config/config';
import { Logger } from './common/logger';
import { Job } from './jobs/job';

export class App {

  private agenda: Agenda;
  private mongo: MongoClient;

  static async run(worker: Worker): Promise<App> {
    const app = new App();
    try {
      await app.start(worker);
    } catch (e) {
      app.kill();
      Logger.logTask('APP_START', `FAILED TO START APP ON WORKER ${worker.id}`, e);
    }
    return app;
  }

  public kill(): void {
    this.agenda.stop();
    this.mongo.close(true);
  }

  private constructor() {
    this.mongo = new MongoClient(config.mongo.url, config.mongo.options);
    this.agenda = new Agenda();
  }

  private async start(worker: Worker): Promise<void> {
    this.mongo = await this.mongo.connect();

    this.agenda.mongo(this.mongo.db(config.mongo.database));

    await Job.startJobs(this.mongo, this.agenda);
  }

}
