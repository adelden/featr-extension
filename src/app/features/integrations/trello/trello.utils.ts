export const TRELLO_ROOT_URL = 'https://trello.com';

export const isTrelloUrl = (url: string): boolean => {
  const trelloRegex = new RegExp(`^${TRELLO_ROOT_URL}`);
  return trelloRegex.test(url);
};
