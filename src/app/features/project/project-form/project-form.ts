import { Component, signal, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  name = signal<string>('');
  isActive = signal<boolean>(true);

  // Computed signal pour vérifier si le formulaire est valide
  isFormValid = computed<boolean>(() => {
    return this.name().trim().length > 0;
  });

  onSubmit() {
    if (!this.isFormValid()) return;

    const project: Omit<Projet, 'id' | 'createdAt'> = {
      name: this.name(),
      isActive: this.isActive(),
    };

    console.log('Project submitted:', project);
    // TODO: Émettre l'événement ou appeler un service
  }

  onReset() {
    this.name.set('');
    this.isActive.set(true);
  }
}
