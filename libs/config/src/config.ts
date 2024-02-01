import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

interface Config {
  bot: {
    port: number;
    name: string;
  };
  gateway: {
    port: number;
    name: string;
  };
  common: object;
}

const config = yaml.load(readFileSync(join(__dirname, '../../../env.yaml'), 'utf8')) as Config;

export function getBotConfig() {
  return { ...config.bot, ...config.common };
}

export function getGatewayConfig() {
  return { ...config.gateway, ...config.common };
}
