import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IntegrationForm } from './features/integrations/integration/integration-form/integration-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IntegrationForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
