export interface IConfigGlobal {
  osrsItemApiBase: string;
  portMetrics: number;
}

export const globalConfig: IConfigGlobal = {
  osrsItemApiBase: 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue',
  portMetrics: Number(process.env.PORT_METRICS) || 8088,
};
