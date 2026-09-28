import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { QuizQuestion } from '../../core/models/app.models';

@Component({
  selector: 'app-semantic-pillars',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 02 · DISCERNEMENT RELATIONNEL</div>
        <h2>Les Piliers Sémantiques : « Est-un » (Is-a) vs « A-un » (Has-a)</h2>
        <p class="module-desc">
          Avant d'écrire la moindre ligne de code, le premier réflexe de l'ingénieur logiciel consiste à poser le bon diagnostic conceptuel : s'agit-il d'une relation taxonomique de filiation (<strong>est-un</strong>) ou d'un assemblage modulaire de collaborateurs (<strong>a-un</strong>) ?
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>📐 Comparateur UML &amp; Quiz de Diagnostic</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- COMPARATEUR UML DYNAMIQUE -->
        <div class="card-panel uml-comparator-card">
          <div class="comp-header">
            <h3>Comparateur Conceptuel &amp; Notations UML</h3>
            <span class="badge badge-ts">Fondation Architectural</span>
          </div>

          <div class="uml-grid">
            <!-- Colonne EST-UN (Héritage) -->
            <div class="pillar-column is-a-col">
              <div class="pillar-header">
                <div class="pillar-badge is-a-badge">RELATION « EST-UN » (IS-A)</div>
                <h4>Héritage de Spécialisation</h4>
                <div class="keyword-pill">Mot-clé : <code>extends</code></div>
              </div>

              <!-- Diagramme UML stylisé -->
              <div class="uml-diagram-box">
                <div class="uml-class parent">
                  <span class="c-name">Animal / Forme</span>
                  <span class="c-member">+ respirer() / + surface()</span>
                </div>
                <div class="uml-arrow-is-a">
                  <span class="triangle">▲</span>
                  <div class="stem"></div>
                </div>
                <div class="uml-class child">
                  <span class="c-name">Chien / Cercle</span>
                  <span class="c-member">+ aboyer() / + rayon</span>
                </div>
              </div>

              <div class="properties-list">
                <div class="prop-item">
                  <span class="prop-icon">🔒</span>
                  <div class="prop-text">
                    <strong>Liaison Statique :</strong> Le lien est scellé à la compilation. Un <code>Chien</code> ne peut jamais devenir un <code>Oiseau</code> en cours d'exécution.
                  </div>
                </div>
                <div class="prop-item">
                  <span class="prop-icon">📐</span>
                  <div class="prop-text">
                    <strong>Substituabilité (Liskov - LSP) :</strong> Tout ce qui est vrai pour le parent <em>doit</em> être vrai pour l'enfant sans exception.
                  </div>
                </div>
                <div class="prop-item">
                  <span class="prop-icon">1️⃣</span>
                  <div class="prop-text">
                    <strong>Arbre Unique :</strong> TypeScript impose l'héritage simple. Une classe ne peut avoir qu'un seul parent direct.
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne A-UN (Composition) -->
            <div class="pillar-column has-a-col">
              <div class="pillar-header">
                <div class="pillar-badge has-a-badge">RELATION « A-UN » (HAS-A)</div>
                <h4>Assemblage de Collaborateurs</h4>
                <div class="keyword-pill green">Attribut privé : <code>private composant</code></div>
              </div>

              <!-- Diagramme UML stylisé -->
              <div class="uml-diagram-box">
                <div class="uml-class composite">
                  <span class="c-name">Voiture / Ordinateur</span>
                  <span class="c-member">- moteur: Moteur / - cpu: Processeur</span>
                </div>
                <div class="uml-arrow-has-a">
                  <div class="stem"></div>
                  <span class="diamond">◆</span>
                </div>
                <div class="uml-class component">
                  <span class="c-name">Moteur / Processeur</span>
                  <span class="c-member">+ demarrer() / + calculer()</span>
                </div>
              </div>

              <div class="properties-list">
                <div class="prop-item">
                  <span class="prop-icon">⚡</span>
                  <div class="prop-text">
                    <strong>Liaison Dynamique :</strong> Le composant interne peut être remplacé à chaud à l'exécution (Runtime Swap).
                  </div>
                </div>
                <div class="prop-item">
                  <span class="prop-icon">📦</span>
                  <div class="prop-text">
                    <strong>Boîte Noire (Black-Box Reuse) :</strong> La classe principale ignore le code interne du composant ; elle dialogue par son API publique.
                  </div>
                </div>
                <div class="prop-item">
                  <span class="prop-icon">♾️</span>
                  <div class="prop-text">
                    <strong>Multiplicité Illimitée :</strong> Une classe peut agréger autant de composants distincts qu'elle le désire (Moteur, Freins, GPS...).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QUIZ INTERACTIF DE DIAGNOSTIC -->
        <div class="card-panel quiz-card">
          <div class="quiz-header">
            <div>
              <h3>Quiz de Discernement Sémantique (4 Cas Concrets)</h3>
              <p class="quiz-sub">Entraînez votre intuition d'architecte : déterminez si la relation relève de l'héritage (« Est-un ») ou de la composition (« A-un »).</p>
            </div>
            <div class="quiz-score-badge">
              Score : {{ scoreCount() }} / {{ questions().length }}
            </div>
          </div>

          <div class="questions-list">
            @for (q of questions(); track q.id) {
              <div class="question-box" [class.answered]="q.userAnswer" [class.correct]="q.isCorrect" [class.incorrect]="q.userAnswer && !q.isCorrect">
                <div class="q-top">
                  <span class="q-cat">{{ q.category }}</span>
                  <h4 class="q-relation">{{ q.relation }}</h4>
                </div>

                <div class="q-actions">
                  <button 
                    class="q-btn" 
                    [class.selected]="q.userAnswer === 'is-a'"
                    [disabled]="!!q.userAnswer"
                    (click)="answerQuestion(q.id, 'is-a')"
                  >
                    🏛️ « Est-un » (Héritage)
                  </button>
                  <button 
                    class="q-btn" 
                    [class.selected]="q.userAnswer === 'has-a'"
                    [disabled]="!!q.userAnswer"
                    (click)="answerQuestion(q.id, 'has-a')"
                  >
                    🧩 « A-un » (Composition)
                  </button>
                </div>

                @if (q.userAnswer) {
                  <div class="q-feedback" [class.success]="q.isCorrect" [class.danger]="!q.isCorrect">
                    <div class="feedback-status">
                      {{ q.isCorrect ? '✔ Exact !' : '❌ Piège classique !' }}
                    </div>
                    <p class="feedback-explanation">{{ q.explanation }}</p>
                  </div>
                }
              </div>
            }
          </div>

          <div class="quiz-footer">
            <button class="btn-secondary" (click)="resetQuiz()">↺ Réinitialiser le quiz</button>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .uml-comparator-card {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .uml-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .pillar-column {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      &.is-a-col { border-top: 4px solid #3b82f6; }
      &.has-a-col { border-top: 4px solid #10b981; }
    }

    .pillar-header {
      display: flex;
      flex-direction: column;
      gap: 4px;

      h4 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .pillar-badge {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;

      &.is-a-badge { color: #60a5fa; }
      &.has-a-badge { color: #34d399; }
    }

    .keyword-pill {
      font-size: 0.78rem;
      color: var(--text-muted);

      code {
        color: #60a5fa;
        font-weight: 700;
      }

      &.green code {
        color: #34d399;
      }
    }

    .uml-diagram-box {
      background: var(--bg-card);
      border: 1px dashed var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .uml-class {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 14px;
      width: 100%;
      max-width: 280px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .c-name {
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--text-main);
      }
      .c-member {
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }
    }

    .uml-arrow-is-a, .uml-arrow-has-a {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-dim);

      .stem {
        width: 2px;
        height: 18px;
        background: var(--border-color);
      }

      .triangle {
        font-size: 0.85rem;
        color: #3b82f6;
        line-height: 1;
      }

      .diamond {
        font-size: 0.95rem;
        color: #10b981;
        line-height: 1;
      }
    }

    .properties-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .prop-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      font-size: 0.82rem;
      line-height: 1.4;
      color: var(--text-muted);

      .prop-icon {
        font-size: 1rem;
        flex-shrink: 0;
      }

      strong {
        color: var(--text-main);
      }
    }

    /* Quiz */
    .quiz-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .quiz-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 2px;
      }
    }

    .quiz-score-badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .questions-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .question-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.2s;

      &.correct {
        border-color: rgba(16, 185, 129, 0.5);
      }

      &.incorrect {
        border-color: rgba(239, 68, 68, 0.5);
      }
    }

    .q-top {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .q-cat {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--ts-blue-light);
      }

      .q-relation {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .q-actions {
      display: flex;
      gap: 8px;

      .q-btn {
        flex: 1;
        padding: 8px;
        background: var(--bg-card);
        color: var(--text-main);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 600;

        &:hover:not(:disabled) {
          border-color: var(--ts-blue);
          background: var(--bg-card-hover);
        }

        &.selected {
          background: var(--ts-blue);
          color: #ffffff;
        }
      }
    }

    .q-feedback {
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      line-height: 1.4;

      &.success {
        background: rgba(16, 185, 129, 0.15);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.35);
      }

      &.danger {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.35);
      }

      .feedback-status {
        font-weight: 800;
        margin-bottom: 4px;
      }
    }

    .quiz-footer {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class SemanticPillarsComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly questions = signal<QuizQuestion[]>([
    {
      id: 1,
      relation: '1. Smartphone & Batterie',
      leftItem: 'Smartphone',
      rightItem: 'Batterie',
      category: 'Composants électroniques',
      expectedAnswer: 'has-a',
      explanation: 'Un Smartphone n\'est pas une batterie. Il POSSÈDE une batterie. La batterie peut être remplacée ( swap à chaud), recyclée ou améliorée sans détruire l\'identité du smartphone.'
    },
    {
      id: 2,
      relation: '2. Enseignant & Personne',
      leftItem: 'Enseignant',
      rightItem: 'Personne',
      category: 'Entités humaines',
      expectedAnswer: 'is-a',
      explanation: 'Un Enseignant EST UNE Personne. L\'identité fondamentale est partagée : il a un nom, une date de naissance, un numéro national. Le principe de substitution de Liskov est parfaitement respecté.'
    },
    {
      id: 3,
      relation: '3. Compte Bancaire & Journal de Logs',
      leftItem: 'Compte Bancaire',
      rightItem: 'Journal de Logs',
      category: 'Services applicatifs',
      expectedAnswer: 'has-a',
      explanation: 'Faire "CompteBancaire extends Journal" serait une aberration : un compte bancaire n\'est pas un journal. Le compte UTILISE un service de journalisation pour enregistrer les transactions.'
    },
    {
      id: 4,
      relation: '4. Carré & Rectangle (Le Piège de Liskov)',
      leftItem: 'Carré',
      rightItem: 'Rectangle',
      category: 'Piège mathématique vs POO mutable',
      expectedAnswer: 'has-a',
      explanation: '⚠️ LE PIÈGE CLASSIQUE ! Mathématiquement, un carré est un rectangle. Mais en POO avec objets mutables, si Carre extends Rectangle, appeler rectangle.setLargeur(10) devrait modifier la largeur sans toucher la hauteur... ce qui brise l\'invariant fondamental du Carré (largeur === hauteur) ! En POO, le carré ne doit PAS hériter du rectangle.'
    }
  ]);

  scoreCount(): number {
    return this.questions().filter(q => q.isCorrect).length;
  }

  answerQuestion(id: number, answer: 'is-a' | 'has-a'): void {
    this.questions.update(list => list.map(q => {
      if (q.id === id) {
        return {
          ...q,
          userAnswer: answer,
          isCorrect: answer === q.expectedAnswer
        };
      }
      return q;
    }));
  }

  resetQuiz(): void {
    this.questions.update(list => list.map(q => ({
      ...q,
      userAnswer: undefined,
      isCorrect: undefined
    })));
  }
}
