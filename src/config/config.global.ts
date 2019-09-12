import os from 'os';

export interface IConfigGlobal {
  osrsItemApiBase: string;
  portMetrics: number;
  workerCount: number;
}

export const globalConfig: IConfigGlobal = {
  osrsItemApiBase: 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue',
  portMetrics: Number(process.env.PORT_METRICS) || 8088,
  workerCount: Number(process.env.WORKER_COUNT) || os.cpus().length,
};
