import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 9 + le Laboratoire Global
import { HeritagePathologiesComponent } from './features/01-heritage-pathologies/heritage-pathologies.component';
import { SemanticPillarsComponent } from './features/02-semantic-pillars/semantic-pillars.component';
import { DelegationMechanismComponent } from './features/03-delegation-mechanism/delegation-mechanism.component';
import { RuntimeSwapComponent } from './features/04-runtime-swap/runtime-swap.component';
import { DipInterfacesComponent } from './features/05-dip-interfaces/dip-interfaces.component';
import { DuelDecisionTreeComponent } from './features/06-duel-decision-tree/duel-decision-tree.component';
import { AntipatternsDebugComponent } from './features/07-antipatterns-debug/antipatterns-debug.component';
import { AngularGarageComponent } from './features/08-angular-garage/angular-garage.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    HeritagePathologiesComponent,
    SemanticPillarsComponent,
    DelegationMechanismComponent,
    RuntimeSwapComponent,
    DipInterfacesComponent,
    DuelDecisionTreeComponent,
    AntipatternsDebugComponent,
    AngularGarageComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement de Monaco Editor pour une disponibilité instantanée
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
