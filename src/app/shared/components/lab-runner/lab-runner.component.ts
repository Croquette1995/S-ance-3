import { Component, input, inject, signal, computed, effect } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { Exercise, ConsoleLogEntry } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [MonacoEditorComponent],
  template: `
    <div class="lab-runner-container">
      <!-- Barre supérieure de sélection d'exercices -->
      <div class="exercise-selector-bar card-panel">
        <div class="selector-tabs">
          @for (ex of displayedExercises(); track ex.id; let idx = $index) {
            <button 
              class="ex-pill-btn" 
              [class.active]="selectedExerciseId() === ex.id"
              [class.completed]="ex.isCompleted"
              (click)="onSelectExercise(ex.id)"
            >
              <span class="status-icon">{{ ex.isCompleted ? '✓' : ex.number }}</span>
              <span class="ex-short-title">{{ ex.title }}</span>
            </button>
          }
        </div>

        <div class="lab-progress-badge">
          <span class="badge badge-success">{{ labCompletedCount() }} / {{ displayedExercises().length }} Validés</span>
        </div>
      </div>

      <!-- Espace de travail de l'exercice actif -->
      <div class="lab-grid">
        <!-- Panneau Énoncé & Critères -->
        <div class="card-panel brief-panel">
          <div class="brief-header">
            <div class="badges-row">
              <span class="badge badge-ts">Exercice {{ activeEx().number }}</span>
              <span class="badge badge-purple">{{ activeEx().difficulty }}</span>
              <span class="badge badge-warning">⏱️ {{ activeEx().estimatedTime }}</span>
              @if (activeEx().isCompleted) {
                <span class="badge badge-success">✓ Validé</span>
              }
            </div>
            <h3 class="brief-title">{{ activeEx().title }}</h3>
            <p class="brief-sub">{{ activeEx().subtitle }}</p>
          </div>

          <div class="statement-box">
            <div class="statement-label">🎯 Consigne :</div>
            <p class="statement-text">{{ activeEx().statement }}</p>
          </div>

          <!-- Critères d'évaluation automatique -->
          <div class="criteria-box">
            <div class="criteria-title">Vérifications automatiques :</div>
            <div class="criteria-list">
              @for (c of activeEx().criteria; track c.id) {
                <div class="criterion-item" [class.passed]="c.passed">
                  <div class="c-icon">{{ c.passed ? '✔' : '○' }}</div>
                  <div class="c-info">
                    <div class="c-label">{{ c.label }}</div>
                    <div class="c-desc">{{ c.description }}</div>
                    @if (!c.passed && showHints()) {
                      <div class="c-hint">💡 Indice : {{ c.hint }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Indice dépliable -->
          @if (showHints()) {
            <div class="hint-card">
              <div class="hint-title">💡 Indice pédagogique :</div>
              <p>{{ activeEx().hint }}</p>
            </div>
          }

          <!-- Explication guidée de la solution -->
          @if (showSolution()) {
            <div class="solution-card">
              <div class="sol-title">📖 Explication pas-à-pas de la solution :</div>
              <ul>
                @for (item of activeEx().solutionExplanation; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Panneau Éditeur Monaco & Console Virtuelle -->
        <div class="editor-col">
          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-name-indicator">
              <span class="ts-icon">TS</span>
              <span>exercice-{{ activeEx().number }}.ts</span>
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary" (click)="injectSolution()" title="Remplacer le code actuel par la solution officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary" (click)="resetExercise()" title="Réinitialiser le code d'origine">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary" (click)="validate()">
                🚀 Valider mon code
              </button>
            </div>
          </div>

          <!-- Monaco Editor Box -->
          <div class="editor-wrapper">
            <app-monaco-editor
              [code]="activeEx().currentCode"
              language="typescript"
              (codeChange)="onCodeChange($event)"
            ></app-monaco-editor>
          </div>

          <!-- Console Virtuelle & Résultat -->
          <div class="virtual-terminal card-panel">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="term-title">Console d'Exécution Virtuelle (TypeScript / Node Sandbox)</span>
              <button class="clear-btn" (click)="clearLogs()">Effacer</button>
            </div>

            <div class="terminal-body">
              @if (lastValidationResult()) {
                <div class="validation-banner" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  @if (lastValidationResult()?.success) {
                    <span>✔ Succès ! Tous les critères sont respectés et le code compile sans erreur.</span>
                  } @else {
                    <span>❌ Code non validé : certains critères ne sont pas encore satisfaits.</span>
                  }
                </div>
              }

              @if (logs().length === 0) {
                <div class="empty-terminal-hint">
                  Appuyez sur « <strong>🚀 Valider mon code</strong> » pour compiler et exécuter vos instructions <code>console.log()</code>.
                </div>
              } @else {
                <div class="terminal-logs">
                  @for (log of logs(); track log.timestamp + log.text) {
                    <div class="log-line" [class]="'log-' + log.type">
                      <span class="log-time">{{ log.timestamp }}</span>
                      <span class="log-badge">{{ log.type.toUpperCase() }}</span>
                      <pre class="log-text">{{ log.text }}</pre>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lab-runner-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .exercise-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .selector-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      flex: 1;
    }

    .ex-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(49, 120, 198, 0.18);
        color: var(--ts-blue-light);
        border-color: var(--ts-blue);
        font-weight: 600;
      }

      &.completed .status-icon {
        color: #10b981;
        font-weight: 700;
      }
    }

    .status-icon {
      font-size: 0.78rem;
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 520px;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      overflow-y: auto;
      max-height: calc(100vh - 165px);
    }

    .badges-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }

    .brief-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .brief-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .statement-box {
      background: var(--bg-subtle);
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid var(--ts-blue);

      .statement-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--ts-blue-light);
        margin-bottom: 4px;
      }

      .statement-text {
        font-size: 0.88rem;
        line-height: 1.45;
        color: var(--text-main);
      }
    }

    .criteria-box {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .criteria-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
      }
    }

    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .criterion-item {
      display: flex;
      gap: 10px;
      padding: 8px 10px;
      background: var(--bg-subtle);
      border-radius: 6px;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;

      .c-icon {
        font-size: 0.95rem;
        color: var(--text-dim);
      }

      .c-label {
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--text-main);
      }

      .c-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
      }

      .c-hint {
        font-size: 0.74rem;
        color: #f59e0b;
        margin-top: 3px;
      }

      &.passed {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.06);

        .c-icon {
          color: #10b981;
        }
      }
    }

    .hint-card, .solution-card {
      padding: 12px;
      border-radius: 8px;
      font-size: 0.82rem;
      line-height: 1.4;
    }

    .hint-card {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;

      .hint-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
    }

    .solution-card {
      background: rgba(147, 51, 234, 0.1);
      border: 1px solid rgba(147, 51, 234, 0.3);
      color: #d8b4fe;

      .sol-title {
        font-weight: 700;
        margin-bottom: 6px;
      }

      ul {
        padding-left: 18px;
      }
    }

    .editor-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      gap: 10px;
    }

    .file-name-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--text-muted);

      .ts-icon {
        background: var(--ts-blue);
        color: #ffffff;
        font-size: 0.68rem;
        font-weight: 700;
        padding: 2px 5px;
        border-radius: 3px;
      }
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .editor-wrapper {
      flex: 1;
      min-height: 300px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .virtual-terminal {
      display: flex;
      flex-direction: column;
      height: 220px;
      padding: 0;
      overflow: hidden;
    }

    .terminal-header {
      background: var(--terminal-header);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);

      .terminal-dots {
        display: flex;
        gap: 6px;

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;

          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }
      }

      .term-title {
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      .clear-btn {
        font-size: 0.7rem;
        color: var(--text-dim);
        padding: 2px 6px;
        border-radius: 4px;

        &:hover {
          color: var(--text-main);
          background: var(--bg-subtle);
        }
      }
    }

    .terminal-body {
      flex: 1;
      background: var(--terminal-bg);
      padding: 10px 14px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    .validation-banner {
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 600;
      margin-bottom: 8px;

      &.success {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.35);
      }

      &.error {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.35);
      }
    }

    .empty-terminal-hint {
      color: var(--text-dim);
      font-size: 0.82rem;
      padding: 16px 0;
    }

    .terminal-logs {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.4;

      .log-time {
        color: var(--text-dim);
        font-size: 0.72rem;
      }

      .log-badge {
        font-size: 0.65rem;
        padding: 1px 4px;
        border-radius: 3px;
        font-weight: 700;
      }

      .log-text {
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
      }

      &.log-log {
        color: #e2e8f0;
        .log-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
      }
      &.log-error {
        color: #fca5a5;
        .log-badge { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      }
      &.log-warn {
        color: #fde047;
        .log-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
      }
      &.log-info {
        color: #93c5fd;
        .log-badge { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
      }
    }
  `]
})
export class LabRunnerComponent {
  readonly labNumber = input<number | undefined>(undefined);

