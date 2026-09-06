import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-bindings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-bindings.component.html',
  styleUrl: './data-bindings.component.css'
})
export class DataBindingsComponent {
  // Interpolation binding state
  studentName = signal<string>('Jean Dupont');
  courseTitle = signal<string>('Programmation Orientée Objet & Angular');

  // Property binding state
  isButtonDisabled = signal<boolean>(true);
  badgeStatus = signal<'online' | 'offline'>('online');

  // Event binding state
  clickCounter = signal<number>(0);
  lastActionLog = signal<string>('Aucun événement déclenché');

  incrementCounter() {
    this.clickCounter.update(c => c + 1);
    this.lastActionLog.set(`Méthode (click)="incrementCounter()" exécutée à ${new Date().toLocaleTimeString()}`);
  }

  resetCounter() {
    this.clickCounter.set(0);
    this.lastActionLog.set(`Méthode (click)="resetCounter()" exécutée à ${new Date().toLocaleTimeString()}`);
  }

  toggleButtonDisabled() {
    this.isButtonDisabled.update(v => !v);
  }

  toggleBadgeStatus() {
    this.badgeStatus.update(s => s === 'online' ? 'offline' : 'online');
  }
}
