import {
  Integration,
  IntegrationType,
} from '../../../core/models/project.model';
import { isFigmaUrl } from '../figma/figma.utils';
import { isSketchUrl } from '../sketch/sketch.utils';
import { isNotionUrl } from '../notion/notion.utils';
import { isConfluenceUrl } from '../confluence/confluence.utils';
import { isJiraUrl } from '../jira/jira.utils';
import { isTrelloUrl } from '../trello/trello.utils';
import { isGitUrl } from '../git/git.utils';
import { isLocalhostUrl } from '../localhost/localhost.utils';

const getIntegrationTypeFromUrl = (url: string): IntegrationType | null => {
  if (isLocalhostUrl(url)) {
    return 'localhost';
  }
  if (isFigmaUrl(url)) {
    return 'figma';
  }
  if (isSketchUrl(url)) {
    return 'sketch';
  }
  if (isNotionUrl(url)) {
    return 'notion';
  }
  if (isConfluenceUrl(url)) {
    return 'confluence';
  }
  if (isJiraUrl(url)) {
    return 'jira';
  }
  if (isTrelloUrl(url)) {
    return 'trello';
  }
  if (isGitUrl(url)) {
    return 'git';
  }
  return null;
};

export type IntegrationGroup = 'design' | 'docs' | 'project-management' | 'versioning' | 'dev' | 'custom';

export const getIntegrationGroup = (
  integrationType: IntegrationType
): IntegrationGroup => {
  switch (integrationType) {
    case 'figma':
    case 'sketch':
      return 'design';
    case 'notion':
    case 'confluence':
      return 'docs';
    case 'jira':
    case 'trello':
      return 'project-management';
    case 'git':
      return 'versioning';
    case 'localhost':
      return 'dev';
    case 'custom':
      return 'custom';
    default:
      return 'custom';
  }
};

// TODO: remove when i118n ?
export const getIntegrationLabel = (
  integrationType: IntegrationType
): string => {
  switch (integrationType) {
    case 'figma':
      return 'Figma';
    case 'sketch':
      return 'Sketch';
    case 'notion':
      return 'Notion';
    case 'confluence':
      return 'Confluence';
    case 'jira':
      return 'Jira';
    case 'trello':
      return 'Trello';
    case 'git':
      return 'Git';
    case 'localhost':
      return 'Localhost';
    default:
      return integrationType;
  }
};
