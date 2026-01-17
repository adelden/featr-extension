import { Integration } from './integration.model';

export interface Projet {
  id: string; // TODO: implement uuid lib ?
  name: string;
  integrations?: Integration[];
  isActive: boolean;
  createdAt: number;
}
