import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface DaemonResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class DaemonService {
  private port: chrome.runtime.Port | null = null;
  private readonly NATIVE_HOST = 'com.featr.daemon';

  private messageSubject = new Subject<DaemonResponse>();

  readonly isConnected = signal(false);
  readonly lastResponse = signal<DaemonResponse | null>(null);
  readonly lastError = signal<string | null>(null);

  get messages$(): Observable<DaemonResponse> {
    return this.messageSubject.asObservable();
  }

  connect(): void {
    if (this.port) {
      console.log('Already connected to daemon');
      return;
    }

    try {
      this.port = chrome.runtime.connectNative(this.NATIVE_HOST);
      this.isConnected.set(true);
      this.lastError.set(null);

      this.port.onMessage.addListener((response: DaemonResponse) => {
        console.log('Daemon response:', response);
        this.lastResponse.set(response);
        this.messageSubject.next(response);
      });

      this.port.onDisconnect.addListener(() => {
        const error = chrome.runtime.lastError?.message || 'Disconnected';
        console.log('Daemon disconnected:', error);
        this.isConnected.set(false);
        this.lastError.set(error);
        this.port = null;
      });

      console.log('Connected to daemon');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      this.lastError.set(errorMessage);
      this.isConnected.set(false);
      console.error('Failed to connect to daemon:', errorMessage);
    }
  }

  disconnect(): void {
    if (this.port) {
      this.port.disconnect();
      this.port = null;
      this.isConnected.set(false);
    }
  }

  send(action: string, data?: Record<string, unknown>): void {
    if (!this.port) {
      this.connect();
    }

    if (this.port) {
      const message = { action, ...data };
      console.log('Sending to daemon:', message);
      this.port.postMessage(message);
    }
  }

  ping(): void {
    this.send('ping');
  }
}
