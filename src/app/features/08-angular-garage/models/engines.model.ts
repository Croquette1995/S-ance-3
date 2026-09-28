import { Engine } from './engine.interface';

export class ElectricEngine implements Engine {
  readonly type = 'Électrique';
  start(): string {
    return '⚡ Silence absolu... 100% couple instantané !';
  }
}

export class CombustionEngine implements Engine {
  readonly type = 'Thermique';
  constructor(public readonly cylindres: number = 4) {}

  start(): string {
    return `🔥 Vrouuum ! Les ${this.cylindres} cylindres rugissent !`;
  }
}

export class HybridEngine implements Engine {
  readonly type = 'Hybride';
  constructor(public readonly mode: 'eco' | 'sport' = 'eco') {}

  start(): string {
    return `🍃 Décollage silencieux en électrique, puis réveil du 4 cylindres (${this.mode.toUpperCase()}) !`;
  }
}

export class HydrogenEngine implements Engine {
  readonly type = 'Hydrogène';
  start(): string {
    return '💧 Pile à hydrogène sous tension : zéro émission de CO₂, vapeur d\'eau pure !';
  }
}
