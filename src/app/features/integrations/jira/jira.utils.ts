export const JIRA_ROOT_URL = 'https://jira.atlassian.com';

export const isJiraUrl = (url: string): boolean => {
  const jiraRegex = new RegExp(`^${JIRA_ROOT_URL}`);
  return jiraRegex.test(url);
};
