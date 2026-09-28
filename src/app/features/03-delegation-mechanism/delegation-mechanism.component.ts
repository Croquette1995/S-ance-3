import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-delegation-mechanism',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 03 · LE MOTEUR DE LA COMPOSITION</div>
        <h2>Le Cœur de la Composition : Mécanisme &amp; Délégation</h2>
        <p class="module-desc">
          La <strong>délégation</strong> est l'acte par lequel un objet composite, recevant une demande de travail, transmet l'ordre à un collaborateur interne compétent au lieu de réinventer la roue lui-même. C'est le principe du chef d'entreprise qui confie la livraison au service logistique.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>⚙️ Animation du Flux &amp; Les 3 Vertus</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- ANIMATION PAS-À-PAS DU FLUX DE DÉLÉGATION -->
        <div class="card-panel delegation-card">
          <div class="del-header">
            <div>
              <h3>Animation Pas-à-Pas : Le Voyage d'un Ordre par Délégation</h3>
              <p class="del-sub">Observez comment l'appel traverse la frontière de l'objet sans couplage fort.</p>
            </div>
            <div class="step-indicator">
              Étape {{ currentStep() }} / 4
            </div>
          </div>

          <!-- Piste visuelle des 3 acteurs -->
          <div class="flow-track">
            <!-- Acteur 1 : Le Client -->
            <div class="actor-node" [class.active]="currentStep() === 1">
              <div class="actor-avatar">👤</div>
              <div class="actor-name">Client Externe</div>
              <div class="actor-role">Donne l'ordre de haut niveau</div>
              <div class="code-bubble" [class.visible]="currentStep() === 1">
                <code>maVoiture.rouler()</code>
              </div>
            </div>

            <!-- Flèche 1 -> 2 -->
            <div class="flow-arrow" [class.active]="currentStep() >= 2">
              <div class="pulse-line"></div>
              <span class="arrow-label">Appel de méthode</span>
            </div>

            <!-- Acteur 2 : L'Objet Composite (Voiture) -->
            <div class="actor-node composite-node" [class.active]="currentStep() === 2 || currentStep() === 3">
              <div class="actor-avatar">🚗</div>
              <div class="actor-name">Voiture (Composite)</div>
              <div class="actor-role">« A-un » Moteur stocké en privé</div>
              <div class="code-bubble" [class.visible]="currentStep() === 2">
                <code>rouler() &#123; ... &#125;</code>
              </div>
              <div class="code-bubble delegate" [class.visible]="currentStep() === 3">
                <code>this.moteur.demarrer()</code>
              </div>
            </div>

            <!-- Flèche 2 -> 3 -->
            <div class="flow-arrow" [class.active]="currentStep() >= 3">
              <div class="pulse-line"></div>
              <span class="arrow-label">Délégation interne</span>
            </div>

            <!-- Acteur 3 : Le Collaborateur Interne (Moteur) -->
            <div class="actor-node engine-node" [class.active]="currentStep() === 4">
              <div class="actor-avatar">⚙️</div>
              <div class="actor-name">Moteur (Spécialiste)</div>
              <div class="actor-role">Exécute le travail physique</div>
              <div class="code-bubble result" [class.visible]="currentStep() === 4">
                <code>"Vroum 300 CV !"</code>
              </div>
            </div>
          </div>

          <!-- Explication de l'étape active -->
          <div class="step-explanation-box">
            <div class="step-title">
              @switch (currentStep()) {
                @case (1) { 1. Le Client envoie la requête à l'objet composite }
                @case (2) { 2. La Voiture intercepte l'intention de haut niveau }
                @case (3) { 3. La Voiture transmet immédiatement l'exécution à son moteur privé }
                @case (4) { 4. Le Moteur accomplit la tâche et renvoie le résultat }
              }
            </div>
            <p class="step-desc">
              @switch (currentStep()) {
                @case (1) {
                  Le code appelant veut faire avancer le véhicule. Il ne manipule ni les pistons, ni les soupapes, ni le circuit d'injection. Il appelle simplement la méthode publique <code>rouler()</code>.
                }
                @case (2) {
                  La classe <code>Voiture</code> ne sait pas et ne doit pas savoir comment fonctionne la thermodynamique d'un moteur thermique ou le stator d'un moteur électrique.
                }
                @case (3) {
                  Au lieu de coder 200 lignes de mécanique dans <code>Voiture</code>, celle-ci exécute une seule ligne de code : <code>return this.moteur.demarrer();</code>. C'est la délégation pure.
                }
                @case (4) {
                  L'objet <code>moteur</code> génère le couple et retourne la confirmation. Si demain on change la technologie du moteur, la classe <code>Voiture</code> reste totalement intacte !
                }
              }
            </p>
          </div>

          <!-- Contrôles du lecteur d'animation -->
          <div class="stepper-controls">
            <button class="btn-secondary" [disabled]="currentStep() === 1" (click)="prevStep()">◀ Étape précédente</button>
            <button class="btn-secondary" (click)="resetStep()">↺ Début</button>
            <button class="btn-primary" [disabled]="currentStep() === 4" (click)="nextStep()">Étape suivante ▶</button>
          </div>
        </div>

        <!-- LES 3 VERTUS FONDAMENTALES -->
        <div class="card-panel virtues-card">
          <div class="virtues-header">
            <h3>Les 3 Vertus Cardinales de la Délégation</h3>
            <span class="badge badge-success">Bénéfices d'Ingénierie Logicielle</span>
          </div>

          <div class="virtues-grid">
            <!-- Vertu 1 -->
            <div class="virtue-box">
              <div class="v-icon">🎯</div>
              <h4>1. Spécialisation (SRP)</h4>
              <p>Chaque classe se concentre sur son unique responsabilité : <code>Moteur</code> gère le couple et le carburant, <code>Voiture</code> gère le châssis et l'odomètre.</p>
              <div class="v-tag">Principe de Responsabilité Unique</div>
            </div>

            <!-- Vertu 2 -->
            <div class="virtue-box">
              <div class="v-icon">📦</div>
              <h4>2. Cloisonnement (Boîte Noire)</h4>
              <p>L'état interne du composant est strictement protégé sous le capot. Aucun couplage fragile : les modifications internes ne fuient pas vers l'extérieur.</p>
              <div class="v-tag">Encapsulation Parfaite</div>
            </div>

            <!-- Vertu 3 -->
            <div class="virtue-box">
              <div class="v-icon">🔄</div>
              <h4>3. Réutilisabilité Transversale</h4>
              <p>Le même <code>MoteurV8</code> peut équiper sans aucune modification une <code>Voiture</code>, un <code>Bateau</code> de course ou un <code>GenerateurSecours</code> !</p>
              <div class="v-tag">Zéro Duplication</div>
            </div>
          </div>

          <!-- Démonstrateur interactif de réutilisation transversale -->
          <div class="cross-reuse-workbench">
            <div class="reuse-title">Démonstration de la vertu n°3 : le même Moteur équipe différents hôtes :</div>
            <div class="host-selector">
              <button 
                class="host-btn" 
                [class.active]="selectedHost() === 'voiture'"
                (click)="selectedHost.set('voiture')"
              >
                🚗 Voiture de Sport
              </button>
              <button 
                class="host-btn" 
                [class.active]="selectedHost() === 'bateau'"
                (click)="selectedHost.set('bateau')"
              >
                🚤 Bateau Hors-Bord
              </button>
              <button 
                class="host-btn" 
                [class.active]="selectedHost() === 'generateur'"
                (click)="selectedHost.set('generateur')"
              >
                ⚡ Générateur de Secours
              </button>
            </div>

            <div class="host-preview">
              <div class="host-code">
                <pre><code>// Le composant unique :
const moteurV8 = new MoteurV8(450);

// Assemblé dans l'hôte choisi :
@switch (selectedHost()) {
  @case ('voiture') {
const bolide = new Voiture("Ferrari", moteurV8);
bolide.rouler(); // -> V8 rugit sur l'asphalte !
  }
  @case ('bateau') {
const zodiac = new Bateau("Riva", moteurV8);
zodiac.naviguer(); // -> V8 fend les vagues à 60 nœuds !
  }
  @case ('generateur') {
const secours = new Generateur("Hôpital", moteurV8);
secours.produireCourant(); // -> V8 alimente les blocs opératoires !
  }
}</code></pre>
              </div>
              <div class="host-verdict">
                <div class="verdict-icon">💡</div>
                <p>
                  Avec l'héritage classique, pour réutiliser <code>Moteur</code>, il aurait fallu faire <code>class Bateau extends Moteur</code> (absurde) ou hériter d'une classe mère commune hybride. Avec la composition, <strong>le même objet moteur sert partout sans lien de parenté forcé !</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .delegation-card, .virtues-card {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .del-header, .virtues-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .del-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 2px;
      }
    }

    .step-indicator {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--ts-blue-light);
    }

    /* Flow Track */
    .flow-track {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 30px 24px;
      position: relative;
    }

    .actor-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 170px;
      padding: 16px 12px;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      position: relative;
      transition: all 0.25s ease;

      .actor-avatar {
        font-size: 2.2rem;
        margin-bottom: 6px;
      }

      .actor-name {
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .actor-role {
        font-size: 0.72rem;
        color: var(--text-muted);
        margin-top: 4px;
        line-height: 1.3;
      }

      &.active {
        border-color: #3b82f6;
        box-shadow: 0 0 16px rgba(59, 130, 246, 0.35);
        transform: translateY(-4px);
      }

      &.composite-node.active {
        border-color: #10b981;
        box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
      }

      &.engine-node.active {
        border-color: #f59e0b;
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
      }
    }

    .code-bubble {
      position: absolute;
      top: -24px;
      background: #1e293b;
      color: #38bdf8;
      font-size: 0.72rem;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #3b82f6;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(6px);
      transition: all 0.25s;

      &.visible {
        opacity: 1;
        transform: translateY(0);
      }

      &.delegate {
        top: -46px;
        border-color: #10b981;
        color: #34d399;
      }

      &.result {
        border-color: #f59e0b;
        color: #fbbf24;
      }
    }

    .flow-arrow {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      opacity: 0.35;
      transition: opacity 0.25s;

      &.active {
        opacity: 1;
      }

      .pulse-line {
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        border-radius: 2px;
      }

      .arrow-label {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }
    }

    .step-explanation-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px 20px;

      .step-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 6px;
      }

      .step-desc {
        font-size: 0.88rem;
        line-height: 1.5;
        color: var(--text-muted);
      }
    }

    .stepper-controls {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    /* Virtues */
    .virtues-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .virtue-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .v-icon {
        font-size: 1.8rem;
      }

      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        line-height: 1.45;
        color: var(--text-muted);
        flex: 1;
      }

      .v-tag {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--ts-blue-light);
        margin-top: 4px;
      }
    }

    .cross-reuse-workbench {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .reuse-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .host-selector {
      display: flex;
      gap: 10px;

      .host-btn {
        flex: 1;
        padding: 8px 14px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-muted);
        font-size: 0.85rem;
        font-weight: 600;

        &.active {
          background: #10b981;
          color: #ffffff;
          border-color: #059669;
        }
      }
    }

    .host-preview {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;

      .host-code {
        background: var(--bg-code);
        border-radius: 6px;
        padding: 12px;
        overflow-x: auto;

        pre {
          margin: 0;
          font-size: 0.78rem;
          color: #e2e8f0;
        }
      }

      .host-verdict {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 14px;
        display: flex;
        gap: 12px;
        align-items: flex-start;

        .verdict-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        p {
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--text-muted);
        }
      }
    }
  `]
})
export class DelegationMechanismComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly currentStep = signal<number>(1);
  readonly selectedHost = signal<'voiture' | 'bateau' | 'generateur'>('voiture');

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  resetStep(): void {
    this.currentStep.set(1);
  }
}
