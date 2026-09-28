import '@angular/compiler';
import { describe, it, expect, beforeAll } from 'vitest';
import { createEnvironmentInjector } from '@angular/core';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { ExerciseService } from './exercise.service';
import { EXERCISES_SERIES_1 } from './exercise-series-1';
import { EXERCISES_SERIES_2 } from './exercise-series-2';
import { EXERCISES_SERIES_3 } from './exercise-series-3';
import { EXERCISES_SERIES_4 } from './exercise-series-4';
import { EXERCISES_SERIES_5 } from './exercise-series-5';

const allExercises = [
  ...EXERCISES_SERIES_1,
  ...EXERCISES_SERIES_2,
  ...EXERCISES_SERIES_3,
  ...EXERCISES_SERIES_4,
  ...EXERCISES_SERIES_5
];

describe('Vérification Automatique des 25 Micro-Ateliers de la Séance 9', () => {
  let transpiler: TypescriptTranspilerService;
  let service: ExerciseService;

  beforeAll(() => {
    const injector = createEnvironmentInjector([TypescriptTranspilerService, ExerciseService], null as any);
    transpiler = injector.get(TypescriptTranspilerService);
    service = injector.get(ExerciseService);
  });

  it('doit charger exactement 25 exercices répartis en 5 séries', () => {
    expect(allExercises.length).toBe(25);
    expect(EXERCISES_SERIES_1.length).toBe(5);
    expect(EXERCISES_SERIES_2.length).toBe(5);
    expect(EXERCISES_SERIES_3.length).toBe(5);
    expect(EXERCISES_SERIES_4.length).toBe(5);
    expect(EXERCISES_SERIES_5.length).toBe(5);
  });

  for (const ex of allExercises) {
    it(`Exercice ${ex.number} [${ex.id}] : la solution officielle doit s'exécuter et valider 100% des critères`, () => {
      const exec = transpiler.executeCode(ex.solutionCode);
      expect(exec.success, `Erreur d'exécution pour ${ex.id}: ${exec.error}`).toBe(true);

      // 2. Validation des critères via ExerciseService
      const result = service.validateExercise(ex.id, ex.solutionCode);
      expect(result.success, `Critères non validés pour ${ex.id}: ${result.error}`).toBe(true);

      // 3. Vérifier que tous les critères individuels sont passés
      const storedEx = service.exercises().find(e => e.id === ex.id);
      expect(storedEx).toBeDefined();
      for (const crit of storedEx!.criteria) {
        expect(crit.passed, `Critère "${crit.label}" échoué pour ${ex.id}`).toBe(true);
      }
    });
  }
});
