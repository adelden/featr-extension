import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IntegrationForm } from './features/integrations/integration/integration-form/integration-form';
import { ProjectForm } from './features/project/project-form/project-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IntegrationForm, ProjectForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
