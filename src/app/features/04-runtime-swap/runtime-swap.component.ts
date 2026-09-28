import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface EngineConfig {
  id: string;
  name: string;
  powerCV: number;
  type: string;
  maxSpeedKmH: number;
  sound: string;
  color: string;
  badge: string;
}

@Component({
  selector: 'app-runtime-swap',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 04 · MUTABILITÉ TEMPORELLE</div>
        <h2>Le Super-pouvoir : Remplacement Dynamique à Chaud (Runtime Swap)</h2>
        <p class="module-desc">
          En orienté objet classique, l'héritage scelle le type de l'instance à la compilation. La composition offre un super-pouvoir révolutionnaire : <strong>permuter le collaborateur interne en plein vol</strong> sans jamais détruire ni réinstancier l'objet principal.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>⚡ Banc de Permutation Dynamique</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 2 · Remplacement Dynamique)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="card-panel swap-workbench">
          <!-- Zone Tableau de bord du véhicule actif -->
          <div class="dashboard-header">
            <div class="vehicle-identity">
              <span class="vehicle-icon">🏎️</span>
              <div>
                <div class="vehicle-title">Véhicule Modulable : <strong>CyberRoadster</strong></div>
                <div class="vehicle-specs">
                  Châssis ID: <code>#VIN-9084-CYBER</code> · Kilométrage: <code>{{ kilometrage() }} km</code> · Propriétaire: <code>Alex Dev</code>
                </div>
              </div>
            </div>

            <div class="swap-status-badge" [style.border-color]="currentEngine().color">
              <span class="pulse-dot" [style.background]="currentEngine().color"></span>
              <span>Moteur Actuel : <strong>{{ currentEngine().name }}</strong></span>
            </div>
          </div>

          <!-- Boutons de permutation à chaud -->
          <div class="swap-actions-bar">
            <span class="bar-label">Sélectionner un moteur à installer à chaud (Méthode de délégation) :</span>
            <div class="engines-buttons">
              @for (eng of availableEngines; track eng.id) {
                <button 
                  class="engine-select-btn" 
                  [class.active]="currentEngine().id === eng.id"
                  (click)="swapEngine(eng)"
                >
                  <span class="btn-badge" [style.background]="eng.color">{{ eng.badge }}</span>
                  <span class="btn-name">{{ eng.name }} ({{ eng.powerCV }} CV)</span>
                </button>
              }
            </div>
          </div>

          <!-- Banc d'essai & Visualisation du comportement -->
          <div class="test-bench-grid">
            <!-- Cadran de vitesse & puissance -->
            <div class="gauge-box">
              <div class="gauge-title">Télémétrie en temps réel :</div>
              <div class="speed-readout">
                <span class="speed-number" [style.color]="currentEngine().color">{{ currentSpeed() }}</span>
                <span class="speed-unit">km/h</span>
              </div>

              <!-- Jauge animée -->
              <div class="speed-track">
                <div 
                  class="speed-fill" 
                  [style.width.%]="(currentSpeed() / 320) * 100"
                  [style.background]="currentEngine().color"
                ></div>
              </div>
              <div class="speed-limits">
                <span>0 km/h</span>
                <span>Vitesse max : {{ currentEngine().maxSpeedKmH }} km/h</span>
                <span>320 km/h</span>
              </div>

              <div class="pedal-actions">
                <button class="btn-primary" (click)="accelerate()">
                  🔥 Appuyer sur l'Accélérateur
                </button>
                <button class="btn-secondary" (click)="brake()">
                  🛑 Freiner
                </button>
              </div>
            </div>

            <!-- Inspecteur du comportement sonore et de la délégation -->
            <div class="telemetry-box">
              <div class="box-title">Observation du comportement délégué :</div>

              <div class="sound-card">
                <div class="sound-label">🔊 Bruit émis par <code>this.moteur.demarrer()</code> :</div>
                <div class="sound-text" [style.color]="currentEngine().color">
                  « {{ currentEngine().sound }} »
                </div>
              </div>

              <div class="call-trace-card">
                <div class="trace-label">🔍 Trace de la méthode de swap exécutée :</div>
                <pre class="trace-code"><code>// Appel effectué sans recréer la voiture :
maVoiture.remplacerMoteur(new {{ currentEngine().type }}());
maVoiture.rouler();
// -> Délègue instantanément au nouveau moteur !</code></pre>
              </div>

              <div class="state-integrity-card">
                <div class="int-label">🛡️ État de l'objet hôte :</div>
                <div class="int-items">
                  <span class="int-pill">✓ Même référence mémoire en RAM</span>
                  <span class="int-pill">✓ Kilométrage préservé ({{ kilometrage() }} km)</span>
                  <span class="int-pill">✓ Zéro instanciation <code>new Voiture()</code></span>
                </div>
              </div>
            </div>
          </div>

          <!-- ENCADRÉ PÉDAGOGIQUE : LE MUR DE L'HÉRITAGE -->
          <div class="card-panel heritage-wall-box">
            <div class="wall-header">
              <span class="wall-icon">⛔</span>
              <h4>Pourquoi est-ce TOTALEMENT IMPOSSIBLE avec l'Héritage (extends) ?</h4>
            </div>
            <div class="wall-content">
              <p>
                Si vous aviez modélisé ce système avec l'héritage (<code>class VoitureEco extends Voiture</code> et <code>class VoitureSport extends Voiture</code>) :
              </p>
              <ul>
                <li>Une instance créée par <code>new VoitureEco()</code> a son prototype <strong>définitivement scellé en mémoire</strong> par le moteur JavaScript V8.</li>
                <li>Pour « passer en mode sport », vous auriez été obligé de <strong>détruire</strong> l'objet <code>VoitureEco</code>, d'instancier une nouvelle <code>new VoitureSport()</code>, et de recopier laborieusement chaque attribut (châssis, propriétaire, kilométrage, historique).</li>
                <li>Toutes les autres classes de votre application qui possédaient une référence vers l'ancienne voiture pointeraient désormais vers un objet mort (dangling reference) !</li>
              </ul>
              <div class="gof-reminder">
                💡 C'est la raison pour laquelle les jeux vidéo (systèmes d'armes ou d'armures) et les simulateurs industriels utilisent <strong>exclusivement la composition</strong> pour les pièces amovibles.
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .swap-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 16px 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .vehicle-identity {
      display: flex;
      align-items: center;
      gap: 14px;

      .vehicle-icon {
        font-size: 2.5rem;
      }

      .vehicle-title {
        font-size: 1.15rem;
        color: var(--text-main);
      }

      .vehicle-specs {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-top: 2px;

        code {
          color: var(--ts-blue-light);
        }
      }
    }

    .swap-status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-card);
      border: 2px solid #10b981;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
    }

    .swap-actions-bar {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .bar-label {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .engines-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .engine-select-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.2s;

      &:hover {
        border-color: var(--ts-blue);
        transform: translateY(-2px);
      }

      &.active {
        border-color: #10b981;
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        background: rgba(16, 185, 129, 0.08);
      }

      .btn-badge {
        font-size: 0.65rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        color: #ffffff;
      }
    }

    .test-bench-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;
    }

    .gauge-box, .telemetry-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .gauge-title, .box-title {
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .speed-readout {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 6px;

      .speed-number {
        font-size: 3.5rem;
        font-weight: 900;
        font-family: var(--font-mono);
        line-height: 1;
      }

      .speed-unit {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-dim);
      }
    }

    .speed-track {
      height: 10px;
      background: var(--bg-card);
      border-radius: 5px;
      overflow: hidden;

      .speed-fill {
        height: 100%;
        transition: width 0.3s ease;
      }
    }

    .speed-limits {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    .pedal-actions {
      display: flex;
      gap: 10px;

      button {
        flex: 1;
      }
    }

    .sound-card {
      background: var(--bg-card);
      border-radius: 6px;
      padding: 12px 14px;
      border: 1px solid var(--border-color);

      .sound-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 4px;
      }

      .sound-text {
        font-size: 1rem;
        font-weight: 700;
        font-family: var(--font-mono);
      }
    }

    .call-trace-card {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 12px 14px;
      border: 1px solid var(--border-color);

      .trace-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-dim);
        margin-bottom: 6px;
      }

      .trace-code {
        margin: 0;
        font-size: 0.78rem;
        color: #e2e8f0;
      }
    }

    .state-integrity-card {
      background: var(--bg-card);
      border-radius: 6px;
      padding: 12px 14px;
      border: 1px solid var(--border-color);

      .int-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 6px;
      }

      .int-items {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .int-pill {
        font-size: 0.72rem;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
      }
    }

    /* Le Mur de l'Héritage */
    .heritage-wall-box {
      background: rgba(239, 68, 68, 0.05);
      border-left: 4px solid #ef4444;

      .wall-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        .wall-icon {
          font-size: 1.4rem;
        }

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f87171;
        }
      }

      .wall-content {
        font-size: 0.88rem;
        line-height: 1.55;
        color: var(--text-muted);

        ul {
          margin: 10px 0 10px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gof-reminder {
          background: rgba(49, 120, 198, 0.12);
          color: #60a5fa;
          padding: 8px 12px;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 10px;
        }
      }
    }
  `]
})
export class RuntimeSwapComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly availableEngines: EngineConfig[] = [
    {
      id: 'eco-75',
      name: 'Moteur Éco 1.0L',
      powerCV: 75,
      type: 'MoteurEco',
      maxSpeedKmH: 140,
      sound: 'Tuf-tuf-tuf... 75 CV modeste mais frugal (4.1 L/100 km)',
      color: '#10b981',
      badge: 'ÉCO'
    },
    {
      id: 'sport-300',
      name: 'Moteur V8 Bi-Turbo',
      powerCV: 300,
      type: 'MoteurV8Sport',
      maxSpeedKmH: 280,
      sound: '🔥 VROOOOM ! Rugissement rauque du V8 300 CV !',
      color: '#ef4444',
      badge: 'SPORT'
    },
    {
      id: 'electric-200',
      name: 'Moteur Électrique Dual',
      powerCV: 200,
      type: 'MoteurElectrique',
      maxSpeedKmH: 210,
      sound: '⚡ Bzzzzz... Silence absolu, 100% couple instantané !',
      color: '#0ea5e9',
      badge: 'EV'
    }
  ];

  readonly currentEngine = signal<EngineConfig>(this.availableEngines[0]);
  readonly currentSpeed = signal<number>(0);
  readonly kilometrage = signal<number>(1420);

  swapEngine(engine: EngineConfig): void {
    this.currentEngine.set(engine);
    // Ajuster la vitesse si elle dépasse la vitesse max du nouveau moteur
    if (this.currentSpeed() > engine.maxSpeedKmH) {
      this.currentSpeed.set(engine.maxSpeedKmH);
    }
  }

  accelerate(): void {
    const max = this.currentEngine().maxSpeedKmH;
    this.currentSpeed.update(s => Math.min(s + 35, max));
    this.kilometrage.update(k => k + 5);
  }

  brake(): void {
    this.currentSpeed.update(s => Math.max(s - 45, 0));
  }
}
