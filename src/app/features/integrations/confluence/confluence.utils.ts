export const CONFLUENCE_ROOT_URL = 'https://confluence.atlassian.com';

export const isConfluenceUrl = (url: string): boolean => {
  const confluenceRegex = new RegExp(`^${CONFLUENCE_ROOT_URL}`);
  return confluenceRegex.test(url);
};
