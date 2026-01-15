import { Integration } from '../../../core/models/integration.model';

export const isLocalhostUrl = (url: string): boolean => {
  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;
  return localhostRegex.test(url);
};

export const getLocalhostIntegration = (): Integration => {
  return {
    type: 'localhost',
    label: 'Localhost',
    group: 'dev',
    baseUrl: 'http://localhost',
    enabled: true,
  };
};