  readonly exerciseService = inject(ExerciseService);

  readonly selectedExerciseId = signal<string>('ex-1-1');
  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly logs = signal<ConsoleLogEntry[]>([]);
  readonly lastValidationResult = signal<{ success: boolean; error?: string } | null>(null);

  readonly displayedExercises = computed(() => {
    const lab = this.labNumber();
    if (lab !== undefined && lab !== null) {
      return this.exerciseService.getExercisesForLab(lab);
    }
    return this.exerciseService.exercises();
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  readonly activeEx = computed(() => {
    const list = this.displayedExercises();
    const found = list.find(e => e.id === this.selectedExerciseId());
    return found || list[0] || this.exerciseService.exercises()[0];
  });

  constructor() {
    effect(() => {
      const list = this.displayedExercises();
      if (list.length > 0 && !list.some(e => e.id === this.selectedExerciseId())) {
        this.selectedExerciseId.set(list[0].id);
      }
    });
  }

  onSelectExercise(id: string): void {
    this.selectedExerciseId.set(id);
    this.showHints.set(false);
    this.showSolution.set(false);
    this.logs.set([]);
    this.lastValidationResult.set(null);
  }

  onCodeChange(newCode: string): void {
    this.exerciseService.updateExerciseCode(this.activeEx().id, newCode);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  resetExercise(): void {
    this.exerciseService.resetExerciseCode(this.activeEx().id);
    this.logs.set([]);
    this.lastValidationResult.set(null);
  }

  injectSolution(): void {
    this.exerciseService.injectSolutionCode(this.activeEx().id);
  }

  validate(): void {
    const current = this.activeEx();
    const res = this.exerciseService.validateExercise(current.id, current.currentCode);
    this.logs.set(res.logs);
    this.lastValidationResult.set({
      success: res.success,
      error: res.error
    });
  }

  clearLogs(): void {
    this.logs.set([]);
    this.lastValidationResult.set(null);
  }
}
