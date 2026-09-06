import { Injectable, signal, computed } from '@angular/core';

export interface ModuleItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Theme state: 'dark' or 'light'
  readonly theme = signal<'dark' | 'light'>('dark');

  // Sidebar collapsed state
  readonly isSidebarCollapsed = signal<boolean>(false);

  // Active module ID
  readonly activeModuleId = signal<string>('mpa-vs-spa');

  // Completed workshops progress tracker
  readonly completedWorkshops = signal<Set<string>>(new Set());

  // Modules list definition
  readonly modules: ModuleItem[] = [
    {
      id: 'mpa-vs-spa',
      title: '1. MPA vs SPA',
      icon: 'bi-diagram-3',
      badge: 'Architecture',
      description: 'Comparateur visuel de flux réseau & tableau dynamique'
    },
    {
      id: 'tree-explorer',
      title: '2. Arborescence CLI',
      icon: 'bi-folder-symlink',
      badge: 'Fichiers',
      description: 'Explorateur interactif de projet & fiches descriptives'
    },
    {
      id: 'bootstrap-flow',
      title: '3. Cycle de Démarrage',
      icon: 'bi-play-circle',
      badge: 'Bootstrap',
      description: 'Visualiseur pas-à-pas du bootstrap & DOM en direct'
    },
    {
      id: 'standalone-anatomy',
      title: '4. Composant Standalone',
      icon: 'bi-box-seam',
      badge: 'Architecture',
      description: 'Anatomie du décorateur @Component & Mode Rayons X'
    },
    {
      id: 'data-bindings',
      title: '5. Liaisons de Données',
      icon: 'bi-arrow-repeat',
      badge: 'Bindings',
      description: 'Bac à sable : Interpolation, Property & Event Binding'
    },
    {
      id: 'css-encapsulation',
      title: '6. Encapsulation CSS',
      icon: 'bi-shield-lock',
      badge: 'Scoped CSS',
      description: 'Démonstrateur d\'isolation de styles (View Encapsulation)'
    },
    {
      id: 'cli-terminal',
      title: '7. Console CLI',
      icon: 'bi-terminal',
      badge: 'CLI',
      description: 'Simulateur de terminal Angular (ng serve, generate, build)'
    },
    {
      id: 'lab-workshops',
      title: '8. Ateliers Pratiques',
      icon: 'bi-code-slash',
      badge: 'Monaco Lab',
      description: '4 Ateliers guidés avec éditeur Monaco & validation'
    }
  ];

  readonly activeModule = computed(() => {
    const id = this.activeModuleId();
    return this.modules.find(m => m.id === id) || this.modules[0];
  });

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }

  setActiveModule(id: string): void {
    this.activeModuleId.set(id);
  }

  markWorkshopCompleted(workshopId: string): void {
    this.completedWorkshops.update(set => {
      const updated = new Set(set);
      updated.add(workshopId);
      return updated;
    });
  }
}
