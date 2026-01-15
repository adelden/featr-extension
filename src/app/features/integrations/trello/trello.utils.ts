import { Integration } from '../../../core/models/integration.model';

export const TRELLO_ROOT_URL = 'https://trello.com';

export const isTrelloUrl = (url: string): boolean => {
  const trelloRegex = new RegExp(`^${TRELLO_ROOT_URL}`);
  return trelloRegex.test(url);
};

export const getTrelloIntegration = (): Integration => {
  return {
    type: 'trello',
    label: 'Trello',
    group: 'project-management',
    baseUrl: TRELLO_ROOT_URL,
    enabled: true,
  };
};
