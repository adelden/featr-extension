import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DaemonService } from './core/services/daemon.service';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, CardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly daemon = inject(DaemonService);

  onPing(): void {
    this.daemon.ping();
  }
}
