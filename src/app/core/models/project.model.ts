import { Integration } from './integration.model';

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
