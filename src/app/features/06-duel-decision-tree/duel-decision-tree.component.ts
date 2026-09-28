import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface CriterionRow {
  name: string;
  heritage: string;
  composition: string;
  heritageScore: 'bad' | 'neutral' | 'good';
  compositionScore: 'bad' | 'neutral' | 'good';
}

@Component({
  selector: 'app-duel-decision-tree',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 06 · STRATÉGIE DE CONCEPTION</div>
        <h2>Le Duel &amp; L'Arbre de Décision Interactif</h2>
        <p class="module-desc">
          Comment trancher avec certitude face à un problème d'architecture ? Voici la grille d'évaluation comparative à 8 critères et l'arbre de décision méthodologique pour ne plus jamais hésiter entre <code>extends</code> et <code>has-a</code>.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>⚖️ Tableau Comparatif &amp; Arbre Décisionnel</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 4 · Testabilité &amp; Mocking)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- LA RÈGLE D'OR EN MAJESTÉ -->
        <div class="card-panel golden-rule-card">
          <div class="rule-icon">👑</div>
          <div class="rule-body">
            <div class="rule-tag">LA RÈGLE D'OR DE LA CONCEPTION ORIENTÉE OBJET</div>
            <h3 class="rule-quote">« Composez ce que vos objets FONT, Héritez uniquement de ce que vos objets SONT. »</h3>
            <p class="gof-reference">
              Maxime du <strong>Gang of Four (1994)</strong> : <em>« Favor object composition over class inheritance »</em> — Préférer systématiquement la composition d'objets à l'héritage de classes.
            </p>
          </div>
        </div>

        <!-- TABLEAU COMPARATIF À 8 CRITÈRES -->
        <div class="card-panel table-card">
          <div class="table-header">
            <h3>Le Duel en 8 Critères d'Ingénierie</h3>
            <span class="badge badge-ts">Synthèse Comparative</span>
          </div>

          <div class="comparison-table-wrapper">
            <table class="duel-table">
              <thead>
                <tr>
                  <th class="col-crit">Critère d'Ingénierie</th>
                  <th class="col-her">Héritage (<code>extends</code>)</th>
                  <th class="col-comp">Composition (<code>has-a</code>)</th>
                </tr>
              </thead>
              <tbody>
                @for (row of criteria; track row.name) {
                  <tr>
                    <td class="cell-crit">
                      <strong>{{ row.name }}</strong>
                    </td>
                    <td class="cell-her" [class]="'score-' + row.heritageScore">
                      {{ row.heritage }}
                    </td>
                    <td class="cell-comp" [class]="'score-' + row.compositionScore">
                      {{ row.composition }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- ARBRE DE DÉCISION PAS-À-PAS -->
        <div class="card-panel tree-card">
          <div class="tree-header">
            <div>
              <h3>Logigramme Décisionnel Pas-à-Pas</h3>
              <p class="tree-sub">Répondez aux questions pour trouver la recommandation architecturale adaptée à votre besoin :</p>
            </div>
            <button class="btn-secondary" (click)="resetTree()">↺ Recommencer le diagnostic</button>
          </div>

          <div class="tree-workbench">
            <!-- Questions successives -->
            <div class="questions-trail">
              <!-- Q1 -->
              <div class="step-card" [class.active]="step() === 1" [class.passed]="step() > 1">
                <div class="step-num">Q1</div>
                <div class="step-content">
                  <div class="step-q">S'agit-il d'une véritable relation ontologique « est-un » ?</div>
                  <div class="step-hint">Ex: Le Chien EST fondamentalement un Animal (essence biologique ou mathématique irréductible).</div>
                  @if (step() === 1) {
                    <div class="step-btns">
                      <button class="btn-primary" (click)="answerQ1(true)">✔ OUI, identité indiscutable</button>
                      <button class="btn-secondary" (click)="answerQ1(false)">❌ NON, c'est juste un rôle ou une pièce</button>
                    </div>
                  } @else {
                    <div class="answered-tag">Réponse : <strong>{{ q1Answer() ? 'OUI' : 'NON' }}</strong></div>
                  }
                </div>
              </div>

              <!-- Q2 -->
              @if (step() >= 2) {
                <div class="step-card" [class.active]="step() === 2" [class.passed]="step() > 2">
                  <div class="step-num">Q2</div>
                  <div class="step-content">
                    <div class="step-q">Le comportement doit-il pouvoir varier ou être remplacé à l'exécution ?</div>
                    <div class="step-hint">Ex: Changer d'arme en jeu, basculer vers un serveur de secours, changer de moteur.</div>
                    @if (step() === 2) {
                      <div class="step-btns">
                        <button class="btn-primary" (click)="answerQ2(true)">✔ OUI, besoin de Runtime Swap</button>
                        <button class="btn-secondary" (click)="answerQ2(false)">❌ NON, immuable après compilation</button>
                      </div>
                    } @else {
                      <div class="answered-tag">Réponse : <strong>{{ q2Answer() ? 'OUI' : 'NON' }}</strong></div>
                    }
                  </div>
                </div>
              }

              <!-- Q3 -->
              @if (step() >= 3) {
                <div class="step-card" [class.active]="step() === 3" [class.passed]="step() > 3">
                  <div class="step-num">Q3</div>
                  <div class="step-content">
                    <div class="step-q">Avez-vous plusieurs caractéristiques indépendantes à combiner (orthogonales) ?</div>
                    <div class="step-hint">Ex: Motorisation + Boîte de vitesses + Connectivité + Pilotage.</div>
                    @if (step() === 3) {
                      <div class="step-btns">
                        <button class="btn-primary" (click)="answerQ3(true)">✔ OUI, plusieurs axes orthogonaux</button>
                        <button class="btn-secondary" (click)="answerQ3(false)">❌ NON, un seul axe simple</button>
                      </div>
                    } @else {
                      <div class="answered-tag">Réponse : <strong>{{ q3Answer() ? 'OUI' : 'NON' }}</strong></div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Résultat & Recommandation finale -->
            @if (step() >= 4) {
              <div class="verdict-box" [class]="verdictClass()">
                <div class="verdict-badge">{{ verdictBadge() }}</div>
                <h4 class="verdict-title">{{ verdictTitle() }}</h4>
                <p class="verdict-desc">{{ verdictDescription() }}</p>
                <div class="verdict-advice">
                  <strong>💡 Recommandation de code :</strong> {{ verdictCodeTip() }}
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .golden-rule-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1));
      border: 2px solid rgba(16, 185, 129, 0.4);
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 24px;
      padding: 24px 28px;

      .rule-icon {
        font-size: 3rem;
      }

      .rule-tag {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #34d399;
        margin-bottom: 4px;
      }

      .rule-quote {
        font-size: 1.35rem;
        font-weight: 900;
        color: var(--text-main);
        line-height: 1.35;
      }

      .gof-reference {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 6px;
      }
    }

    .table-card, .tree-card {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .table-header, .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .tree-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 2px;
      }
    }

    /* Duel Table */
    .comparison-table-wrapper {
      overflow-x: auto;
    }

    .duel-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;

      th {
        background: var(--bg-subtle);
        padding: 12px 16px;
        text-align: left;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
        font-size: 0.75rem;
        border-bottom: 2px solid var(--border-color);
      }

      td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color);
        line-height: 1.45;
      }

      .cell-crit {
        color: var(--text-main);
        width: 22%;
      }

      .cell-her {
        width: 39%;
        color: var(--text-muted);

        &.score-bad { background: rgba(239, 68, 68, 0.04); color: #fca5a5; }
        &.score-good { background: rgba(16, 185, 129, 0.04); color: #86efac; }
      }

      .cell-comp {
        width: 39%;
        color: var(--text-muted);

        &.score-good { background: rgba(16, 185, 129, 0.08); color: #6ee7b7; font-weight: 600; }
        &.score-bad { background: rgba(239, 68, 68, 0.04); color: #fca5a5; }
      }
    }

    /* Tree */
    .tree-workbench {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
    }

    .questions-trail {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .step-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      transition: all 0.2s;

      &.active {
        border-color: #3b82f6;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
      }

      &.passed {
        opacity: 0.85;
      }

      .step-num {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--ts-blue-light);
        font-weight: 800;
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: 6px;
      }

      .step-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .step-q {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .step-hint {
        font-size: 0.78rem;
        color: var(--text-muted);
      }

      .step-btns {
        display: flex;
        gap: 10px;
        margin-top: 8px;
      }

      .answered-tag {
        font-size: 0.8rem;
        color: var(--ts-blue-light);
      }
    }

    .verdict-box {
      border-radius: 10px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: fit-content;

      &.verdict-comp {
        background: rgba(16, 185, 129, 0.12);
        border: 2px solid #10b981;
      }

      &.verdict-her {
        background: rgba(59, 130, 246, 0.12);
        border: 2px solid #3b82f6;
      }

      &.verdict-inter {
        background: rgba(168, 85, 247, 0.12);
        border: 2px solid #a855f7;
      }

      .verdict-badge {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .verdict-title {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .verdict-desc {
        font-size: 0.88rem;
        line-height: 1.5;
        color: var(--text-muted);
      }

      .verdict-advice {
        background: var(--bg-card);
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: var(--text-main);
        border: 1px solid var(--border-color);
      }
    }
  `]
})
export class DuelDecisionTreeComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly criteria: CriterionRow[] = [
    {
      name: '1. Relation Sémantique',
      heritage: '« Est-un » (Filiation taxonomique stricte)',
      composition: '« A-un » (Assemblage de modules)',
      heritageScore: 'neutral',
      compositionScore: 'good'
    },
    {
      name: '2. Liaison Temporelle',
      heritage: 'Statique (scellée à la compilation)',
      composition: 'Dynamique (modifiable à chaud au runtime)',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '3. Niveau de Couplage',
      heritage: 'Fort (l\'enfant dépend de chaque ligne du parent)',
      composition: 'Faible / Lâche (dépendance par interface)',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '4. Encapsulation',
      heritage: 'Brisée (White-Box Reuse, accès protected)',
      composition: 'Respectée (Black-Box Reuse hermétique)',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '5. Multiplicité',
      heritage: 'Un seul parent direct (héritage simple TS)',
      composition: 'Multiplicité illimitée (N composants)',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '6. Risque Combinatoire',
      heritage: 'Élevé : explosion exponentielle en 2ᴺ sous-classes',
      composition: 'Nul : combinaisons libres à l\'instanciation',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '7. Testabilité Unitaire',
      heritage: 'Difficile : chaîne lourde de constructeurs super()',
      composition: 'Triviale : injection d\'un Mock en 3 lignes',
      heritageScore: 'bad',
      compositionScore: 'good'
    },
    {
      name: '8. Cas d\'Usage Idéal',
      heritage: 'Taxonomie naturelle courte (ex: Cercle est une Forme)',
      composition: 'Fonctionnalités transversales, services, rôles',
      heritageScore: 'neutral',
      compositionScore: 'good'
    }
  ];

  readonly step = signal<number>(1);
  readonly q1Answer = signal<boolean | null>(null);
  readonly q2Answer = signal<boolean | null>(null);
  readonly q3Answer = signal<boolean | null>(null);

  answerQ1(isA: boolean): void {
    this.q1Answer.set(isA);
    if (!isA) {
      // Non -> Directement Composition
      this.step.set(4);
    } else {
      this.step.set(2);
    }
  }

  answerQ2(swapNeeded: boolean): void {
    this.q2Answer.set(swapNeeded);
    if (swapNeeded) {
      // Besoin de swap -> Composition impérative
      this.step.set(4);
    } else {
      this.step.set(3);
    }
  }

  answerQ3(orthogonal: boolean): void {
    this.q3Answer.set(orthogonal);
    this.step.set(4);
  }

  resetTree(): void {
    this.step.set(1);
    this.q1Answer.set(null);
    this.q2Answer.set(null);
    this.q3Answer.set(null);
  }

  verdictClass(): string {
    if (this.q1Answer() === false || this.q2Answer() === true || this.q3Answer() === true) {
      return 'verdict-comp';
    }
    return 'verdict-her';
  }

  verdictBadge(): string {
    if (this.q1Answer() === false || this.q2Answer() === true || this.q3Answer() === true) {
      return 'RECOMMANDATION OFFICIELLE : COMPOSITION';
    }
    return 'RECOMMANDATION OFFICIELLE : HÉRITAGE LÉGITIME';
  }

  verdictTitle(): string {
    if (this.q1Answer() === false || this.q2Answer() === true || this.q3Answer() === true) {
      return 'Utilisez la Composition (Lien « A-un »)';
    }
    return 'Héritage Légitime Accepté (Lien « Est-un »)';
  }

  verdictDescription(): string {
    if (this.q1Answer() === false) {
      return 'La relation ne relève pas d\'une essence ontologique irréductible. Faire hériter ces classes créerait une fausse taxonomie et violerait le principe de substitution de Liskov.';
    }
    if (this.q2Answer() === true) {
      return 'Le comportement doit varier à l\'exécution (Runtime Swap). L\'héritage ne permet pas de changer le type d\'une instance en mémoire une fois créée. Seule la composition par attribut mutable le permet.';
    }
    if (this.q3Answer() === true) {
      return 'Vous avez plusieurs axes de variation orthogonaux. L\'héritage provoquerait une explosion combinatoire en 2ᴺ sous-classes ingérables. Composez les modules par constructeur.';
    }
    return 'Tous les voyants sont au vert pour un héritage modéré : c\'est une vraie relation taxonomique, le comportement est immuable à l\'exécution, et la hiérarchie demeure courte (1 à 2 niveaux maximum).';
  }

  verdictCodeTip(): string {
    if (this.q1Answer() === false || this.q2Answer() === true || this.q3Answer() === true) {
      return 'constructor(private composant: MonInterface) {} et déléguez les actions.';
    }
    return 'export class Chien extends Animal {} avec appel super() dans le constructeur.';
  }
}
