import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('heritage-pathologies');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'heritage-pathologies',
      index: 1,
      title: 'Pourquoi l\'Héritage ne suffit plus ? (Les 3 Pathologies)',
      shortTitle: 'Pathologies de l\'Héritage',
      icon: 'alert-triangle',
      badge: '2^N & Effets de Bord',
      description: 'Explosion combinatoire (2^N), classe de base fragile et le syndrome du « gorille et de la banane » de Joe Armstrong.',
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'semantic-pillars',
      index: 2,
      title: 'Les Piliers Sémantiques : « Est-un » vs « A-un »',
      shortTitle: '« Est-un » vs « A-un »',
      icon: 'git-branch',
      badge: 'UML & Quiz Liskov',
      description: 'Filiation rigide (extends) vs assemblage modulaire (has-a). Quiz de diagnostic et piège du Carré/Rectangle.',
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'delegation-mechanism',
      index: 3,
      title: 'Le Cœur de la Composition : Mécanisme & Délégation',
      shortTitle: 'Délégation & 3 Vertus',
      icon: 'send',
      badge: 'Boîte Noire & SRP',
      description: 'Transmettre le travail à un collaborateur interne. Les 3 vertus : spécialisation, cloisonnement et réutilisabilité.',
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'runtime-swap',
      index: 4,
      title: 'Le Super-pouvoir : Remplacement Dynamique à Chaud',
      shortTitle: 'Permutation à Chaud (Swap)',
      icon: 'refresh-cw',
      badge: 'Mutabilité Runtime',
      description: 'Changer de composant en plein vol (Moteur Éco vs Sport) sans jamais détruire ni réinstancier la voiture composite.',
      labNumber: 2,
      exerciseCount: 5
    },
    {
      id: 'dip-interfaces',
      index: 5,
      title: 'Découplage par l\'Interface & Inversion des Dépendances (DIP)',
      shortTitle: 'Découplage & DIP',
      icon: 'layers',
      badge: 'Polymorphisme & Mocks',
      description: 'Éliminer le new en dur, programmer vers un contrat Engine et injecter des Mocks pour des tests unitaires instantanés.',
      labNumber: 3,
      exerciseCount: 5
    },
    {
      id: 'duel-decision-tree',
      index: 6,
      title: 'Le Duel & L\'Arbre de Décision Interactif',
      shortTitle: 'Duel & Arbre Décisionnel',
      icon: 'compass',
      badge: 'Gang of Four (1994)',
      description: 'Tableau comparatif à 8 critères, logigramme pas-à-pas et la règle d\'or : « Composez ce que vos objets font ».',
      labNumber: 4,
      exerciseCount: 5
    },
    {
      id: 'antipatterns-debug',
      index: 7,
      title: 'Pièges Fréquents & Anti-Patterns Débogués',
      shortTitle: 'Anti-Patterns Débogués',
      icon: 'shield-alert',
      badge: 'Pile & BaseComponent',
      description: 'L\'héritage de paresse (Pile extends Array cassée par splice/sort) et le piège du BaseComponent fourre-tout en Angular.',
      labNumber: 5,
      exerciseCount: 5
    },
    {
      id: 'angular-garage',
      index: 8,
      title: 'Démonstration Pratique Angular : Le Garage Modulaire',
      shortTitle: 'Garage Modulaire Angular',
      icon: 'cpu',
      badge: 'Standalone & Signals',
      description: 'Mini-application complète : VehicleCardComponent avec signal input car() et démarrage sonore réactif par délégation.',
      labNumber: 5,
      exerciseCount: 5
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Laboratoire Étudiant Global — 25 Micro-Exercices',
      shortTitle: 'Labo Monaco (25 Ex)',
      icon: 'code',
      badge: '25 Défis Pratiques',
      description: 'Banc d\'entraînement complet avec Monaco Editor, console virtuelle intégrée et validation par assertions automatiques.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
