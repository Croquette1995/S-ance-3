import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-dip-interfaces',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 05 · SOLID : INVERSION DES DÉPENDANCES</div>
        <h2>Découplage par l'Interface &amp; Inversion des Dépendances (DIP)</h2>
        <p class="module-desc">
          Assembler des objets ne suffit pas : si une classe fait <code>new MoteurThermique()</code> en dur dans son constructeur, le couplage reste maximal. La véritable puissance émerge lorsqu'on combine composition et <strong>interfaces</strong> : la classe dépend d'un contrat abstrait, autorisant le polymorphisme pur et l'injection de Mocks pour les tests.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🧩 DIP, Polymorphisme &amp; Studio de Mocking</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labos 3 &amp; 4 · DIP &amp; Mocking)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- COMPARATEUR MAUVAISE VS BONNE COMPOSITION -->
        <div class="card-panel comp-compare-card">
          <div class="comp-title-row">
            <h3>Mauvaise vs Bonne Composition : Le Piège du « new » Caché</h3>
            <span class="badge badge-warning">Règle de Clean Architecture</span>
          </div>

          <div class="compare-grid">
            <!-- Mauvaise Composition -->
            <div class="compare-box bad">
              <div class="box-badge red">❌ MAUVAISE COMPOSITION (COUPLAGE FORT CACHÉ)</div>
              <h4>Instanciation en dur avec new</h4>
              <p class="desc">La classe semble modulaire, mais elle s'enferme elle-même dans une dépendance concrète.</p>

              <pre class="code-box"><code>class Voiture &#123;
  private moteur: MoteurEssence;

  constructor() &#123;
    // ⚠️ COUPLAGE RIGIDE :
    // Impossible d'injecter un moteur électrique ou un faux moteur de test !
    this.moteur = new MoteurEssence(120);
  &#125;
&#125;</code></pre>

              <div class="consequence-box red">
                <strong>Verdict :</strong> Mariée à vie avec <code>MoteurEssence</code>. Impossible à tester unitairement de manière isolée.
              </div>
            </div>

            <!-- Bonne Composition -->
            <div class="compare-box good">
              <div class="box-badge green">✔ BONNE COMPOSITION (COUPLAGE LÂCHE VIA DIP)</div>
              <h4>Injection d'une Interface</h4>
              <p class="desc">La classe ne dépend que du contrat d'abstraction. L'extérieur lui fournit l'instance concrète.</p>

              <pre class="code-box"><code>interface Engine &#123;
  start(): string;
&#125;

class Voiture &#123;
  // 🛡️ DÉPENDANCE PAR LE CONTRAT :
  // Accepte n'importe quelle implémentation d'Engine !
  constructor(private moteur: Engine) &#123;&#125;
&#125;</code></pre>

              <div class="consequence-box green">
                <strong>Verdict :</strong> Totale interchangeabilité à chaud, polymorphisme sans héritage et injection de Mocks instantanée.
              </div>
            </div>
          </div>
        </div>

        <!-- POLYMORPHISME SANS HÉRITAGE -->
        <div class="card-panel poly-card">
          <div class="poly-header">
            <div>
              <h3>Polymorphisme sans Héritage</h3>
              <p class="poly-sub">Deux classes sans aucun lien de parenté peuvent se substituer mutuellement grâce à l'interface commune.</p>
            </div>
            <div class="engine-switch">
              <button 
                class="switch-btn" 
                [class.active]="selectedPolyEngine() === 'combustion'"
                (click)="selectedPolyEngine.set('combustion')"
              >
                🔥 CombustionEngine
              </button>
              <button 
                class="switch-btn" 
                [class.active]="selectedPolyEngine() === 'electric'"
                (click)="selectedPolyEngine.set('electric')"
              >
                ⚡ ElectricEngine
              </button>
            </div>
          </div>

          <div class="poly-workbench">
            <div class="poly-code">
              <pre><code>// Contrat commun :
