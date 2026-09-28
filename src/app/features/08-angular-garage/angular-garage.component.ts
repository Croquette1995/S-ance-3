import { Component, signal, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleCardComponent } from './components/vehicle-card/vehicle-card.component';
import { Car } from './models/car.model';
import { Engine } from './models/engine.interface';
import { ElectricEngine, CombustionEngine, HybridEngine, HydrogenEngine } from './models/engines.model';

@Component({
  selector: 'app-angular-garage',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent],
  template: `
    <div class="module-container">
      <!-- HEADER -->
      <div class="module-header">
        <div class="module-tag">MODULE 08 · ATELIER COMPLET D'APPLICATION</div>
        <h2>Le Garage Modulaire Angular : Assemblage, Composition &amp; Signal Inputs</h2>
        <p class="module-desc">
          Mise en pratique concrète et visuelle : comment instancier des objets composites en POO TypeScript, les injecter dans des composants enfants Standalone via <code>input.required&lt;Car&gt;()</code>, et observer la chaîne de délégation de bout en bout.
        </p>
      </div>

      <!-- TABS -->
      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeTab() === 'showroom'" (click)="activeTab.set('showroom')">
          <span>🚗 Le Showroom Interactif</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeTab() === 'builder'" (click)="activeTab.set('builder')">
          <span>🛠️ Concepteur de Véhicule Personnalisé</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeTab() === 'code'" (click)="activeTab.set('code')">
          <span>📂 Explorateur de Code Source Complet</span>
        </button>
      </div>

      <!-- ONGLET 1 : SHOWROOM -->
      @if (activeTab() === 'showroom') {
        <div class="showroom-wrapper">
          <!-- COMMAND BAR -->
          <div class="command-bar">
            <div class="left-actions">
              <button class="btn-ctrl btn-primary" (click)="startAllCars()">
                ⚡ Démarrer toute la flotte simultanément
              </button>
              <button class="btn-ctrl btn-ghost" (click)="stopAllCars()">
                🔇 Couper le contact partout
              </button>
            </div>
            <div class="fleet-stat">
              Flotte active : <strong>{{ vehicles().length }} véhicules composites</strong>
            </div>
          </div>

          <!-- GRILLE DES VÉHICULES -->
          <div class="vehicles-grid">
            @for (veh of vehicles(); track veh.brand + veh.model) {
              <app-vehicle-card #card [car]="veh" (engineChanged)="onEngineChanged(veh, $event)"></app-vehicle-card>
            }
          </div>

          <!-- ENCART PÉDAGOGIQUE -->
          <div class="pedagogical-summary-grid">
            <div class="p-card blue">
              <div class="p-num">1</div>
              <h4>Composition Pure</h4>
              <p>Une seule classe <code>Car</code> pour tout le parc ! Aucun besoin de créer <code>CarElectrique</code> ou <code>CarThermique</code>. Le comportement dépend entièrement du moteur injecté.</p>
            </div>

            <div class="p-card green">
              <div class="p-num">2</div>
              <h4>Délégation Pure</h4>
              <p>Le bouton appelle <code>car.start()</code>, qui délègue en 1 ligne à <code>engine.start()</code>. L'interface graphique n'a pas besoin de connaître les entrailles mécaniques.</p>
            </div>

            <div class="p-card purple">
              <div class="p-num">3</div>
              <h4>Modern Angular Signals</h4>
              <p>Le composant carte consomme <code>input.required&lt;Car&gt;()</code> et gère l'état réactif via des Signaux, garantissant des performances maximales sans superflu.</p>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : CONCEPTEUR -->
      @if (activeTab() === 'builder') {
        <div class="builder-wrapper">
          <div class="builder-card">
            <h3>Assemblez un Véhicule Composite sur Mesure</h3>
            <p class="builder-subtitle">Choisissez les composants matériels et injectez-les dans une nouvelle instance de <code>Car</code> :</p>

            <div class="form-grid">
              <div class="form-group">
                <label>Marque :</label>
                <input type="text" [(ngModel)]="customBrand" class="form-input" placeholder="Ex: Ferrari" />
              </div>

              <div class="form-group">
                <label>Modèle :</label>
                <input type="text" [(ngModel)]="customModel" class="form-input" placeholder="Ex: Daytona SP3" />
              </div>

              <div class="form-group">
                <label>Couleur carrosserie :</label>
                <div class="color-picker-row">
                  <input type="color" [(ngModel)]="customColor" class="color-swatch-input" />
                  <span class="color-val">{{ customColor }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>Type de Motorisation (Injectée) :</label>
                <select [(ngModel)]="customEngineType" class="form-select">
                  <option value="electric">⚡ Électrique Synchrone</option>
                  <option value="v6">🔥 Thermique V6 (350 ch)</option>
                  <option value="v8">🔥 Thermique V8 (500 ch)</option>
                  <option value="v12">🔥 Thermique V12 Atmosphérique (800 ch)</option>
                  <option value="hybrid-eco">🍃 Hybride Mode Eco</option>
                  <option value="hybrid-sport">⚡ Hybride Mode Sport</option>
                  <option value="hydrogen">💧 Pile à Hydrogène Haute Densité</option>
                </select>
              </div>
            </div>

            <!-- APERÇU EN DIRECT DU CODE D'ASSEMBLAGE -->
            <div class="live-code-preview">
              <div class="preview-label">Code TypeScript d'instanciation correspondant :</div>
              <code>const myCar = new Car('{{ customBrand }}', '{{ customModel }}', '{{ customColor }}', {{ getCustomEngineInstCode() }});</code>
            </div>

            <div class="builder-actions">
              <button class="btn-create" (click)="addCustomVehicle()">
                ➕ Assembler et ajouter au Showroom
              </button>
              @if (addSuccess()) {
                <span class="success-msg">✔ Véhicule composite ajouté à la flotte avec succès !</span>
              }
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 3 : CODE COMPLET -->
      @if (activeTab() === 'code') {
        <div class="code-explorer-wrapper">
          <div class="code-file-tabs">
            <button class="file-tab" [class.active]="selectedFile() === 'interface'" (click)="selectedFile.set('interface')">
              📄 engine.interface.ts
            </button>
            <button class="file-tab" [class.active]="selectedFile() === 'engines'" (click)="selectedFile.set('engines')">
              📄 engines.model.ts
            </button>
            <button class="file-tab" [class.active]="selectedFile() === 'car'" (click)="selectedFile.set('car')">
              📄 car.model.ts
            </button>
            <button class="file-tab" [class.active]="selectedFile() === 'component'" (click)="selectedFile.set('component')">
              📄 vehicle-card.component.ts
            </button>
            <button class="file-tab" [class.active]="selectedFile() === 'parent'" (click)="selectedFile.set('parent')">
              📄 angular-garage.component.ts
            </button>
          </div>

          <div class="code-viewer-panel">
            @switch (selectedFile()) {
              @case ('interface') {
                <pre><code>// src/app/models/engine.interface.ts
export interface Engine &#123;
  readonly type: string;
  start(): string;
&#125;</code></pre>
              }
              @case ('engines') {
                <pre><code>// src/app/models/engines.model.ts
import &#123; Engine &#125; from './engine.interface';

export class ElectricEngine implements Engine &#123;
  readonly type = 'Électrique';
  start(): string &#123;
    return '⚡ Silence absolu... 100% couple instantané !';
  &#125;
&#125;

export class CombustionEngine implements Engine &#123;
  readonly type = 'Thermique';
  constructor(public readonly cylindres: number = 4) &#123;&#125;

  start(): string &#123;
    return &#96;🔥 Vrouuum ! Les $&#123;this.cylindres&#125; cylindres rugissent !&#96;;
  &#125;
&#125;

export class HybridEngine implements Engine &#123;
  readonly type = 'Hybride';
  constructor(public readonly mode: 'eco' | 'sport' = 'eco') &#123;&#125;

  start(): string &#123;
    return &#96;🍃 Décollage silencieux en électrique, puis réveil du 4 cylindres ($&#123;this.mode.toUpperCase()&#125;) !&#96;;
  &#125;
&#125;

export class HydrogenEngine implements Engine &#123;
  readonly type = 'Hydrogène';
  start(): string &#123;
    return '💧 Pile à hydrogène sous tension : zéro émission de CO₂, vapeur d\\'eau pure !';
  &#125;
&#125;</code></pre>
              }
              @case ('car') {
                <pre><code>// src/app/models/car.model.ts
import &#123; Engine &#125; from './engine.interface';

export class Car &#123;
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly color: string,
    // ✅ "A UN" moteur (Composition &amp; Injection par constructeur)
    private engine: Engine,
    public readonly year: number = 2025
  ) &#123;&#125;

  get engineType(): string &#123;
    return this.engine.type;
  &#125;

  // ✅ DÉLÉGATION de l'action
  start(): string &#123;
    return this.engine.start();
  &#125;

  // Permutation dynamique (Runtime Swap)
  changeEngine(newEngine: Engine): void &#123;
    this.engine = newEngine;
  &#125;
&#125;</code></pre>
              }
              @case ('component') {
                <pre><code>// src/app/components/vehicle-card/vehicle-card.component.ts
import &#123; Component, input, signal &#125; from '&#64;angular/core';
import &#123; Car &#125; from '../../models/car.model';

&#64;Component(&#123;
  selector: 'app-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.component.html'
&#125;)
export class VehicleCardComponent &#123;
  // ✅ Signal Input obligatoire
  car = input.required&lt;Car&gt;();

  // ✅ État local réactif
  engineSound = signal&lt;string&gt;('Moteur à l\\'arrêt');

  onStartCar(): void &#123;
    // Appel de la méthode de la voiture -&gt; DÉLÉGATION vers le moteur
    const sound = this.car().start();
    this.engineSound.set(sound);
  &#125;
&#125;</code></pre>
              }
              @case ('parent') {
                <pre><code>// src/app/angular-garage.component.ts
&#64;Component(&#123;
  selector: 'app-angular-garage',
  standalone: true,
  imports: [VehicleCardComponent],
  template: &#96;
    &lt;div class=\"grid\"&gt;
      &#64;for (veh of vehicles; track veh.brand + veh.model) &#123;
        &lt;app-vehicle-card [car]=\"veh\" /&gt;
      &#125;
    &lt;/div&gt;
  &#96;
&#125;)
export class AngularGarageComponent &#123;
  // Assemblage modulaire des voitures au démarrage
  vehicles: Car[] = [
    new Car('Tesla', 'Model 3', '#3b82f6', new ElectricEngine()),
    new Car('Ford', 'Mustang GT', '#ef4444', new CombustionEngine(8)),
    new Car('Renault', 'Zoé', '#10b981', new ElectricEngine()),
    new Car('Porsche', '911 Carrera', '#f59e0b', new CombustionEngine(6))
  ];
&#125;</code></pre>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .module-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .module-header {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .module-tag {
        font-family: monospace;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #6366f1;
        margin-bottom: 0.5rem;
      }

      h2 {
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--text-heading);
        margin: 0 0 0.75rem 0;
      }

      .module-desc {
        color: var(--text-muted);
        line-height: 1.6;
        font-size: 0.95rem;
        margin: 0;

        code {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
      }
    }

    .section-mode-tabs {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      .mode-tab-btn {
        padding: 0.75rem 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--surface-card);
        color: var(--text-muted);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;

        &:hover {
          background: var(--surface-card-hover);
          color: var(--text-body);
        }

        &.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }
      }
    }

    .showroom-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .command-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface-card);
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;

      .left-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .btn-ctrl {
        padding: 0.55rem 1rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        border: none;
        transition: all 0.2s;

        &.btn-primary {
          background: #4f46e5;
          color: #ffffff;
          &:hover { background: #4338ca; }
        }

        &.btn-ghost {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          color: var(--text-body);
          &:hover { background: rgba(255, 255, 255, 0.15); }
        }
      }

      .fleet-stat {
        font-size: 0.85rem;
        color: var(--text-muted);

        strong {
          color: var(--text-heading);
        }
      }
    }

    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .pedagogical-summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;

      .p-card {
        background: var(--surface-card);
        border: 1px solid var(--border-color);
        border-radius: 0.75rem;
        padding: 1.25rem;
        position: relative;

        &.blue { border-top: 4px solid #3b82f6; }
        &.green { border-top: 4px solid #10b981; }
        &.purple { border-top: 4px solid #8b5cf6; }

        .p-num {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          font-size: 1.5rem;
          font-weight: 900;
          opacity: 0.2;
          font-family: monospace;
        }

        h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.05rem;
          color: var(--text-heading);
        }

        p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-muted);

          code {
            background: rgba(0, 0, 0, 0.1);
            padding: 0.1rem 0.3rem;
            border-radius: 0.25rem;
            font-family: monospace;
          }
        }
      }
    }

    .builder-wrapper {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.75rem;

      .builder-card {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        h3 {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text-heading);
        }

        .builder-subtitle {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;

          code {
            color: #818cf8;
            font-family: monospace;
          }
        }
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .form-input, .form-select {
          padding: 0.6rem 0.85rem;
          background: var(--surface-bg);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          color: var(--text-heading);
          font-size: 0.9rem;

          &:focus {
            outline: none;
            border-color: #4f46e5;
          }
        }

        .color-picker-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .color-swatch-input {
            width: 42px;
            height: 38px;
            border: none;
            border-radius: 0.4rem;
            cursor: pointer;
            background: transparent;
          }

          .color-val {
            font-family: monospace;
            font-size: 0.85rem;
            color: var(--text-heading);
          }
        }
      }
    }

    .live-code-preview {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 0.6rem;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;

      .preview-label {
        font-size: 0.7rem;
        color: #64748b;
        margin-bottom: 0.4rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      code {
        color: #38bdf8;
        font-size: 0.85rem;
      }
    }

    .builder-actions {
      display: flex;
      align-items: center;
      gap: 1rem;

      .btn-create {
        padding: 0.75rem 1.5rem;
        background: #10b981;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.9rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #059669;
        }
      }

      .success-msg {
        font-size: 0.85rem;
        font-weight: 600;
        color: #10b981;
      }
    }

    .code-explorer-wrapper {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      overflow: hidden;

      .code-file-tabs {
        display: flex;
        background: #0f172a;
        border-bottom: 1px solid #1e293b;
        overflow-x: auto;

        .file-tab {
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-family: monospace;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;

          &:hover {
            color: #e2e8f0;
          }

          &.active {
            color: #60a5fa;
            border-bottom-color: #3b82f6;
            background: rgba(255, 255, 255, 0.03);
          }
        }
      }

      .code-viewer-panel {
        background: #090d16;
        padding: 1.5rem;
        overflow-x: auto;

        pre {
          margin: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #e2e8f0;
        }
      }
    }
  `]
})
export class AngularGarageComponent {
  @ViewChildren('card') cards!: QueryList<VehicleCardComponent>;

