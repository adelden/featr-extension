export const FIGMA_ROOT_URL = 'https://www.figma.com';

export const isFigmaUrl = (url: string): boolean => {
  const figmaRegex = new RegExp(`^${FIGMA_ROOT_URL}`);
  return figmaRegex.test(url);
};
