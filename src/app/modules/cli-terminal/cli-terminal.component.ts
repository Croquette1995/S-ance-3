import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TerminalOutput {
  id: number;
  command: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'file';
  lines: string[];
}

@Component({
  selector: 'app-cli-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cli-terminal.component.html',
  styleUrl: './cli-terminal.component.css'
})
export class CliTerminalComponent {
  userInput = signal<string>('');
  history = signal<TerminalOutput[]>([
    {
      id: 1,
      command: 'ng --version',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      lines: [
        'Angular CLI: 21.2.23',
        'Node: 22.22.1',
        'Package Manager: npm 11.11.0',
        'OS: linux x64'
      ]
    }
  ]);

  readonly quickCommands = [
    { label: 'ng serve (npm start)', cmd: 'ng serve' },
    { label: 'ng generate component', cmd: 'ng generate component components/header' },
    { label: 'ng build', cmd: 'ng build' },
    { label: 'ng test', cmd: 'ng test' },
    { label: 'ng help', cmd: 'ng help' }
  ];

  executeCommand(cmdToRun?: string) {
    const cmd = (cmdToRun || this.userInput()).trim();
    if (!cmd) return;

    this.userInput.set('');
    const timestamp = new Date().toLocaleTimeString();

    if (cmd === 'clear') {
      this.history.set([]);
      return;
    }

    let output: TerminalOutput;

    if (cmd === 'ng serve' || cmd === 'npm start') {
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'success',
        lines: [
          '❯ Building development bundle...',
          '✔ Building application...',
          'Initial chunk files | Names | Raw size',
          'main.js | main | 215 kB',
          'styles.css | styles | 420 kB',
          'Application bundle generation complete.',
          'Local development server running at: http://localhost:4200/',
          'Live Reload is enabled.'
        ]
      };
    } else if (cmd.startsWith('ng generate component') || cmd.startsWith('ng g c')) {
      const parts = cmd.split(' ');
      const compName = parts[parts.length - 1] || 'header';
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'file',
        lines: [
          `CREATE src/app/${compName}/${compName}.component.css (0 bytes)`,
          `CREATE src/app/${compName}/${compName}.component.html (24 bytes)`,
          `CREATE src/app/${compName}/${compName}.component.spec.ts (590 bytes)`,
          `CREATE src/app/${compName}/${compName}.component.ts (310 bytes)`,
          'UPDATE src/app/app.component.ts (Added component import)'
        ]
      };
    } else if (cmd === 'ng build') {
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'success',
        lines: [
          '❯ Compiling Angular application for Production...',
          '✔ Tree-shaking and minification applied.',
          'Output location: /dist/angular-demo-app',
          'Build Complete! Initial Bundle: 180 kB (Gzip: 48 kB)'
        ]
      };
    } else if (cmd === 'ng test') {
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'info',
        lines: [
          '❯ Running unit test suite with Karma / Vitest...',
          'AppComponent: should create the app (PASSED)',
          'AppComponent: should render title in h1 (PASSED)',
          'HeaderComponent: should render header title (PASSED)',
          'TEST SUITE PASSED: 3/3 tests passed.'
        ]
      };
    } else if (cmd === 'ng help') {
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'info',
        lines: [
          'Commandes CLI Angular disponibles :',
          '  ng serve              - Démarrer le serveur de dev local',
          '  ng generate component - Générer les 4 fichiers d\'un composant',
          '  ng build              - Compiler et optimiser pour la prod',
          '  ng test               - Lancer la suite de tests unitaires',
          '  clear                 - Effacer la console'
        ]
      };
    } else {
      output = {
        id: Date.now(),
        command: cmd,
        timestamp,
        type: 'error',
        lines: [
          `Erreur : Commande '${cmd}' non reconnue par le simulateur CLI.`,
          'Essayez \'ng serve\', \'ng generate component\', \'ng build\', ou \'ng help\'.'
        ]
      };
    }

    this.history.update(h => [...h, output]);
  }
}
