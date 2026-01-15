import { Component } from '@angular/core';
import { INTEGRATIONS } from '../../../../core/models/project.model';

@Component({
  selector: 'app-integration-select',
  imports: [],
  templateUrl: './integration-select.html',
  styleUrl: './integration-select.scss',
})
export class IntegrationSelect {
  readonly integrations = INTEGRATIONS;
}
