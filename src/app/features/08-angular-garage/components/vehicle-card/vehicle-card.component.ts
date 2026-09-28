import { Component, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.model';
import { Engine } from '../../models/engine.interface';
import { ElectricEngine, CombustionEngine, HybridEngine, HydrogenEngine } from '../../models/engines.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vehicle-card" [style.borderColor]="car().color">
      <!-- HEADER -->
      <div class="card-top-bar">
        <div class="brand-info">
          <span class="color-dot" [style.backgroundColor]="car().color"></span>
          <span class="brand-name">{{ car().brand }}</span>
          <span class="model-name">{{ car().model }}</span>
        </div>
        <span class="year-badge">{{ car().year }}</span>
      </div>

      <!-- MOTORISATION BADGE -->
      <div class="engine-badge-row">
        <span class="engine-pill" [ngClass]="getEngineClass(car().engineType)">
          ⚙️ Moteur : {{ car().engineType }}
        </span>
      </div>

      <!-- MESSAGE ISSU DE LA DÉLÉGATION -->
      <div class="sound-terminal" [class.active]="isStarted()">
        <div class="terminal-label">Délégation ➔ car.start() ➔ engine.start() :</div>
        <div class="sound-text">
          {{ engineSound() }}
        </div>
      </div>

      <!-- BOUTONS D'ACTION -->
      <div class="card-actions">
        <button class="btn-start" (click)="onStartCar()" [class.running]="isStarted()">
          <span>{{ isStarted() ? '🔄 Redémarrer' : '🔑 Démarrer le véhicule' }}</span>
        </button>

        <div class="swap-engine-dropdown">
          <button class="btn-swap" (click)="toggleSwapMenu()">
            🔄 Remplacer le moteur
          </button>

          @if (showSwapMenu()) {
            <div class="swap-menu">
              <div class="swap-menu-header">Changer le moteur à la volée :</div>
              <button (click)="swapTo(newElectric())">⚡ Électrique (Silencieux)</button>
              <button (click)="swapTo(newV8())">🔥 V8 Thermique (450 ch)</button>
              <button (click)="swapTo(newHybrid())">🍃 Hybride (Eco/Sport)</button>
              <button (click)="swapTo(newHydrogen())">💧 Pile à Hydrogène</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-card {
      background: var(--surface-card);
      border: 2px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }

    .card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .brand-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .brand-name {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-heading);
        }

        .model-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-muted);
        }
      }

      .year-badge {
        font-family: monospace;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.15rem 0.45rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid var(--border-color);
        border-radius: 0.3rem;
        color: var(--text-muted);
      }
    }

    .engine-badge-row {
      display: flex;
      gap: 0.5rem;

      .engine-pill {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.25rem 0.6rem;
        border-radius: 0.4rem;
        letter-spacing: 0.03em;

        &.electric {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        &.thermal {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        &.hybrid {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        &.hydrogen {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
      }
    }

    .sound-terminal {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 0.6rem;
      padding: 0.75rem;
      min-height: 4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.35rem;
      transition: all 0.2s ease;

      &.active {
        border-color: #3b82f6;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
      }

      .terminal-label {
        font-family: monospace;
        font-size: 0.65rem;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .sound-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: #e2e8f0;
        line-height: 1.35;
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      position: relative;

      .btn-start {
        flex: 1;
        padding: 0.6rem 0.85rem;
        background: #2563eb;
        color: #ffffff;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);

        &:hover {
          background: #1d4ed8;
        }

        &.running {
          background: #059669;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
        }
      }

      .swap-engine-dropdown {
        position: relative;

        .btn-swap {
          padding: 0.6rem 0.75rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          color: var(--text-body);
          border-radius: 0.5rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        }

        .swap-menu {
          position: absolute;
          bottom: 110%;
          right: 0;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 0.6rem;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 220px;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);

          .swap-menu-header {
            font-size: 0.7rem;
            font-weight: 700;
            color: #94a3b8;
            padding: 0.2rem 0.4rem;
            border-bottom: 1px solid #334155;
            margin-bottom: 0.2rem;
          }

          button {
            text-align: left;
            padding: 0.4rem 0.6rem;
            border-radius: 0.35rem;
            background: transparent;
            border: none;
            color: #e2e8f0;
            font-size: 0.78rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;

            &:hover {
              background: #334155;
              color: #ffffff;
            }
          }
        }
      }
    }
  `]
})
export class VehicleCardComponent {
  car = input.required<Car>();
  engineSound = signal<string>('Moteur à l’arrêt (En attente du contact...)');
  isStarted = signal<boolean>(false);
  showSwapMenu = signal<boolean>(false);

  engineChanged = output<string>();

  onStartCar(): void {
    const sound = this.car().start();
    this.engineSound.set(sound);
    this.isStarted.set(true);
  }

  toggleSwapMenu(): void {
    this.showSwapMenu.update(v => !v);
  }

  swapTo(newEngine: Engine): void {
    this.car().changeEngine(newEngine);
    this.showSwapMenu.set(false);
    this.engineSound.set(`Moteur remplacé par : ${newEngine.type} ! Cliquez sur Démarrer.`);
    this.isStarted.set(false);
    this.engineChanged.emit(newEngine.type);
  }

  getEngineClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'électrique': return 'electric';
      case 'thermique': return 'thermal';
      case 'hybride': return 'hybrid';
      case 'hydrogène': return 'hydrogen';
      default: return '';
    }
  }

  newElectric() { return new ElectricEngine(); }
  newV8() { return new CombustionEngine(8); }
  newHybrid() { return new HybridEngine('sport'); }
  newHydrogen() { return new HydrogenEngine(); }
}
