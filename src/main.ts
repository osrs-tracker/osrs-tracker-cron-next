import 'core-js/es/array/flat';
import 'core-js/proposals/reflect-metadata';

import cluster from 'cluster';
import { App } from './app/app';
import { Logger } from './app/common/logger';
import { config } from './config/config';
import { collectDefaultMetrics } from 'prom-client';
import { initClusterMetrics } from './app/common/cluster-metrics';

if (cluster.isMaster) {
  initClusterMetrics();

  cluster.on('exit', worker => {
    Logger.log(`WORKER ${worker.id} DIED - CREATING NEW WORKER`);
    cluster.fork();
  });

  for (let i = 0; i < config.workerCount; i++) {
    cluster.fork();
  }
} else {
  Logger.log(`WORKER ${cluster.worker.id} CREATED`);

  collectDefaultMetrics();

  (async () => { await App.run(cluster.worker); })();
}
