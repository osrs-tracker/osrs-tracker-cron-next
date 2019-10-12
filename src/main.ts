import 'core-js/es/array/flat';
import 'core-js/proposals/reflect-metadata';

import { App } from './app/app';
import { initMetrics } from './app/common/cluster-metrics';

initMetrics();

App.run();
