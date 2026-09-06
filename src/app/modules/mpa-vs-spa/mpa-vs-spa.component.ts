import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MatrixRow {
  category: 'Performance' | 'SEO' | 'État Client' | 'Architecture';
  mpa: string;
  spa: string;
  verdict: 'MPA' | 'SPA' | 'Équivalent';
  details: string;
}

@Component({
  selector: 'app-mpa-vs-spa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mpa-vs-spa.component.html',
  styleUrl: './mpa-vs-spa.component.css'
})
export class MpaVsSpaComponent {
  // Simulator mode
  mode = signal<'MPA' | 'SPA'>('MPA');

  // Simulation status states
  isLoading = signal<boolean>(false);
  logs = signal<Array<{ time: string; type: 'request' | 'response' | 'dom' | 'info'; text: string }>>([]);
  flashEffect = signal<boolean>(false);

  // Current page state in simulator
  currentPage = signal<'accueil' | 'cours' | 'profil'>('accueil');
  pageContent = signal<{ title: string; data: any }>({
    title: 'Page d\'Accueil',
    data: { items: ['Présentation de la formation', 'Planning 2026', 'Intervenants'] }
  });

  // Filter state for matrix
  selectedCategory = signal<string>('Toutes');

  readonly matrixData: MatrixRow[] = [
    {
      category: 'Performance',
      mpa: 'Rechargement total à chaque clic. Téléchargement répété des scripts/CSS/HTML.',
      spa: 'Chargement initial unique des bundles JS/CSS. Chargement rapide des données JSON ultérieures.',
      verdict: 'SPA',
      details: 'La SPA élimine l\'effet de clignotement ("flash blanc") et réduit les échanges réseau au strict nécessaire (données JSON).'
    },
    {
      category: 'SEO',
      mpa: 'Excellente par défaut. Le serveur délivre du HTML directement indexable par les robots.',
      spa: 'Indexation plus complexe (Client-Side Rendering), nécessitant SSR (Angular Universal / SSR) ou pre-rendering.',
      verdict: 'MPA',
      details: 'Pour des sites éditoriaux ou e-commerce ouverts au public, le MPA ou le SSR est privilégié pour le référencement.'
    },
    {
      category: 'État Client',
      mpa: 'Perte automatique de l\'état de la page lors du rechargement HTTP (sauf stockage Session/Cookies).',
      spa: 'Conservation fluide de l\'état en mémoire JS (ex: formulaires multi-étapes, paniers, filtres activement sélectionnés).',
      verdict: 'SPA',
      details: 'L\'expérience utilisateur se rapproche de celle d\'une application de bureau ou mobile native.'
    },
    {
      category: 'Architecture',
      mpa: 'Couplage fort entre le code serveur (rendu HTML) et la logique Frontend.',
      spa: 'Séparation stricte : Le Frontend gère l\'IHM et interagit avec une API REST/GraphQL stateless.',
      verdict: 'SPA',
      details: 'Permet une réutilisation directe des API backend pour d\'autres clients (Mobile iOS/Android, tiers).'
    }
  ];

  filteredMatrix() {
    const cat = this.selectedCategory();
    if (cat === 'Toutes') return this.matrixData;
    return this.matrixData.filter(item => item.category === cat);
  }

  setMode(newMode: 'MPA' | 'SPA') {
    this.mode.set(newMode);
    this.resetSimulation();
  }

  resetSimulation() {
    this.logs.set([]);
    this.currentPage.set('accueil');
    this.pageContent.set({
      title: 'Page d\'Accueil',
      data: { items: ['Présentation de la formation', 'Planning 2026', 'Intervenants'] }
    });
  }

  addLog(type: 'request' | 'response' | 'dom' | 'info', text: string) {
    const time = new Date().toLocaleTimeString();
    this.logs.update(list => [...list, { time, type, text }]);
  }

  navigate(page: 'accueil' | 'cours' | 'profil') {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    if (this.mode() === 'MPA') {
      this.simulateMpaNavigation(page);
    } else {
      this.simulateSpaNavigation(page);
    }
  }

  private simulateMpaNavigation(page: 'accueil' | 'cours' | 'profil') {
    this.addLog('request', `[HTTP GET] Demande de nouvelle page HTML: /${page}.html`);

    setTimeout(() => {
      // Flash effect simulating full page reload and lost DOM state
      this.flashEffect.set(true);
      this.addLog('response', `[200 OK] Serveur web génère & renvoie le fichier HTML complet (${page}.html)`);

      setTimeout(() => {
        this.flashEffect.set(false);
        this.currentPage.set(page);
        this.updatePageContent(page);
        this.addLog('dom', `[RELOAD COMPLETE] Destruct. & Reconstruction complète du DOM + Réexécution scripts`);
        this.isLoading.set(false);
      }, 500);
    }, 600);
  }

  private simulateSpaNavigation(page: 'accueil' | 'cours' | 'profil') {
    this.addLog('info', `[ROUTER CLIENT] Interception du clic vers /${page} (Aucun rechargement de page)`);
    this.addLog('request', `[AJAX/Fetch] Requête asynchrone légère : GET /api/${page}.json`);

    setTimeout(() => {
      this.addLog('response', `[200 OK] Reçu fragment JSON pur ({ title: "...", data: [...] })`);
      this.currentPage.set(page);
      this.updatePageContent(page);
      this.addLog('dom', `[DOM DYNAMIQUE] Mise à jour localisée du DOM par Angular Signals/Zone`);
      this.isLoading.set(false);
    }, 400);
  }

  private updatePageContent(page: 'accueil' | 'cours' | 'profil') {
    switch (page) {
      case 'accueil':
        this.pageContent.set({
          title: 'Page d\'Accueil',
          data: { items: ['Présentation de la formation', 'Planning 2026', 'Intervenants'] }
        });
        break;
      case 'cours':
        this.pageContent.set({
          title: 'Liste des Cours Angular',
          data: { items: ['Séance 1: Intro OO & Git', 'Séance 2: TypeScript', 'Séance 3: Architecture SPA & CLI'] }
        });
        break;
      case 'profil':
        this.pageContent.set({
          title: 'Espace Étudiant',
          data: { items: ['Nom: Jean Dupont', 'Groupe: Apprentissage 2026', 'Ateliers complétés: 0/4'] }
        });
        break;
    }
  }
}
