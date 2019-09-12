import express from 'express';
import { AggregatorRegistry } from 'prom-client';
import { config } from '../../config/config';
import { Logger } from './logger';

export function initClusterMetrics(): void {
  const metricsApp = express();
  const aggregatorRegistry = new AggregatorRegistry();

  metricsApp.use('/metrics', (_req, res) => aggregatorRegistry.clusterMetrics((err, metrics) => {
    if (err) Logger.logTask('CLUSTER_METRICS', err);
    res.set('Content-Type', aggregatorRegistry.contentType);
    res.send(metrics);
  }));

  metricsApp.listen(config.portMetrics);
}
