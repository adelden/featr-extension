import { Component, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

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
  readonly form = new FormGroup({
    integrationType: new FormControl<IntegrationType | undefined>(undefined, Validators.required),
    baseUrl: new FormControl<string>('', Validators.required),
    enabled: new FormControl<boolean>(true),
  });

  // Signal from form control for reactive template usage
  private readonly integrationType = toSignal(
    this.form.controls.integrationType.valueChanges.pipe(
      startWith(this.form.controls.integrationType.value)
    )
  );

  // Computed signal pour obtenir l'intégration basée sur le type sélectionné
  selectedIntegration = computed<Integration | null>(() => {
    const type = this.integrationType();
    if (!type) return null;
    return getIntegration(type);
  });

  // Computed signal pour le label
  integrationLabel = computed<string>(() => {
    const type = this.integrationType();
    return type ? getIntegrationLabel(type) : '';
  });

  onIntegrationTypeChange(type: IntegrationType | undefined) {
    this.form.controls.integrationType.setValue(type);

    // Pré-remplir le baseUrl avec l'URL par défaut de l'intégration
    if (type) {
      const integration = getIntegration(type);
      if (integration) {
        this.form.controls.baseUrl.setValue(integration.baseUrl);
      }
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const formValue = this.form.value;
    const integration: Integration = {
      type: formValue.integrationType!,
      label: this.integrationLabel(),
      group: this.selectedIntegration()?.group || 'custom',
      baseUrl: formValue.baseUrl!,
      enabled: formValue.enabled!,
    };

    console.log('Integration submitted:', integration);
    // TODO: Émettre l'événement ou appeler un service
  }

  onReset() {
    this.form.reset({
      integrationType: undefined,
      baseUrl: '',
      enabled: true,
    });
  }
}
