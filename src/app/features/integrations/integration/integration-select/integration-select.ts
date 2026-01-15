import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import {
  INTEGRATIONS,
  IntegrationType,
} from '../../../../core/models/project.model';
import { getIntegrationLabel } from '../integration.utils';

@Component({
  selector: 'app-integration-select',
  imports: [SelectModule, FormsModule],
  templateUrl: './integration-select.html',
  styleUrl: './integration-select.scss',
})
export class IntegrationSelect {
  readonly integrationsItems: { value: IntegrationType; label: string }[] =
    INTEGRATIONS.map((integration) => ({
      label: getIntegrationLabel(integration),
      value: integration,
    }));

  selectedIntegration: IntegrationType | undefined;
}
