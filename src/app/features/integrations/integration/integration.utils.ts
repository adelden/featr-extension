import {
  Integration,
  IntegrationType,
} from '../../../core/models/project.model';
import { isTrelloUrl } from '../trello/trello.utils';

const getIntegrationTypeFromUrl = (url: string): IntegrationType | null => {
  if (isTrelloUrl(url)) {
    return 'trello';
  }
  return null;
};
