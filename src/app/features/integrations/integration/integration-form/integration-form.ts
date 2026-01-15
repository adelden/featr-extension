import { Component } from '@angular/core';
import { IntegrationSelect } from '../integration-select/integration-select';

@Component({
  selector: 'app-integration-form',
  imports: [IntegrationSelect],
  templateUrl: './integration-form.html',
  styleUrl: './integration-form.scss',
})
export class IntegrationForm {

}
