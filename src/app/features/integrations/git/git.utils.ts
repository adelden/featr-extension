export const GIT_ROOT_URLS = [
  'https://github.com',
  'https://gitlab.com',
  'https://bitbucket.org'
];

export const isGitUrl = (url: string): boolean => {
  return GIT_ROOT_URLS.some(rootUrl => {
    const gitRegex = new RegExp(`^${rootUrl}`);
    return gitRegex.test(url);
  });
};
