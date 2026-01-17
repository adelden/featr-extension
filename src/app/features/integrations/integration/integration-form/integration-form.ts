import { Component, signal, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IntegrationSelect } from '../integration-select/integration-select';
import {
  Integration,
  IntegrationType,
} from '../../../../core/models/integration.model';
import { getIntegration, getIntegrationLabel } from '../integration.utils';

@Component({
  selector: 'app-integration-form',
  imports: [
    IntegrationSelect,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToggleSwitchModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './integration-form.html',
  styleUrl: './integration-form.scss',
})
export class IntegrationForm {
  selectedIntegrationType = signal<IntegrationType | undefined>(undefined);
  baseUrl = signal<string>('');
  enabled = signal<boolean>(true);

  // Computed signal pour obtenir l'intégration basée sur le type sélectionné
  selectedIntegration = computed<Integration | null>(() => {
    const type = this.selectedIntegrationType();
    if (!type) return null;
    return getIntegration(type);
  });

  // Computed signal pour le label
  integrationLabel = computed<string>(() => {
    const type = this.selectedIntegrationType();
    return type ? getIntegrationLabel(type) : '';
  });

  // Computed signal pour vérifier si le formulaire est valide
  isFormValid = computed<boolean>(() => {
    return !!this.selectedIntegrationType() && this.baseUrl().trim().length > 0;
  });

  onIntegrationTypeChange(type: IntegrationType | undefined) {
    this.selectedIntegrationType.set(type);

    // Pré-remplir le baseUrl avec l'URL par défaut de l'intégration
    if (type) {
      const integration = getIntegration(type);
      if (integration) {
        this.baseUrl.set(integration.baseUrl);
      }
    }
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    const integration: Integration = {
      type: this.selectedIntegrationType()!,
      label: this.integrationLabel(),
      group: this.selectedIntegration()?.group || 'custom',
      baseUrl: this.baseUrl(),
      enabled: this.enabled(),
    };

    console.log('Integration submitted:', integration);
    // TODO: Émettre l'événement ou appeler un service
  }

  onReset() {
    this.selectedIntegrationType.set(undefined);
    this.baseUrl.set('');
    this.enabled.set(true);
  }
}
