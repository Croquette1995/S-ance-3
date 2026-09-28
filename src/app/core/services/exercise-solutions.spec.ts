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

  describe('Validation du code initial (Doit ÉCHOUER initialement)', () => {
    for (const ex of allExercises) {
      it(`Exercice ${ex.number} [${ex.id}] : le code de départ ne doit PAS être validé immédiatement`, () => {
        const result = service.validateExercise(ex.id, ex.initialCode);
        expect(result.success, `L'exercice ${ex.id} se valide immédiatement avec le code de départ !`).toBe(false);
      });
    }
  });

  describe('Validation de la solution officielle (Doit RÉUSSIR à 100%)', () => {
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

  describe('Validation du filtrage par labo', () => {
    it('getExercisesForLab(1) doit retourner les 5 exercices du labo 1', () => {
      const lab1Exs = service.getExercisesForLab(1);
      expect(lab1Exs.length).toBe(5);
      expect(lab1Exs.every(e => e.labNumber === 1)).toBe(true);
    });

    it('getExercisesForLab(2) doit retourner les 5 exercices du labo 2', () => {
      const lab2Exs = service.getExercisesForLab(2);
      expect(lab2Exs.length).toBe(5);
      expect(lab2Exs.every(e => e.labNumber === 2)).toBe(true);
    });
  });
});
