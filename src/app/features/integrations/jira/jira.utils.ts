import { Integration } from '../../../core/models/integration.model';

export const JIRA_ROOT_URL = 'https://jira.atlassian.com';

export const isJiraUrl = (url: string): boolean => {
  const jiraRegex = new RegExp(`^${JIRA_ROOT_URL}`);
  return jiraRegex.test(url);
};

export const getJiraIntegration = (): Integration => {
  return {
    type: 'jira',
    label: 'Jira',
    group: 'project-management',
    baseUrl: JIRA_ROOT_URL,
    enabled: true,
  };
};
