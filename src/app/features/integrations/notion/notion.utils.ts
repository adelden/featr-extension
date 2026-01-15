export const NOTION_ROOT_URL = 'https://www.notion.so';

export const isNotionUrl = (url: string): boolean => {
  const notionRegex = new RegExp(`^${NOTION_ROOT_URL}`);
  return notionRegex.test(url);
};