  activeTab = signal<'showroom' | 'builder' | 'code'>('showroom');
  selectedFile = signal<'interface' | 'engines' | 'car' | 'component' | 'parent'>('interface');

  // Flotte de démonstration
  vehicles = signal<Car[]>([
    new Car('Tesla', 'Model 3', '#3b82f6', new ElectricEngine(), 2024),
    new Car('Ford', 'Mustang GT', '#ef4444', new CombustionEngine(8), 2023),
    new Car('Renault', 'Zoé E-Tech', '#10b981', new ElectricEngine(), 2024),
    new Car('Porsche', '911 Carrera GTS', '#f59e0b', new CombustionEngine(6), 2025),
    new Car('Toyota', 'Prius Prime', '#06b6d4', new HybridEngine('eco'), 2024),
    new Car('Alpine', 'Alpenglow HY4', '#8b5cf6', new HydrogenEngine(), 2025)
  ]);

  // État du Concepteur
  customBrand = 'Ferrari';
  customModel = '296 GTB';
  customColor = '#dc2626';
  customEngineType = 'v6';
  addSuccess = signal<boolean>(false);

  startAllCars(): void {
    this.cards?.forEach(card => card.onStartCar());
  }

  stopAllCars(): void {
    this.cards?.forEach(card => {
      card.isStarted.set(false);
      card.engineSound.set('Moteur à l’arrêt (Contact coupé)');
    });
  }

