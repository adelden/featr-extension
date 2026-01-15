import { Integration } from '../../../core/models/integration.model';

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

export const getGitIntegration = (): Integration => {
  return {
    type: 'git',
    label: 'Git',
    group: 'versioning',
    baseUrl: GIT_ROOT_URLS[0], // GitHub par défaut
    enabled: true,
  };
};
