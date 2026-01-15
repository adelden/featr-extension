import { Integration } from '../../../core/models/integration.model';

export const NOTION_ROOT_URL = 'https://www.notion.so';

export const isNotionUrl = (url: string): boolean => {
  const notionRegex = new RegExp(`^${NOTION_ROOT_URL}`);
  return notionRegex.test(url);
};

export const getNotionIntegration = (): Integration => {
  return {
    type: 'notion',
    label: 'Notion',
    group: 'docs',
    baseUrl: NOTION_ROOT_URL,
    enabled: true,
  };
};
