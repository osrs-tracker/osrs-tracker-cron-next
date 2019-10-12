import express from 'express';
import { collectDefaultMetrics, register } from 'prom-client';
import { config } from '../../config/config';

export function initMetrics(): void {
  collectDefaultMetrics();

  express().use('/metrics', (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(register.metrics());
  }).listen(config.portMetrics);
}
