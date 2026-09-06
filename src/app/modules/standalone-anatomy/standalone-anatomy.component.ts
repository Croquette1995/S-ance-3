import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComponentZone {
  id: string;
  name: string;
  selectorInCode: string;
  targetRole: string;
  description: string;
  impactHtml: string;
  impactCss: string;
}

@Component({
  selector: 'app-standalone-anatomy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standalone-anatomy.component.html',
  styleUrl: './standalone-anatomy.component.css'
})
export class StandaloneAnatomyComponent {
  hoveredZone = signal<ComponentZone | null>(null);

  readonly zones: ComponentZone[] = [
    {
      id: 'selector',
      name: 'selector: \'app-root\'',
      selectorInCode: 'selector',
      targetRole: 'Balise HTML Personnalisée',
      description: 'Définit le nom de la balise HTML racine permettant d\'instancier ce composant dans un template (ex: <app-root></app-root> dans index.html).',
      impactHtml: '<app-root> <-- La balise dans index.html instancie ce composant !',
      impactCss: 'app-root { display: block; } (Peut être ciblé en CSS via sa balise)'
    },
    {
      id: 'standalone',
      name: 'standalone: true',
      selectorInCode: 'standalone',
      targetRole: 'Composant Autonome Sans NgModule',
      description: 'Indique qu\'il s\'agit d\'un composant moderne Angular autonome. Il gère ses propres dépendances sans nécessiter de déclaration dans un NgModule.',
      impactHtml: 'Aucune dépendance externe requise pour charger ce composant',
      impactCss: 'N/A'
    },
    {
      id: 'imports',
      name: 'imports: [RouterOutlet, CommonModule]',
      selectorInCode: 'imports',
      targetRole: 'Tableau des Dépendances Directes',
      description: 'Déclare explicitement les composants, directives, pipes ou modules utilisables dans le template HTML de ce composant.',
      impactHtml: '<router-outlet></router-outlet> est utilisable grâce à cet import !',
      impactCss: 'N/A'
    },
    {
      id: 'templateUrl',
      name: 'templateUrl: \'./app.component.html\'',
      selectorInCode: 'templateUrl',
      targetRole: 'Lien vers la Vue HTML',
      description: 'Spécifie le fichier HTML contenant la structure de présentation visuelle du composant.',
      impactHtml: '<div class="card"><h1>{{ courseName }}</h1></div>',
      impactCss: 'Rendu structuré selon les éléments du template'
    },
    {
      id: 'styleUrl',
      name: 'styleUrl: \'./app.component.css\'',
      selectorInCode: 'styleUrl',
      targetRole: 'Lien vers les Styles Isolés (Scoped)',
      description: 'Chemin vers le fichier CSS. Ses règles sont scopées exclusivement à ce composant via un attribut d\'encapsulation.',
      impactHtml: '<h1 _ngcontent-ng-c123>...</h1> (Angular ajoute un attribut _ngcontent)',
      impactCss: 'h1[_ngcontent-ng-c123] { color: #dd0031; } (Styles isolés !)'
    },
    {
      id: 'class',
      name: 'export class AppComponent { ... }',
      selectorInCode: 'class',
      targetRole: 'Classe TypeScript (Logique & État)',
      description: 'Contient les propriétés de données (courseName, isOnline) et les méthodes membres (toggleStatus) constituant l\'état du composant.',
      impactHtml: 'Injection directe de {{ courseName }} et association de (click)="toggleStatus()"',
      impactCss: 'Modification dynamique de [class.online]="isOnline"'
    }
  ];

  setHover(zone: ComponentZone | null) {
    this.hoveredZone.set(zone);
  }
}
