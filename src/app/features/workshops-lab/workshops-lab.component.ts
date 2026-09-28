import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <!-- HEADER -->
      <div class="module-header">
        <div class="module-tag">ATELIER PRATIQUE GLOBAL · 25 MICRO-EXERCICES EN POO TYPESCRIPT</div>
        <h2>Le Studio des Micro-Ateliers Monaco</h2>
        <p class="module-desc">
          Retrouvez l'intégralité des 25 défis interactifs répartis sur 5 séries thématiques. Chaque atelier comprend un éditeur Monaco avec coloration syntaxique et autocomplétion TypeScript, un environnement de compilation et d'exécution dans le navigateur, et une suite de tests unitaires automatiques vérifiant vos invariants.
        </p>
      </div>

      <!-- PROGRESS BANNER -->
      <div class="progress-hero-banner">
        <div class="hero-metric">
          <span class="metric-num">{{ exerciseService.completedCount() }} / {{ exerciseService.totalCount() }}</span>
          <span class="metric-label">Défis validés au total</span>
        </div>

        <div class="hero-progress-bar-wrapper">
          <div class="bar-top">
            <span class="bar-title">Progression Globale du Module</span>
            <span class="bar-percent">{{ exerciseService.progressPercentage() }}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" [style.width.%]="exerciseService.progressPercentage()"></div>
          </div>
        </div>

        <button class="btn-reset-all" (click)="resetAllProgress()">
          🔄 Réinitialiser tous les exercices
        </button>
      </div>

      <!-- SELECTEUR DE SÉRIE -->
      <div class="series-nav-pills">
        <button class="series-pill-btn" [class.active]="selectedLab() === undefined" (click)="selectedLab.set(undefined)">
          <span>🌐 Tous (25)</span>
        </button>
        <button class="series-pill-btn" [class.active]="selectedLab() === 1" (click)="selectedLab.set(1)">
          <span>💥 Série 1 : Pathologies (1.1 - 1.5)</span>
        </button>
        <button class="series-pill-btn" [class.active]="selectedLab() === 2" (click)="selectedLab.set(2)">
          <span>📐 Série 2 : Piliers Sémantiques (2.1 - 2.5)</span>
        </button>
        <button class="series-pill-btn" [class.active]="selectedLab() === 3" (click)="selectedLab.set(3)">
          <span>⚙️ Série 3 : Délégation (3.1 - 3.5)</span>
        </button>
        <button class="series-pill-btn" [class.active]="selectedLab() === 4" (click)="selectedLab.set(4)">
          <span>🔌 Série 4 : DIP &amp; Mocking (4.1 - 4.5)</span>
        </button>
        <button class="series-pill-btn" [class.active]="selectedLab() === 5" (click)="selectedLab.set(5)">
          <span>🛡️ Série 5 : Anti-patrons &amp; Angular (5.1 - 5.5)</span>
        </button>
      </div>

      <!-- LAB RUNNER INSTANCE -->
      <div class="runner-host-panel">
        <app-lab-runner [labNumber]="selectedLab()"></app-lab-runner>
      </div>
    </div>
  `,
  styles: [`
    .module-container {
      max-width: 1400px;
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
        color: #10b981;
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
      }
    }

    .progress-hero-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.25rem 1.75rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;

      .hero-metric {
        display: flex;
        flex-direction: column;

        .metric-num {
          font-size: 1.75rem;
          font-weight: 900;
          color: #10b981;
          font-family: monospace;
          line-height: 1.1;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .hero-progress-bar-wrapper {
        flex: 1;
        min-width: 240px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .bar-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;

          .bar-title {
            color: var(--text-heading);
          }

          .bar-percent {
            color: #10b981;
            font-family: monospace;
          }
        }

        .bar-track {
          height: 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          overflow: hidden;

          .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #4f46e5, #10b981);
            border-radius: 5px;
            transition: width 0.4s ease;
          }
        }
      }

      .btn-reset-all {
        padding: 0.6rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #f87171;
        border-radius: 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #ef4444;
          color: #ffffff;
        }
      }
    }

    .series-nav-pills {
      display: flex;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;

      .series-pill-btn {
        padding: 0.65rem 1.1rem;
        background: var(--surface-card);
        border: 1px solid var(--border-color);
        border-radius: 0.65rem;
        color: var(--text-muted);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
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

    .runner-host-panel {
      min-height: 700px;
    }
  `]
})
export class WorkshopsLabComponent {
  exerciseService = inject(ExerciseService);
  selectedLab = signal<number | undefined>(undefined);

  resetAllProgress(): void {
    if (confirm('Voulez-vous réinitialiser tous les exercices de la séance 9 ? Vos modifications de code seront remises au code de départ.')) {
      this.exerciseService.resetAll();
    }
  }
}