  onEngineChanged(veh: Car, engineType: string): void {
    // Permet de forcer la mise à jour réactive
    this.vehicles.update(list => [...list]);
  }

  getCustomEngineInstCode(): string {
    switch (this.customEngineType) {
      case 'electric': return 'new ElectricEngine()';
      case 'v6': return 'new CombustionEngine(6)';
      case 'v8': return 'new CombustionEngine(8)';
      case 'v12': return 'new CombustionEngine(12)';
      case 'hybrid-eco': return "new HybridEngine('eco')";
      case 'hybrid-sport': return "new HybridEngine('sport')";
      case 'hydrogen': return 'new HydrogenEngine()';
      default: return 'new ElectricEngine()';
    }
  }

  addCustomVehicle(): void {
    let engine: Engine;
    switch (this.customEngineType) {
      case 'electric': engine = new ElectricEngine(); break;
      case 'v6': engine = new CombustionEngine(6); break;
      case 'v8': engine = new CombustionEngine(8); break;
      case 'v12': engine = new CombustionEngine(12); break;
      case 'hybrid-eco': engine = new HybridEngine('eco'); break;
      case 'hybrid-sport': engine = new HybridEngine('sport'); break;
      case 'hydrogen': engine = new HydrogenEngine(); break;
      default: engine = new ElectricEngine();
    }

    const newCar = new Car(
      this.customBrand.trim() || 'Prototype',
      this.customModel.trim() || 'X-1',
      this.customColor,
      engine,
      2025
    );

    this.vehicles.update(list => [newCar, ...list]);
    this.addSuccess.set(true);
    setTimeout(() => this.addSuccess.set(false), 3000);
  }
}
