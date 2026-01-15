export const INTEGRATIONS = [
  // DESIGN
  'figma',
  'sketch',
  // DOCS
  'notion',
  'confluence',
  // TASK MANAGERS
  'jira',
  'trello',
  // VERSIONING
  'git',
  // DEV
  'localhost',
  // CUSTOM
  'custom',
] as const;

export type IntegrationGroup =
  | 'design'
  | 'docs'
  | 'project-management'
  | 'versioning'
  | 'dev'
  | 'custom';

export type IntegrationType = (typeof INTEGRATIONS)[number]; // | undefined;

export interface Integration {
  type: IntegrationType;
  label: string;
  group: IntegrationGroup;
  baseUrl: string;
  enabled?: boolean;
}
