import { Engine } from './engine.interface';

export class Car {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly color: string,
    // ✅ "A UN" moteur (Composition & Injection de dépendance par constructeur)
    private engine: Engine,
    public readonly year: number = 2025
  ) {}

  get engineType(): string {
    return this.engine.type;
  }

  get currentEngine(): Engine {
    return this.engine;
  }

  // ✅ DÉLÉGATION de l'action vers le composant interne
  start(): string {
    return this.engine.start();
  }

  // Permutation à chaud (Runtime Swap)
  changeEngine(newEngine: Engine): void {
    this.engine = newEngine;
  }
}
