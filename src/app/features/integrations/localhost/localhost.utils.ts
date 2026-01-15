export const isLocalhostUrl = (url: string): boolean => {
  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;
  return localhostRegex.test(url);
};