interface Engine &#123; start(): string; &#125;

@if (selectedPolyEngine() === 'combustion') {
// Implémentation 1 :
class CombustionEngine implements Engine &#123;
  start(): string &#123; return "🔥 Vroum ! 4 cylindres essence"; &#125;
&#125;
const voiture = new Voiture(new CombustionEngine());
} @else {
// Implémentation 2 :
class ElectricEngine implements Engine &#123;
  start(): string &#123; return "⚡ Bzzzz ! 100% couple électrique"; &#125;
&#125;
const voiture = new Voiture(new ElectricEngine());
}

console.log(voiture.conduire());
// Sortie : "{{ polyOutput() }}"</code></pre>
            </div>

            <div class="poly-info">
              <div class="info-badge">ZÉRO MOT-CLÉ EXTENDS EMPLOYÉ</div>
              <p>
                Remarquez l'absence totale de classe mère <code>MoteurDeBase</code>. En TypeScript, le typage structurel et les interfaces pures garantissent que <code>ElectricEngine</code> et <code>CombustionEngine</code> sont traitées comme compatibles sans nécessiter d'ancêtre commun.
              </p>
            </div>
          </div>
        </div>

        <!-- STUDIO DE TEST UNITAIRE & MOCKING -->
        <div class="card-panel test-studio-card">
          <div class="studio-header">
            <div>
              <h3>Studio de Test Unitaire &amp; Mocking</h3>
              <p class="studio-sub">Observez pourquoi l'injection d'interfaces est le pilier n°1 de la testabilité logicielle en entreprise.</p>
            </div>
            <div class="mock-toggle">
              <button 
                class="toggle-choice" 
                [class.selected]="mockChoice() === 'real'"
                (click)="setMockChoice('real')"
              >
                🌐 Moteur Réel (Matériel / Réseau)
              </button>
              <button 
                class="toggle-choice" 
                [class.selected]="mockChoice() === 'mock'"
                (click)="setMockChoice('mock')"
              >
                🧪 MockMoteur (Doublure de test)
              </button>
            </div>
          </div>

          <div class="studio-grid">
            <div class="test-config-box">
              <div class="conf-title">Composant injecté dans VoitureTest :</div>
              <div class="conf-desc">
                @if (mockChoice() === 'real') {
                  <div class="alert-box danger">
                    ⚠️ <strong>Vrai Moteur Physique :</strong> Contacte l'ECU par bus CAN, consomme du carburant réel, attend le préchauffage (latence 2.4s). En test automatisé, cela rend la suite lente et fragile.
                  </div>
                } @else {
                  <div class="alert-box success">
                    ✔ <strong>MockMoteur Léger :</strong> Fausse classe de 4 lignes en mémoire. Retourne immédiatement <code>"TEST_OK"</code>, zéro latence, exécution déterministe en 2 ms.
                  </div>
                }
              </div>

              <button class="btn-primary run-test-btn" (click)="runUnitTest()">
                🚀 Exécuter le Test Unitaire (console.assert)
              </button>
            </div>

            <!-- Console de résultat du test unitaire -->
            <div class="test-console-box">
              <div class="console-top">
                <span>RÉSULTAT DE L'ASSERTION :</span>
                @if (testExecuted()) {
                  <span class="status-tag" [class.success]="testPassed()" [class.error]="!testPassed()">
                    {{ testPassed() ? '✔ TEST PASSÉ (2 ms)' : '⚠️ TEST LENT (2400 ms)' }}
                  </span>
                }
              </div>

              <div class="console-body">
                @if (!testExecuted()) {
                  <div class="empty-hint">Cliquez sur « Exécuter le Test Unitaire » pour tester le panier.</div>
                } @else {
                  <div class="test-logs-list">
                    <div class="t-log"><code>> Injection de {{ mockChoice() === 'real' ? 'VraiMoteurPhysique' : 'MockMoteur' }}</code></div>
                    <div class="t-log"><code>> const v = new Voiture(moteur);</code></div>
                    <div class="t-log"><code>> const res = v.conduire();</code></div>
                    <div class="t-log" [class.pass]="testPassed()" [class.slow]="!testPassed()">
                      <code>> console.assert(res.includes("TEST_OK")); // {{ testPassed() ? 'SUCCÈS' : 'ALERTE LATENCE' }}</code>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="3"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .comp-compare-card, .poly-card, .test-studio-card {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comp-title-row, .poly-header, .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .poly-sub, .studio-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 2px;
      }
    }

    .compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .compare-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.bad { border-top: 4px solid #ef4444; }
      &.good { border-top: 4px solid #10b981; }

      .box-badge {
        font-size: 0.72rem;
        font-weight: 800;
        &.red { color: #f87171; }
        &.green { color: #34d399; }
      }

      h4 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .desc {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 12px;
      margin: 0;

      code {
        font-size: 0.78rem;
        color: #e2e8f0;
        line-height: 1.45;
      }
    }

    .consequence-box {
      font-size: 0.8rem;
      padding: 10px 12px;
      border-radius: 6px;
      line-height: 1.4;

      &.red {
        background: rgba(239, 68, 68, 0.12);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.25);
      }
      &.green {
        background: rgba(16, 185, 129, 0.12);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.25);
      }
    }

    /* Polymorphisme */
    .engine-switch {
      display: flex;
      gap: 8px;

      .switch-btn {
        padding: 6px 14px;
        background: var(--bg-subtle);
        color: var(--text-muted);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 600;

        &.active {
          background: var(--ts-blue);
          color: #ffffff;
        }
      }
    }

    .poly-workbench {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 20px;
    }

    .poly-code {
      background: var(--bg-code);
      border-radius: 8px;
      padding: 14px;

      pre {
        margin: 0;
        font-size: 0.8rem;
        color: #e2e8f0;
        line-height: 1.45;
      }
    }

    .poly-info {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .info-badge {
        font-size: 0.72rem;
        font-weight: 800;
        color: #10b981;
        letter-spacing: 0.05em;
      }

      p {
        font-size: 0.84rem;
        line-height: 1.5;
        color: var(--text-muted);
      }
    }

    /* Studio de Test */
    .mock-toggle {
      display: flex;
      gap: 8px;

      .toggle-choice {
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 600;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-muted);

        &.selected {
          background: #10b981;
          color: #ffffff;
          border-color: #059669;
        }
      }
    }

    .studio-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .test-config-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .conf-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }
    }

    .run-test-btn {
      margin-top: auto;
    }

    .test-console-box {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .console-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .status-tag {
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 4px;

        &.success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        &.error { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
      }
    }

    .console-body {
      flex: 1;
      font-family: var(--font-mono);
      font-size: 0.78rem;

      .empty-hint {
        color: var(--text-dim);
        padding: 20px 0;
        text-align: center;
      }

      .test-logs-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .t-log {
        color: #cbd5e1;

        &.pass { color: #34d399; font-weight: 700; }
        &.slow { color: #fbbf24; }
      }
    }
  `]
})
export class DipInterfacesComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly selectedPolyEngine = signal<'combustion' | 'electric'>('combustion');

  readonly mockChoice = signal<'real' | 'mock'>('mock');
  readonly testExecuted = signal<boolean>(false);
  readonly testPassed = signal<boolean>(false);

  polyOutput(): string {
    return this.selectedPolyEngine() === 'combustion'
      ? '🔥 Vroum ! 4 cylindres essence'
      : '⚡ Bzzzz ! 100% couple électrique';
  }

  setMockChoice(choice: 'real' | 'mock'): void {
    this.mockChoice.set(choice);
    this.testExecuted.set(false);
  }

  runUnitTest(): void {
    this.testExecuted.set(true);
    this.testPassed.set(this.mockChoice() === 'mock');
  }
}
