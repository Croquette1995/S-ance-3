import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepInfo {
  step: number;
  title: string;
  description: string;
  fileFocus: string;
  codeSnippet: string;
  domState: string;
}

@Component({
  selector: 'app-bootstrap-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bootstrap-flow.component.html',
  styleUrl: './bootstrap-flow.component.css'
})
export class BootstrapFlowComponent {
  currentStep = signal<number>(1);

  readonly steps: StepInfo[] = [
    {
      step: 1,
      title: 'Étape 1 : Chargement de index.html',
      description: 'Le navigateur émet la requête HTTP initiale et reçoit le fichier squelette `index.html`. Il ne contient que la balise personnalisée `<app-root></app-root>` totalement vide.',
      fileFocus: 'src/index.html',
      codeSnippet: `<!doctype html>
<html lang="fr">
<head>
  <title>Démo Angular</title>
</head>
<body>
  <!-- Balise racine vide en attente de démarrage -->
  <app-root></app-root>
</body>
</html>`,
      domState: `<body>
  <app-root>
    <!-- DOM vide (En attente de bootstrap) -->
  </app-root>
</body>`
    },
    {
      step: 2,
      title: 'Étape 2 : Chargement et Exécution de main.ts',
      description: 'Le navigateur télécharge et exécute le bundle JavaScript compilé démarrant par `main.ts`. C\'est le point d\'entrée principal de l\'application.',
      fileFocus: 'src/main.ts',
      codeSnippet: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Démarrage manuel de l'application
bootstrapApplication(AppComponent, appConfig);`,
      domState: `<body>
  <app-root>
    <!-- Chargement des scripts JS et initialisation du moteur Angular... -->
  </app-root>
</body>`
    },
    {
      step: 3,
      title: 'Étape 3 : bootstrapApplication(AppComponent, appConfig)',
      description: 'Angular initialise la plateforme client, charge les providers définis dans `appConfig` (routeur, HTTP...) et instancie le composant racine `AppComponent`.',
      fileFocus: 'src/app/app.config.ts & app.component.ts',
      codeSnippet: `export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent { ... }`,
      domState: `<body>
  <app-root>
    <!-- Angular instancie la classe AppComponent en mémoire -->
  </app-root>
</body>`
    },
    {
      step: 4,
      title: 'Étape 4 : Injection du rendu dans <app-root>',
      description: 'Angular évalue le template HTML et les liaisons de données de `AppComponent`, puis remplace dynamiquement l\'intérieur de la balise `<app-root>` par l\'arbre de rendu final.',
      fileFocus: 'src/app/app.component.html',
      codeSnippet: `<div class="card">
  <h1>Cours de POO & Angular</h1>
  <p>Statut : <span class="online">En direct</span></p>
</div>`,
      domState: `<body>
  <app-root>
    <div class="card">
      <h1>Cours de POO & Angular</h1>
      <p>Statut : <span class="online">En direct</span></p>
    </div>
  </app-root>
</body>`
    }
  ];

  get currentStepData() {
    return this.steps[this.currentStep() - 1];
  }

  nextStep() {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  replay() {
    this.currentStep.set(1);
  }
}
