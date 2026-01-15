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

const getIntegrationTypeFromUrl = (url: string): IntegrationType | null => {
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
