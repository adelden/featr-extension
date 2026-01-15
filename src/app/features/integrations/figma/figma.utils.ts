import { Integration } from '../../../core/models/integration.model';

export const FIGMA_ROOT_URL = 'https://www.figma.com';

export const isFigmaUrl = (url: string): boolean => {
  const figmaRegex = new RegExp(`^${FIGMA_ROOT_URL}`);
  return figmaRegex.test(url);
};

export const getFigmaIntegration = (): Integration => {
  return {
    type: 'figma',
    label: 'Figma',
    group: 'design',
    baseUrl: FIGMA_ROOT_URL,
    enabled: true,
  };
};
