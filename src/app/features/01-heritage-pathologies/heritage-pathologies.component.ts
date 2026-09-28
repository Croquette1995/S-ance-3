import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface VehicleOption {
  id: string;
  name: string;
  choiceA: string;
  choiceB: string;
  selectedChoice: string;
  active: boolean;
}

@Component({
  selector: 'app-heritage-pathologies',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 01 · LES LIMITES DU MODÈLE EXTENDS</div>
        <h2>Pourquoi l'Héritage ne suffit plus ? (Les 3 Pathologies)</h2>
        <p class="module-desc">
          L'héritage d'implémentation (<code>extends</code>) crée un couplage rigide et maximal entre classes. Dans les applications vivantes, ce couplage engendre trois pathologies majeures : <strong>l'explosion combinatoire</strong> des sous-classes, le syndrome de la <strong>classe de base fragile</strong>, et le piège du <strong>« gorille et de la banane »</strong>.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Les 3 Pathologies Visuelles</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1 · De l'Héritage à la Composition)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PATHOLOGIE 1 : EXPLOSION COMBINATOIRE -->
        <div class="card-panel pathology-card">
          <div class="card-title-row">
            <span class="patho-badge red">Pathologie 1</span>
            <h3>L'Explosion Combinatoire des Sous-Classes (2ᴺ Classes)</h3>
          </div>
          <p class="patho-intro">
            Lorsque l'on modélise un objet combinant plusieurs options orthogonales, l'héritage contraint à créer une classe pour chaque combinaison possible ($2^N$).
          </p>

          <div class="simulator-layout">
            <!-- Options à cocher -->
            <div class="options-controls">
              <div class="options-title">Options orthogonales du véhicule ($N$ = {{ activeOptionsCount() }}) :</div>
              @for (opt of options(); track opt.id) {
                <div class="option-row" [class.active]="opt.active">
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="opt.active" (change)="onOptionsChanged()">
                    <span class="opt-name">{{ opt.name }}</span>
                  </label>
                  @if (opt.active) {
                    <div class="choice-switch">
                      <button 
                        class="choice-btn" 
                        [class.selected]="opt.selectedChoice === opt.choiceA"
                        (click)="setChoice(opt.id, opt.choiceA)"
                      >
                        {{ opt.choiceA }}
                      </button>
                      <button 
                        class="choice-btn" 
                        [class.selected]="opt.selectedChoice === opt.choiceB"
                        (click)="setChoice(opt.id, opt.choiceB)"
                      >
                        {{ opt.choiceB }}
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Calcul & Comparaison Héritage vs Composition -->
            <div class="impact-comparison-box">
              <div class="math-banner">
                <div class="math-stat heritage">
                  <span class="stat-label">Classes requises avec extends :</span>
                  <span class="stat-value">{{ classesNeeded() }}</span>
                  <span class="stat-formula">Formule : 2<sup>{{ activeOptionsCount() }}</sup></span>
                </div>
                <div class="math-vs">VS</div>
                <div class="math-stat composition">
                  <span class="stat-label">Classe avec Composition :</span>
                  <span class="stat-value">1 SEULE</span>
                  <span class="stat-formula">1 classe Vehicule + modules injectés</span>
                </div>
              </div>

              <!-- Liste des classes générées avec l'héritage -->
              <div class="classes-list-box">
                <div class="list-title">Hiérarchie infernale générée avec l'héritage ({{ generatedClassNames().length }} classes) :</div>
                <div class="tags-cloud">
                  @for (name of generatedClassNames(); track name) {
                    <span class="class-tag">{{ name }}</span>
                  }
                </div>
              </div>

              <div class="composition-counterpart">
                <div class="solution-title">🛡️ La solution par Composition :</div>
                <pre class="code-preview"><code>// Une seule classe flexible pour toutes les combinaisons :
const monVehicule = new Vehicule(
  new {{ currentMotorisation() }}(),
  new {{ currentTransmission() }}(),
  {{ currentGps() }},
  {{ currentAutonomie() }}
);</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- PATHOLOGIE 2 : FRAGILE BASE CLASS -->
        <div class="card-panel pathology-card">
          <div class="card-title-row">
            <span class="patho-badge amber">Pathologie 2</span>
            <h3>Le Syndrome de la Classe de Base Fragile (Fragile Base Class)</h3>
          </div>
          <p class="patho-intro">
            L'héritage brise l'encapsulation : une modification en apparence inoffensive dans la classe mère modifie le comportement observable de la classe fille sans aucune erreur de compilation.
          </p>

          <div class="fragile-workbench">
            <div class="refactor-control-bar">
              <span class="ctrl-label">État du code de la classe mère <code>CompteBancaire</code> :</span>
              <button 
                class="btn-primary" 
                [class.refactored]="isMotherRefactored()"
                (click)="toggleMotherRefactor()"
              >
                {{ isMotherRefactored() ? '↩ Restaurer code initial' : '⚡ Refactoriser deposerPlusieurs() dans la classe mère' }}
              </button>
            </div>

            <div class="code-side-by-side">
              <!-- Classe mère -->
              <div class="code-column">
                <div class="col-header">
                  <span>Classe Mère : <code>CompteBancaire</code></span>
                  @if (isMotherRefactored()) {
                    <span class="badge badge-warning">Version Refactorisée</span>
                  } @else {
                    <span class="badge badge-ts">Version Initiale</span>
                  }
                </div>
                <pre class="code-block"><code>class CompteBancaire &#123;
  protected solde: number = 0;

  deposer(montant: number): void &#123;
    this.solde += montant;
  &#125;
@if (!isMotherRefactored()) {
  // Version initiale (modification directe) :
  deposerPlusieurs(montants: number[]): void &#123;
    for (const m of montants) &#123;
      this.solde += m;
    &#125;
  &#125;
} @else {
  // ⚠️ REFACTORISATION PAR LE DÉVELOPPEUR DU PARENT :
  // "Je factorise en réutilisant deposer() !"
  deposerPlusieurs(montants: number[]): void &#123;
    for (const m of montants) &#123;
      this.deposer(m); // Appelle la méthode surchargée !
    &#125;
  &#125;
}
&#125;</code></pre>
              </div>

              <!-- Classe fille -->
              <div class="code-column">
                <div class="col-header">
                  <span>Classe Fille : <code>CompteAvecJournal</code></span>
                  <span class="badge badge-purple">Surveille deposer()</span>
                </div>
                <pre class="code-block"><code>class CompteAvecJournal extends CompteBancaire &#123;
  public logs: string[] = [];

  override deposer(montant: number): void &#123;
    super.deposer(montant);
    this.logs.push('Dépôt: ' + montant + ' €');
  &#125;

  override deposerPlusieurs(montants: number[]): void &#123;
    super.deposerPlusieurs(montants);
    this.logs.push('Lot de ' + montants.length + ' dépôts validé');
  &#125;
&#125;</code></pre>
              </div>
            </div>

            <!-- Test en direct -->
            <div class="live-test-area">
              <div class="test-header">
                <span>Exécution de : <code>compte.deposerPlusieurs([100, 200]);</code></span>
                <button class="btn-secondary" (click)="runFragileTest()">▶ Exécuter l'opération</button>
              </div>

              <div class="logs-results" [class.corrupted]="isMotherRefactored()">
                <div class="results-title">
                  Journal d'activité produit (<code>compte.logs</code>) :
                  @if (isMotherRefactored()) {
                    <span class="status-pill error">❌ EFFET DE BORD : LOGS DUPLIQUÉS ET CORROMPUS !</span>
                  } @else {
                    <span class="status-pill success">✔ Logs attendus et cohérents</span>
                  }
                </div>
                <div class="log-entries">
                  @for (log of fragileLogs(); track $index) {
                    <div class="log-item" [class.unwanted]="isMotherRefactored() && log.startsWith('Dépôt:')">
                      <span class="log-bullet">{{ isMotherRefactored() && log.startsWith('Dépôt:') ? '⚠️ INTRUS :' : '•' }}</span>
                      <code>{{ log }}</code>
                    </div>
                  }
                </div>
                @if (isMotherRefactored()) {
                  <div class="alert-box danger">
                    <strong>💥 Pourquoi ce désastre silencieux ?</strong><br>
                    Le mainteneur de la classe mère pensait simplement faire une optimisation interne. Mais comme <code>CompteAvecJournal</code> avait surchargé <code>deposer()</code>, chaque élément du lot déclenche maintenant un log individuel imprévu en plus du log de lot ! L'encapsulation a été totalement perforée par <code>extends</code>.
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- PATHOLOGIE 3 : GORILLE ET BANANE -->
        <div class="card-panel pathology-card">
          <div class="card-title-row">
            <span class="patho-badge purple">Pathologie 3</span>
            <h3>Le « Gorille et la Banane » (Joe Armstrong)</h3>
          </div>
          <div class="quote-box">
            <blockquote>
              « Le problème avec les langages orientés objet classiques, c'est tout ce monde implicite qu'ils transportent avec eux. Vous vouliez une banane, mais ce que vous obtenez, c'est un gorille qui tient la banane, et toute la jungle qui va avec ! »
            </blockquote>
            <span class="quote-author">— Joe Armstrong, concepteur d'Erlang</span>
          </div>

          <div class="gorilla-workbench">
            <div class="view-switch-btns">
              <button 
                class="view-btn" 
                [class.active]="gorillaView() === 'inheritance'"
                (click)="gorillaView.set('inheritance')"
              >
                🦍 Approche Héritage (BaseEntity monolithique)
              </button>
              <button 
                class="view-btn" 
                [class.active]="gorillaView() === 'composition'"
                (click)="gorillaView.set('composition')"
              >
                🍌 Approche Composition (Briques ciblées)
              </button>
            </div>

            @if (gorillaView() === 'inheritance') {
              <div class="gorilla-diagram inheritance-view">
                <div class="entity-box mother">
                  <div class="box-title">🦍 BaseEntity (La Jungle Fourre-tout)</div>
                  <div class="deps-grid">
                    <span class="dep-pill heavy">Connexion PostgreSQL</span>
                    <span class="dep-pill heavy">Client SMTP Mailer</span>
                    <span class="dep-pill heavy">Générateur PDF Puppeteer</span>
                    <span class="dep-pill heavy">File SQS AWS</span>
                    <span class="dep-pill util">calculerTVA(total) 🍌</span>
                  </div>
                </div>

                <div class="arrow-down">
                  <span>▲ extends BaseEntity</span>
                </div>

                <div class="entity-box child">
                  <div class="box-title">📄 Facture</div>
                  <p class="child-text">
                    La classe <code>Facture</code> voulait juste la petite fonction <code>calculerTVA()</code>. Elle hérite désormais de 4 dépendances réseau lourdes, d'un constructeur hypercomplexe et d'une testabilité désastreuse.
                  </p>
                </div>
              </div>
            } @else {
              <div class="gorilla-diagram composition-view">
                <div class="clean-composition-grid">
                  <div class="comp-box">
                    <div class="comp-title">🍌 CalculateurTVA (Service dédié)</div>
                    <code>calculer(montant: number): number</code>
                  </div>
                  <div class="comp-box">
                    <div class="comp-title">📄 Facture (Classe composite)</div>
                    <pre><code>class Facture &#123;
  constructor(private tva: CalculateurTVA) &#123;&#125;
&#125;</code></pre>
                  </div>
                </div>
                <div class="alert-box success">
                  ✔ <strong>Zéro gorille, zéro jungle !</strong> Facture ne dépend que de la brique de calcul. Elle est testable en 1 milliseconde sans connexion base de données ni serveur SMTP.
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .pathology-card {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 12px;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .patho-badge {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;

      &.red { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
      &.amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
      &.purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
    }

    .patho-intro {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    /* Simulateur 2^N */
    .simulator-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 20px;
    }

    .options-controls {
      background: var(--bg-subtle);
      padding: 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .options-title {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .option-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.2s;

      &.active {
        border-color: rgba(16, 185, 129, 0.4);
      }

      .toggle-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 0.88rem;
        font-weight: 600;
      }
    }

    .choice-switch {
      display: flex;
      gap: 6px;

      .choice-btn {
        flex: 1;
        padding: 4px 8px;
        font-size: 0.75rem;
        border-radius: 4px;
        background: var(--bg-subtle);
        color: var(--text-muted);
        border: 1px solid var(--border-color);

        &.selected {
          background: #10b981;
          color: #ffffff;
          font-weight: 700;
          border-color: #059669;
        }
      }
    }

    .impact-comparison-box {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .math-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--bg-subtle);
      padding: 14px 20px;
      border-radius: 8px;
      justify-content: space-around;
    }

    .math-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .stat-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-dim);
      }
      .stat-value {
        font-size: 1.8rem;
        font-weight: 900;
        font-family: var(--font-mono);
      }
      .stat-formula {
        font-size: 0.7rem;
        color: var(--text-muted);
      }

      &.heritage .stat-value { color: #f87171; }
      &.composition .stat-value { color: #34d399; }
    }

    .math-vs {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-dim);
    }

    .classes-list-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      max-height: 160px;
      overflow-y: auto;

      .list-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 8px;
      }
    }

    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .class-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(239, 68, 68, 0.25);
    }

    .composition-counterpart {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 8px;
      padding: 14px;

      .solution-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: #34d399;
        margin-bottom: 6px;
      }

      .code-preview {
        margin: 0;
        font-size: 0.8rem;
        color: #e2e8f0;
      }
    }

    /* Fragile Base Class */
    .fragile-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .refactor-control-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--bg-subtle);
      padding: 12px 16px;
      border-radius: 8px;

      .ctrl-label {
        font-size: 0.88rem;
        font-weight: 600;
      }

      .btn-primary.refactored {
        background: #f59e0b;
      }
    }

    .code-side-by-side {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .code-column {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .col-header {
        background: var(--bg-subtle);
        padding: 8px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.82rem;
        font-weight: 600;
      }

      .code-block {
        padding: 12px 14px;
        margin: 0;
        font-size: 0.78rem;
        line-height: 1.45;
        color: #e2e8f0;
      }
    }

    .live-test-area {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .test-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        font-size: 0.88rem;
      }
    }

    .logs-results {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;

      &.corrupted {
        border-color: #ef4444;
      }

      .results-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .status-pill {
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 4px;

        &.success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        &.error { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      }
    }

    .log-entries {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: 0.82rem;

      .log-item {
        display: flex;
        gap: 8px;
        color: #cbd5e1;

        &.unwanted {
          color: #f87171;
          font-weight: 700;
        }
      }
    }

    .alert-box {
      padding: 12px;
      border-radius: 6px;
      font-size: 0.84rem;
      line-height: 1.4;
      margin-top: 10px;

      &.danger {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.35);
      }
      &.success {
        background: rgba(16, 185, 129, 0.15);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.35);
      }
    }

    /* Gorille et Banane */
    .quote-box {
      background: var(--bg-subtle);
      border-left: 4px solid var(--angular-purple);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;

      blockquote {
        font-style: italic;
        font-size: 0.92rem;
        color: var(--text-main);
      }

      .quote-author {
        display: block;
        margin-top: 6px;
        font-size: 0.78rem;
        font-weight: 700;
        color: #c084fc;
      }
    }

    .view-switch-btns {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .view-btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        background: var(--bg-subtle);
        color: var(--text-muted);
        border: 1px solid var(--border-color);

        &.active {
          background: var(--ts-blue);
          color: #ffffff;
          border-color: var(--ts-blue-hover);
        }
      }
    }

    .gorilla-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--bg-subtle);
      border-radius: 8px;
    }

    .entity-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 20px;
      width: 100%;
      max-width: 550px;

      .box-title {
        font-weight: 700;
        font-size: 0.95rem;
        margin-bottom: 10px;
      }

      &.mother {
        border-color: rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.05);
      }

      &.child {
        border-color: rgba(59, 130, 246, 0.4);
      }
    }

    .deps-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .dep-pill {
        font-size: 0.75rem;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: 600;

        &.heavy { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        &.util { background: rgba(16, 185, 129, 0.25); color: #34d399; font-weight: 800; }
      }
    }

    .arrow-down {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .clean-composition-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      width: 100%;
      max-width: 650px;

      .comp-box {
        background: var(--bg-card);
        border: 1px solid rgba(16, 185, 129, 0.35);
        border-radius: 8px;
        padding: 14px;

        .comp-title {
          font-weight: 700;
          font-size: 0.88rem;
          color: #34d399;
          margin-bottom: 8px;
        }
      }
    }
  `]
})
export class HeritagePathologiesComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Simulator 2^N
  readonly options = signal<VehicleOption[]>([
    { id: 'opt-motor', name: 'Motorisation', choiceA: 'Thermique', choiceB: 'Électrique', selectedChoice: 'Thermique', active: true },
    { id: 'opt-gear', name: 'Transmission', choiceA: 'Manuelle', choiceB: 'Automatique', selectedChoice: 'Manuelle', active: true },
    { id: 'opt-gps', name: 'Connectivité', choiceA: 'Standard', choiceB: 'Connectée (GPS)', selectedChoice: 'Connectée (GPS)', active: true },
    { id: 'opt-auto', name: 'Conduite', choiceA: 'Humaine', choiceB: 'Autonome', selectedChoice: 'Humaine', active: false }
  ]);

  readonly activeOptionsCount = computed(() => this.options().filter(o => o.active).length);
  readonly classesNeeded = computed(() => Math.pow(2, this.activeOptionsCount()));

  readonly currentMotorisation = computed(() => {
    const o = this.options().find(opt => opt.id === 'opt-motor');
    return o && o.active ? (o.selectedChoice === 'Thermique' ? 'MoteurThermique' : 'MoteurElectrique') : 'MoteurStandard';
  });

  readonly currentTransmission = computed(() => {
    const o = this.options().find(opt => opt.id === 'opt-gear');
    return o && o.active ? (o.selectedChoice === 'Manuelle' ? 'BoiteManuelle' : 'BoiteAutomatique') : 'BoiteStandard';
  });

  readonly currentGps = computed(() => {
    const o = this.options().find(opt => opt.id === 'opt-gps');
    return o && o.active && o.selectedChoice.includes('GPS') ? 'new ModuleGPS()' : 'null';
  });

  readonly currentAutonomie = computed(() => {
    const o = this.options().find(opt => opt.id === 'opt-auto');
    return o && o.active && o.selectedChoice === 'Autonome' ? 'new ModuleAutonome()' : 'null';
  });

  readonly generatedClassNames = computed(() => {
    const activeOpts = this.options().filter(o => o.active);
    if (activeOpts.length === 0) return ['VehiculeDeBase'];

    const combine = (index: number): string[] => {
      if (index === activeOpts.length) return ['Vehicule'];
      const opt = activeOpts[index];
      const rest = combine(index + 1);
      const res: string[] = [];
      const cleanA = opt.choiceA.replace(/[^a-zA-Z]/g, '');
      const cleanB = opt.choiceB.replace(/[^a-zA-Z]/g, '');
      for (const r of rest) {
        res.push(`${r}${cleanA}`);
        res.push(`${r}${cleanB}`);
      }
      return res;
    };

    return combine(0);
  });

  // Fragile Base Class
  readonly isMotherRefactored = signal<boolean>(false);
  readonly fragileLogs = signal<string[]>([
    'Lot de 2 dépôts validé'
  ]);

  // Gorilla & Banana
  readonly gorillaView = signal<'inheritance' | 'composition'>('inheritance');

  onOptionsChanged(): void {
    // Computed automatically recalculates
  }

  setChoice(optionId: string, choice: string): void {
    this.options.update(list => list.map(o => o.id === optionId ? { ...o, selectedChoice: choice } : o));
  }

  toggleMotherRefactor(): void {
    this.isMotherRefactored.update(v => !v);
    this.runFragileTest();
  }

  runFragileTest(): void {
    if (this.isMotherRefactored()) {
      this.fragileLogs.set([
        'Dépôt: 100 €',
        'Dépôt: 200 €',
        'Lot de 2 dépôts validé'
      ]);
    } else {
      this.fragileLogs.set([
        'Lot de 2 dépôts validé'
      ]);
    }
  }
}
