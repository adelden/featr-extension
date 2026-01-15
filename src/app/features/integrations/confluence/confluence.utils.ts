import { Integration } from '../../../core/models/integration.model';

export const CONFLUENCE_ROOT_URL = 'https://confluence.atlassian.com';

export const isConfluenceUrl = (url: string): boolean => {
  const confluenceRegex = new RegExp(`^${CONFLUENCE_ROOT_URL}`);
  return confluenceRegex.test(url);
};

export const getConfluenceIntegration = (): Integration => {
  return {
    type: 'confluence',
    label: 'Confluence',
    group: 'docs',
    baseUrl: CONFLUENCE_ROOT_URL,
    enabled: true,
  };
};
