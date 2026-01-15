import { isFigmaUrl, getFigmaIntegration } from '../figma/figma.utils';
import { isSketchUrl, getSketchIntegration } from '../sketch/sketch.utils';
import { isNotionUrl, getNotionIntegration } from '../notion/notion.utils';
import { isConfluenceUrl, getConfluenceIntegration } from '../confluence/confluence.utils';
import { isJiraUrl, getJiraIntegration } from '../jira/jira.utils';
import { isTrelloUrl, getTrelloIntegration } from '../trello/trello.utils';
import { isGitUrl, getGitIntegration } from '../git/git.utils';
import { isLocalhostUrl, getLocalhostIntegration } from '../localhost/localhost.utils';
import {
  Integration,
  IntegrationGroup,
  IntegrationType,
} from '../../../core/models/integration.model';

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

export const getIntegration = (type: IntegrationType): Integration | null => {
  switch (type) {
    case 'localhost':
      return getLocalhostIntegration();
    case 'figma':
      return getFigmaIntegration();
    case 'sketch':
      return getSketchIntegration();
    case 'notion':
      return getNotionIntegration();
    case 'confluence':
      return getConfluenceIntegration();
    case 'jira':
      return getJiraIntegration();
    case 'trello':
      return getTrelloIntegration();
    case 'git':
      return getGitIntegration();
    case 'custom':
      return null;
    default:
      return null;
  }
};
