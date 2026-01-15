import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { getIntegrationLabel } from '../integration.utils';
import {
  IntegrationType,
  INTEGRATIONS,
} from '../../../../core/models/integration.model';

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
