import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  isFolder?: boolean;
  children?: FileItem[];
  role: string;
  explanation: string;
  keyPoints: string[];
  codeContent: string;
}

@Component({
  selector: 'app-tree-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-explorer.component.html',
  styleUrl: './tree-explorer.component.css'
})
export class TreeExplorerComponent {
  readonly fileTree: FileItem[] = [
    {
      id: 'src',
      name: 'src/',
      path: 'src',
      icon: 'bi-folder-fill text-warning',
      isFolder: true,
      role: 'Dossier Source Principal',
      explanation: 'Contient l\'intégralité du code source applicatif TypeScript, HTML et CSS.',
      keyPoints: ['Isolé de la configuration externe', 'Point central pour le développement'],
      codeContent: '// Dossier racines des sources de l\'application',
      children: [
        {
          id: 'app',
          name: 'app/',
          path: 'src/app',
          icon: 'bi-folder-fill text-warning',
          isFolder: true,
          role: 'Dossier des Composants Applicatifs',
          explanation: 'Regroupe le composant racine (AppComponent), la configuration globale et les routes.',
          keyPoints: ['Contient les composants, services, routes', 'Architecture modularisée'],
          codeContent: '// Dossier principal contenant la logique Angular',
          children: [
            {
              id: 'app-component-ts',
              name: 'app.component.ts',
              path: 'src/app/app.component.ts',
              icon: 'bi-filetype-ts text-info',
              role: 'Composant Racine TypeScript',
              explanation: 'Classe TypeScript représentant le composant de plus haut niveau dans la hiérarchie UI.',
              keyPoints: ['Décorateur @Component', 'Déclaration standalone: true', 'Imports des sous-composants'],
              codeContent: `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-demo-app';
}`
            },
            {
              id: 'app-component-html',
              name: 'app.component.html',
              path: 'src/app/app.component.html',
              icon: 'bi-filetype-html text-danger',
              role: 'Template HTML Racine',
              explanation: 'Définition de la vue du composant racine. Reçoit l\'injection des liaisons de données.',
              keyPoints: ['Syntaxe des Control Flow (@if, @for)', 'Liaisons {{ }} et (clic)', 'Balise <router-outlet>'],
              codeContent: `<header>
  <h1>Bienvenue sur {{ title }}</h1>
</header>

<main>
  <router-outlet></router-outlet>
</main>`
            },
            {
              id: 'app-component-css',
              name: 'app.component.css',
              path: 'src/app/app.component.css',
              icon: 'bi-filetype-css text-primary',
              role: 'Styles Spécifiques du Composant Racine',
              explanation: 'Fichier de règles CSS appliquées uniquement au template de AppComponent via View Encapsulation.',
              keyPoints: ['Styles isolés du reste du DOM', 'Protection contre la pollution CSS globale'],
              codeContent: `header {
  background-color: #0f172a;
  color: white;
  padding: 1rem;
}`
            },
            {
              id: 'app-config-ts',
              name: 'app.config.ts',
              path: 'src/app/app.config.ts',
              icon: 'bi-gear-fill text-warning',
              role: 'Configuration Globale Applicative',
              explanation: 'Remplace l\'ancien AppModule. Définit les providers globaux (routeur, HTTP, animations).',
              keyPoints: ['Type ApplicationConfig', 'provideRouter(routes)', 'provideHttpClient()'],
              codeContent: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};`
            },
            {
              id: 'app-routes-ts',
              name: 'app.routes.ts',
              path: 'src/app/app.routes.ts',
              icon: 'bi-signpost-split-fill text-success',
              role: 'Table de Routage Client',
              explanation: 'Associe les chemins d\'URL aux composants correspondants pour la navigation SPA sans rechargement.',
              keyPoints: ['Tableau de type Routes', 'Lazy loading via loadComponent', 'Redirections'],
              codeContent: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];`
            }
          ]
        },
        {
          id: 'index-html',
          name: 'index.html',
          path: 'src/index.html',
          icon: 'bi-file-code-fill text-danger',
          role: 'Unique Fichier HTML physique (SPA)',
          explanation: 'La seule page HTML servie au navigateur. Elle héberge la balise racine <app-root>.',
          keyPoints: ['Balise <app-root></app-root>', 'Balises meta et title', 'Aucun HTML métier statique'],
          codeContent: `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Application Angular</title>
  <base href="/">
</head>
<body>
  <app-root></app-root>
</body>
</html>`
        },
        {
          id: 'main-ts',
          name: 'main.ts',
          path: 'src/main.ts',
          icon: 'bi-play-fill text-success',
          role: 'Point d\'Entrée Exécutable JavaScript/TypeScript',
          explanation: 'Premier script exécuté au démarrage. Amorce l\'application via bootstrapApplication().',
          keyPoints: ['Appel à bootstrapApplication(AppComponent, appConfig)', 'Initialisation de la plateforme'],
          codeContent: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`
        },
        {
          id: 'styles-css',
          name: 'styles.css',
          path: 'src/styles.css',
          icon: 'bi-palette-fill text-info',
          role: 'Styles CSS Globaux',
          explanation: 'Appliqué à l\'ensemble de l\'application (réinitialisation, thèmes, polices, utilitaires).',
          keyPoints: ['Imports de frameworks (Bootstrap, Material)', 'Variables CSS globales'],
          codeContent: `/* Styles globaux applicatifs */
body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}`
        }
      ]
    },
    {
      id: 'angular-json',
      name: 'angular.json',
      path: 'angular.json',
      icon: 'bi-filetype-json text-warning',
      role: 'Fichier de Configuration Maître du CLI Angular',
      explanation: 'Définit l\'architecture des projets, les options de compilation, scripts et assets inclus.',
      keyPoints: ['Configuration des environnements dev/prod', 'Inclusion des fichiers de styles/assets'],
      codeContent: `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "angular-demo-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles.css"]
          }
        }
      }
    }
  }
}`
    },
    {
      id: 'tsconfig-json',
      name: 'tsconfig.json',
      path: 'tsconfig.json',
      icon: 'bi-filetype-json text-info',
      role: 'Configuration du Compilateur TypeScript',
      explanation: 'Paramètre les options de compilation TS vers JS, le niveau de vérification stricte et les alias.',
      keyPoints: ['strict: true', 'target: ES2022', 'moduleResolution: bundler'],
      codeContent: `{
  "compileOnSave": false,
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": false,
    "module": "ES2022",
    "strict": true
  }
}`
    }
  ];

  selectedFile = signal<FileItem>(this.fileTree[0].children![0].children![0]); // default app.component.ts

  selectFile(file: FileItem) {
    if (!file.isFolder) {
      this.selectedFile.set(file);
    }
  }
}
