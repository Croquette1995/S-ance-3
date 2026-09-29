import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { EXERCISES_SERIES_1 } from './exercise-series-1';
import { EXERCISES_SERIES_2 } from './exercise-series-2';
import { EXERCISES_SERIES_3 } from './exercise-series-3';
import { EXERCISES_SERIES_4 } from './exercise-series-4';
import { EXERCISES_SERIES_5 } from './exercise-series-5';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance9_exercises_v1';
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  readonly exercises = signal<Exercise[]>([
    ...EXERCISES_SERIES_1,
    ...EXERCISES_SERIES_2,
    ...EXERCISES_SERIES_3,
    ...EXERCISES_SERIES_4,
    ...EXERCISES_SERIES_5
  ]);

  readonly totalCount = computed(() => this.exercises().length);
  readonly completedCount = computed(() => this.exercises().filter(e => e.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor() {
    this.loadFromStorage();
  }

  getExercisesForLab(labNumber: number): Exercise[] {
    return this.exercises().filter(e => e.labNumber === labNumber);
  }

  updateExerciseCode(id: string, newCode: string): void {
    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, currentCode: newCode };
        }
        return item;
      });
    });
    this.saveToStorage();
  }

  resetExerciseCode(id: string): void {
    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, currentCode: item.initialCode };
        }
        return item;
      });
    });
    this.saveToStorage();
  }

  resetAll(): void {
    this.exercises.update(list => {
      return list.map(item => ({
        ...item,
        currentCode: item.initialCode,
        isCompleted: false,
        criteria: item.criteria.map(c => ({ ...c, passed: false }))
      }));
    });
    this.saveToStorage();
  }

  injectSolutionCode(id: string): void {
    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, currentCode: item.solutionCode };
        }
        return item;
      });
    });
    this.saveToStorage();
  }

  validateExercise(targetId: string, code: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const exec = this.transpiler.executeCode(code);
    const targetEx = this.exercises().find(e => e.id === targetId);

    if (!targetEx) {
      return { success: false, logs: exec.logs, error: 'Exercice introuvable' };
    }

    const updatedCriteria: ValidationCriterion[] = targetEx.criteria.map(c => ({ ...c, passed: false }));
    let allPassed = false;

    if (!exec.success) {
      this.exercises.update(list => list.map(item => {
        if (item.id === targetId) {
          return { ...item, criteria: updatedCriteria, isCompleted: false };
        }
        return item;
      }));
      return { success: false, logs: exec.logs, error: exec.error };
    }

    switch (targetId) {
      case 'ex-1-1': {
        const hasCpu = /class\s+Processeur\b/.test(code) && /calculer\s*\(\s*\)/.test(code);
        const hasPc = /class\s+Ordinateur\b/.test(code) && /constructor\s*\([^)]*Processeur/.test(code);
        const logged = exec.logs.some(l => l.text.toLowerCase().includes('assemblé') || l.text.toLowerCase().includes('succès'));
        updatedCriteria[0].passed = hasCpu;
        updatedCriteria[1].passed = hasPc;
        updatedCriteria[2].passed = logged;
        allPassed = hasCpu && hasPc && logged;
        break;
      }
      case 'ex-1-2': {
        const hasDeleg = /executer\s*\(\s*\)/.test(code) && /this\.\w+\.calculer\s*\(/.test(code);
        const logged = exec.logs.some(l => l.text.includes('4.2 GHz') || l.text.includes('CPU'));
        updatedCriteria[0].passed = hasDeleg;
        updatedCriteria[1].passed = logged;
        allPassed = hasDeleg && logged;
        break;
      }
      case 'ex-1-3': {
        const hasRam = /class\s+MemoireVive\b/.test(code) && /capaciteGo\s*\(\s*\)/.test(code);
        const hasMulti = /constructor\s*\([^)]*Processeur[^)]*MemoireVive/.test(code) || /constructor\s*\([^)]*MemoireVive[^)]*Processeur/.test(code);
        const hasDiag = exec.logs.some(l => l.text.includes('32') && (l.text.includes('CPU') || l.text.includes('RAM') || l.text.includes('PC')));
        updatedCriteria[0].passed = hasRam;
        updatedCriteria[1].passed = hasMulti;
        updatedCriteria[2].passed = hasDiag;
        allPassed = hasRam && hasMulti && hasDiag;
        break;
      }
      case 'ex-1-4': {
        const hasPrivate = /constructor\s*\([^)]*private\s+\w+\s*:\s*Processeur[^)]*private\s+\w+\s*:\s*MemoireVive/.test(code) ||
                           /constructor\s*\([^)]*private\s+\w+\s*:\s*MemoireVive[^)]*private\s+\w+\s*:\s*Processeur/.test(code);
        const hasSpecs = /get\s+specs\s*\(\s*\)/.test(code) && exec.logs.some(l => l.text.includes('Intel') && l.text.includes('16 Go'));
        updatedCriteria[0].passed = hasPrivate;
        updatedCriteria[1].passed = hasSpecs;
        allPassed = hasPrivate && hasSpecs;
        break;
      }
      case 'ex-1-5': {
        const hasClasses = /class\s+DisqueDur\b/.test(code) && /espaceLibreGo/.test(code);
        const hasServeur = /class\s+Serveur\b/.test(code) && /demarrer\s*\(\s*\)/.test(code);
        const logged = exec.logs.some(l => l.text.includes('Datacenter-1') && l.text.includes('2000'));
        updatedCriteria[0].passed = hasClasses;
        updatedCriteria[1].passed = hasServeur;
        updatedCriteria[2].passed = logged;
        allPassed = hasClasses && hasServeur && logged;
        break;
      }

      case 'ex-2-1': {
        const hasInterface = /interface\s+Arme\b/.test(code) && /attaquer\s*\(\s*\)/.test(code);
        const hasClasses = /class\s+Epee\s+implements\s+Arme\b/.test(code) && /class\s+Arc\s+implements\s+Arme\b/.test(code);
        const logged = exec.logs.some(l => l.text.toLowerCase().includes('épée') || l.text.toLowerCase().includes('epee')) &&
                       exec.logs.some(l => l.text.toLowerCase().includes('flèche') || l.text.toLowerCase().includes('fleche') || l.text.toLowerCase().includes('arc'));
        updatedCriteria[0].passed = hasInterface;
        updatedCriteria[1].passed = hasClasses;
        updatedCriteria[2].passed = logged;
        allPassed = hasInterface && hasClasses && logged;
        break;
      }
      case 'ex-2-2': {
        const hasGuerrier = /class\s+Guerrier\b/.test(code) && /constructor\s*\([^)]*Arme/.test(code);
        const logged = exec.logs.some(l => l.text.includes('Conan'));
        updatedCriteria[0].passed = hasGuerrier;
        updatedCriteria[1].passed = logged;
        allPassed = hasGuerrier && logged;
        break;
      }
      case 'ex-2-3': {
        const hasFrapper = /frapper\s*\(\s*\)/.test(code) && /attaquer\s*\(/.test(code);
        const logged = exec.logs.some(l => l.text.includes('Conan') && (l.text.toLowerCase().includes('épée') || l.text.toLowerCase().includes('epee')));
        updatedCriteria[0].passed = hasFrapper;
        updatedCriteria[1].passed = logged;
        allPassed = hasFrapper && logged;
        break;
      }
      case 'ex-2-4': {
        const hasSwap = /equiperArme\s*\(\s*\w+\s*:\s*Arme\s*\)/.test(code) || /equiperArme\s*\(\s*\w+\s*\)/.test(code);
        const logged = exec.logs.some(l => l.text.toLowerCase().includes('épée') || l.text.toLowerCase().includes('epee')) &&
                       exec.logs.some(l => l.text.toLowerCase().includes('flèche') || l.text.toLowerCase().includes('fleche') || l.text.toLowerCase().includes('arc'));
        updatedCriteria[0].passed = hasSwap;
        updatedCriteria[1].passed = logged;
        allPassed = hasSwap && logged;
        break;
      }
      case 'ex-2-5': {
        const hasSceptre = /class\s+SceptreMagique\s+implements\s+Arme\b/.test(code) && /Boule de feu/.test(code);
        const logged = exec.logs.some(l => l.text.includes('Conan') && l.text.includes('Boule de feu'));
        updatedCriteria[0].passed = hasSceptre;
        updatedCriteria[1].passed = logged;
        allPassed = hasSceptre && logged;
        break;
      }

      case 'ex-3-1': {
        const hasContract = /interface\s+ServiceNotification\b/.test(code) && /envoyer\s*\([^)]*\)\s*:\s*boolean/.test(code);
        const hasImpl = /class\s+ConsoleNotification\s+implements\s+ServiceNotification\b/.test(code);
        updatedCriteria[0].passed = hasContract;
        updatedCriteria[1].passed = hasImpl;
        allPassed = hasContract && hasImpl;
        break;
      }
      case 'ex-3-2': {
        const hasEmail = /class\s+EmailNotification\s+implements\s+ServiceNotification\b/.test(code);
        const logged = exec.logs.some(l => l.text.includes('client@eafc.be') || l.text.includes('Email'));
        updatedCriteria[0].passed = hasEmail;
        updatedCriteria[1].passed = logged;
        allPassed = hasEmail && logged;
        break;
      }
      case 'ex-3-3': {
        const hasSms = /class\s+SmsNotification\s+implements\s+ServiceNotification\b/.test(code);
        const logged = exec.logs.some(l => l.text.includes('+32470123456') || l.text.includes('SMS'));
        updatedCriteria[0].passed = hasSms;
        updatedCriteria[1].passed = logged;
        allPassed = hasSms && logged;
        break;
      }
      case 'ex-3-4': {
        const hasDip = /class\s+GestionnaireCommandes\b/.test(code) && /constructor\s*\([^)]*ServiceNotification/.test(code);
        const hasValider = /validerCommande\s*\(/.test(code);
        const logged = exec.logs.some(l => l.text.includes('alice@site.be')) && exec.logs.some(l => l.text.includes('+32499112233'));
        updatedCriteria[0].passed = hasDip;
        updatedCriteria[1].passed = hasValider;
        updatedCriteria[2].passed = logged;
        allPassed = hasDip && hasValider && logged;
        break;
      }
      case 'ex-3-5': {
        const hasCtor = /class\s+Facturation\b/.test(code) && /constructor\s*\([^)]*ServiceNotification/.test(code);
        const logged = exec.logs.some(l => l.text.includes('120') && (l.text.includes('SMS') || l.text.includes('Facture') || l.text.includes('Bob')));
        updatedCriteria[0].passed = hasCtor;
        updatedCriteria[1].passed = logged;
        allPassed = hasCtor && logged;
        break;
      }

      case 'ex-4-1': {
        const hasInterface = /interface\s+PasserellePaiement\b/.test(code) && /debiter\s*\([^)]*\)\s*:\s*boolean/.test(code);
        const logged = exec.logs.some(l => l.text.includes('50'));
        updatedCriteria[0].passed = hasInterface;
        updatedCriteria[1].passed = logged;
        allPassed = hasInterface && logged;
        break;
      }
      case 'ex-4-2': {
        const hasMock = /class\s+MockPasserellePaiement\s+implements\s+PasserellePaiement\b/.test(code) && /dernierMontant/.test(code);
        const logged = exec.logs.some(l => l.text.includes('150'));
        updatedCriteria[0].passed = hasMock;
        updatedCriteria[1].passed = logged;
        allPassed = hasMock && logged;
        break;
      }
      case 'ex-4-3': {
        const hasPanier = /class\s+PanierAchat\b/.test(code) && /constructor\s*\([^)]*PasserellePaiement/.test(code) && /payer\s*\(/.test(code);
        const logged = exec.logs.some(l => l.text.includes('PAIEMENT_VALIDE'));
        updatedCriteria[0].passed = hasPanier;
        updatedCriteria[1].passed = logged;
        allPassed = hasPanier && logged;
        break;
      }
      case 'ex-4-4': {
        const hasAsserts = /console\.assert\s*\([^)]*PAIEMENT_VALIDE/.test(code) && /console\.assert\s*\([^)]*80/.test(code);
        const noAssertionFailure = !exec.logs.some(l => l.text.includes('Assertion Failed'));
        updatedCriteria[0].passed = hasAsserts;
        updatedCriteria[1].passed = noAssertionFailure && hasAsserts;
        allPassed = hasAsserts && noAssertionFailure;
        break;
      }
      case 'ex-4-5': {
        const hasRejet = /class\s+MockPasserelleRejet\s+implements\s+PasserellePaiement\b/.test(code) && /return\s+false/.test(code);
        const hasAssert = /console\.assert\s*\([^)]*ECHEC_PAIEMENT/.test(code) && !exec.logs.some(l => l.text.includes('Assertion Failed'));
        updatedCriteria[0].passed = hasRejet;
        updatedCriteria[1].passed = hasAssert;
        allPassed = hasRejet && hasAssert;
        break;
      }

      case 'ex-5-1': {
        const noExtends = !/class\s+Pile[^{]*extends\s+Array/.test(code);
        const hasEmpiler = /empiler\s*\(/.test(code) && /elements\.push/.test(code);
        updatedCriteria[0].passed = noExtends;
        updatedCriteria[1].passed = hasEmpiler;
        allPassed = noExtends && hasEmpiler;
        break;
      }
      case 'ex-5-2': {
        const hasMethods = /depiler\s*\(\s*\)/.test(code) && /get\s+taille\s*\(\s*\)/.test(code);
        const logged = exec.logs.some(l => l.text.includes('B')) && exec.logs.some(l => l.text.includes('1'));
        updatedCriteria[0].passed = hasMethods;
        updatedCriteria[1].passed = logged;
        allPassed = hasMethods && logged;
        break;
      }
      case 'ex-5-3': {
        const hasSommet = /get\s+sommet\s*\(\s*\)/.test(code);
        const logged = exec.logs.some(l => l.text.includes('20')) && exec.logs.some(l => l.text.includes('2'));
        updatedCriteria[0].passed = hasSommet;
        updatedCriteria[1].passed = logged;
        allPassed = hasSommet && logged;
        break;
      }
      case 'ex-5-4': {
        const hasValid = /class\s+ValidateurEmail\b/.test(code) && /valider\s*\(/.test(code);
        const hasNotif = /class\s+Notificateur\b/.test(code) && /notifier\s*\(/.test(code);
        updatedCriteria[0].passed = hasValid;
        updatedCriteria[1].passed = hasNotif;
        allPassed = hasValid && hasNotif;
        break;
      }
      case 'ex-5-5': {
        const hasUser = /class\s+Utilisateur\b/.test(code) && /constructor\s*\([^)]*ValidateurEmail[^)]*Notificateur/.test(code);
        const hasInscrire = /inscrire\s*\(\s*\)/.test(code);
        const logged = exec.logs.some(l => l.text.includes('Inscription réussie') || l.text.includes('true'));
        updatedCriteria[0].passed = hasUser;
        updatedCriteria[1].passed = hasInscrire;
        updatedCriteria[2].passed = logged;
        allPassed = hasUser && hasInscrire && logged;
        break;
      }
    }

    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === targetId) {
          return {
            ...item,
            isCompleted: allPassed,
            criteria: updatedCriteria
          };
        }
        return item;
      });
    });

    this.saveToStorage();

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error
    };
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = this.exercises().map(ex => ({
        id: ex.id,
        isCompleted: ex.isCompleted,
        currentCode: ex.currentCode
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.exercises.update(list => {
          return list.map(ex => {
            const saved = parsed.find((p: any) => p.id === ex.id);
            if (saved) {
              return {
                ...ex,
                isCompleted: !!saved.isCompleted,
                currentCode: saved.currentCode || ex.initialCode
              };
            }
            return ex;
          });
        });
      }
    } catch {
      // Ignorer
    }
  }
}
