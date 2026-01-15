import { Component, input, output, effect } from '@angular/core';
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

  // Two-way binding input/output
  selectedIntegration = input<IntegrationType | undefined>();
  selectedIntegrationChange = output<IntegrationType | undefined>();

  // Internal model for the select
  internalValue: IntegrationType | undefined;

  constructor() {
    // Sync input to internal value
    effect(() => {
      this.internalValue = this.selectedIntegration();
    });
  }

  onValueChange(value: IntegrationType | undefined) {
    this.internalValue = value;
    this.selectedIntegrationChange.emit(value);
  }
}
