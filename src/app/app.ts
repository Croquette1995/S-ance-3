import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from './services/app-state.service';
import { MpaVsSpaComponent } from './modules/mpa-vs-spa/mpa-vs-spa.component';
import { TreeExplorerComponent } from './modules/tree-explorer/tree-explorer.component';
import { BootstrapFlowComponent } from './modules/bootstrap-flow/bootstrap-flow.component';
import { StandaloneAnatomyComponent } from './modules/standalone-anatomy/standalone-anatomy.component';
import { DataBindingsComponent } from './modules/data-bindings/data-bindings.component';
import { CssEncapsulationComponent } from './modules/css-encapsulation/css-encapsulation.component';
import { CliTerminalComponent } from './modules/cli-terminal/cli-terminal.component';
import { LabWorkshopsComponent } from './modules/lab-workshops/lab-workshops.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MpaVsSpaComponent,
    TreeExplorerComponent,
    BootstrapFlowComponent,
    StandaloneAnatomyComponent,
    DataBindingsComponent,
    CssEncapsulationComponent,
    CliTerminalComponent,
    LabWorkshopsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly state = inject(AppStateService);
}
