import { Component, signal, computed } from '@angular/core';
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
import { Projet } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToggleSwitchModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  readonly form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    isActive: new FormControl<boolean>(true),
  });

  onSubmit() {
    console.log('Project submitted:', this.form.value);
    // TODO: Émettre l'événement ou appeler un service
  }

  onReset() {
    // this.name.set('');
  }
}
