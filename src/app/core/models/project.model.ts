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
  // CUSTOM
  'custom',
] as const;

export type IntegrationType = (typeof INTEGRATIONS)[number]; // | undefined;

export interface Integration {
  type: IntegrationType;
  baseUrl: string;
  enabled: boolean;
}

export interface Projet {
  id: string; // TODO: implement uuid lib ?
  name: string;
  integrations?: Integration[];
  localhost: {
    port: number;
    autoOpen: boolean;
  };
  isActive: boolean;
  createdAt: number;
}
