import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface LogItem {
  id: number;
  text: string;
  type: 'info' | 'danger' | 'success';
}

@Component({
  selector: 'app-antipatterns-debug',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 07 · ANTI-PATRONS &amp; BONNES PRATIQUES</div>
        <h2>Anti-Patrons d'Héritage, Casse d'Invariants &amp; Piège du BaseComponent</h2>
        <p class="module-desc">
          L'héritage par pure paresse (<em>convenience inheritance</em>) viole l'encapsulation en exposant des méthodes destructrices (ex: <code>Pile extends Array</code>). Dans les frameworks modernes comme Angular, l'anti-patron <code>BaseComponent</code> transforme les composants en usines à gaz couplées à des dizaines de services inutiles. Découvrez comment la composition et l'injection ciblée restaurent l'élégance architecturale.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeTab() === 'stack'" (click)="activeTab.set('stack')">
          <span>💥 Anti-Patron 1 : Pile extends Array (Sabotage LIFO)</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeTab() === 'base-comp'" (click)="activeTab.set('base-comp')">
          <span>🏢 Anti-Patron 2 : Le Monstre BaseComponent Angular</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeTab() === 'lab'" (click)="activeTab.set('lab')">
          <span>💻 Atelier Monaco (Labo 5 · Anti-patrons &amp; Refactoring)</span>
        </button>
      </div>

      @if (activeTab() === 'stack') {
        <div class="stack-experiment-wrapper">
          <!-- EXPLICATION BANNER -->
          <div class="banner-box warning">
            <div class="banner-icon">⚠️</div>
            <div class="banner-content">
              <strong>Le Piège de l'Héritage d'Implémentation (*Convenience Inheritance*) :</strong>
              Hériter d'une classe riche (comme <code>Array</code>) pour réutiliser deux méthodes (<code>push</code>/<code>pop</code>) expose involontairement des dizaines de méthodes non désirées (<code>splice</code>, <code>sort</code>, <code>reverse</code>, <code>fill</code>...). La sous-classe ne peut plus garantir ses propres règles fondamentales (ses <em>invariants</em>).
            </div>
          </div>

          <div class="stack-dual-grid">
            <!-- PILE PAR HÉRITAGE (CATASTROPHE) -->
            <div class="stack-card bad">
              <div class="card-title-row">
                <div>
                  <span class="badge badge-danger">❌ HÉRITAGE : Pile&lt;T&gt; extends Array&lt;T&gt;</span>
                  <h3>La Pile Sabotable</h3>
                </div>
                <button class="btn-sm btn-ghost" (click)="resetBadStack()">Réinitialiser</button>
              </div>

              <div class="code-snippet bad-code">
                <code>class Pile&lt;T&gt; extends Array&lt;T&gt; &#123;
  empiler(e: T) &#123; this.push(e); &#125;
  depiler() &#123; return this.pop(); &#125;
&#125;
// 💥 Exposé publiquement : splice(), sort(), unshift(), shift()...</code>
              </div>

              <!-- VISUALISATION DE LA PILE -->
              <div class="stack-visual-zone">
                <div class="stack-visual-header">
                  <span>État interne du tableau (index 0 à {{ badStack().length - 1 }}) :</span>
                  <span class="counter-pill" [class.broken]="isBadLIFOViolated()">
                    {{ badStack().length }} éléments {{ isBadLIFOViolated() ? '· ⚠️ LIFO BRISÉ' : '· LIFO Respecté' }}
                  </span>
                </div>

                <div class="stack-tub-container">
                  <div class="stack-top-arrow">⬆ Sommet (LIFO)</div>
                  <div class="stack-elements-col">
                    @if (badStack().length === 0) {
                      <div class="empty-stack">Pile vide</div>
                    } @else {
                      @for (item of reversedBadStack(); track $index) {
                        <div class="stack-item" [class.tampered]="item.tampered">
                          <span class="item-idx">#{{ item.id }}</span>
                          <span class="item-val">{{ item.val }}</span>
                          @if (item.tampered) {
                            <span class="item-tampered-badge">Saboté</span>
                          }
                        </div>
                      }
                    }
                  </div>
                  <div class="stack-bottom-line">Base de la Pile</div>
                </div>
              </div>

              <!-- COMMANDES DE MANIPULATION -->
              <div class="actions-panel">
                <div class="actions-subtitle">Opérations Légitimes :</div>
                <div class="btn-row">
                  <button class="btn-act btn-primary" (click)="badPush()">
                    ➕ empiler({{ nextVal() }})
                  </button>
                  <button class="btn-act btn-secondary" (click)="badPop()" [disabled]="badStack().length === 0">
                    ➖ depiler()
                  </button>
                </div>

                <div class="actions-subtitle danger-sub">💥 Sabotages permis par l'héritage d'Array :</div>
                <div class="btn-row-grid">
                  <button class="btn-act btn-danger" (click)="badSplice()" [disabled]="badStack().length < 2">
                    ✂️ .splice(1, 1) <small>(Vol au milieu)</small>
                  </button>
                  <button class="btn-act btn-danger" (click)="badSort()" [disabled]="badStack().length < 2">
                    🔀 .sort() <small>(Casse l'ordre temporel)</small>
                  </button>
                  <button class="btn-act btn-danger" (click)="badUnshift()">
                    🚨 .unshift(999) <small>(Insertion sous la base)</small>
                  </button>
                </div>
              </div>
            </div>

            <!-- PILE PAR COMPOSITION (FORTERESSE) -->
            <div class="stack-card good">
              <div class="card-title-row">
                <div>
                  <span class="badge badge-success">✔ COMPOSITION : Pile&lt;T&gt; encapsule #elements</span>
                  <h3>La Forteresse Inviolable</h3>
                </div>
                <button class="btn-sm btn-ghost" (click)="resetGoodStack()">Réinitialiser</button>
              </div>

              <div class="code-snippet good-code">
                <code>class Pile&lt;T&gt; &#123;
  #elements: T[] = []; // Privé et hermétique
  empiler(e: T) &#123; this.#elements.push(e); &#125;
  depiler() &#123; return this.#elements.pop(); &#125;
  get sommet() &#123; return this.#elements.at(-1); &#125;
&#125;
// ✅ Strictement IMPOSSIBLE d'appeler splice() ou sort() !</code>
              </div>

              <!-- VISUALISATION DE LA PILE BONNE -->
              <div class="stack-visual-zone">
                <div class="stack-visual-header">
                  <span>Tableau privé et hermétique :</span>
                  <span class="counter-pill secure">
                    {{ goodStack().length }} éléments · Invariants Garantis
                  </span>
                </div>

                <div class="stack-tub-container good-tub">
                  <div class="stack-top-arrow secure-arrow">⬆ Sommet Hermétique</div>
                  <div class="stack-elements-col">
                    @if (goodStack().length === 0) {
                      <div class="empty-stack">Pile vide</div>
                    } @else {
                      @for (item of reversedGoodStack(); track $index) {
                        <div class="stack-item good-item">
                          <span class="item-idx">#{{ item.id }}</span>
                          <span class="item-val">{{ item.val }}</span>
                          <span class="item-secure-badge">Protégé</span>
                        </div>
                      }
                    }
                  </div>
                  <div class="stack-bottom-line">Base Sécurisée</div>
                </div>
              </div>

              <!-- COMMANDES DE MANIPULATION BONNE -->
              <div class="actions-panel">
                <div class="actions-subtitle">Opérations Légitimes :</div>
                <div class="btn-row">
                  <button class="btn-act btn-success" (click)="goodPush()">
                    ➕ empiler({{ nextVal() }})
                  </button>
                  <button class="btn-act btn-secondary" (click)="goodPop()" [disabled]="goodStack().length === 0">
                    ➖ depiler()
                  </button>
                </div>

                <div class="actions-subtitle secure-sub">🔒 Protection Absolue de l'Encapsulation :</div>
                <div class="btn-row-grid">
                  <button class="btn-act btn-locked" (click)="attemptIllegalOperation('splice')">
                    🚫 .splice() <small>(Erreur TS2339)</small>
                  </button>
                  <button class="btn-act btn-locked" (click)="attemptIllegalOperation('sort')">
                    🚫 .sort() <small>(Erreur TS2339)</small>
                  </button>
                  <button class="btn-act btn-locked" (click)="attemptIllegalOperation('unshift')">
                    🚫 .unshift() <small>(Erreur TS2339)</small>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- JOURNAL D'AUDIT EN DIRECT -->
          <div class="audit-log-card">
            <div class="audit-header">
              <div class="audit-title">
                <span class="live-indicator"></span>
                <h4>Journal d'audit de sécurité des Invariants</h4>
              </div>
              <button class="btn-sm btn-ghost" (click)="logs.set([])">Effacer le journal</button>
            </div>
            <div class="audit-logs-list">
              @if (logs().length === 0) {
                <div class="no-logs">Effectuez des opérations ci-dessus pour observer l'impact sur l'intégrité des structures.</div>
              } @else {
                @for (log of logs(); track log.id) {
                  <div class="log-row" [class.log-danger]="log.type === 'danger'" [class.log-success]="log.type === 'success'">
                    <span class="log-badge">{{ log.type === 'danger' ? 'ALERTE' : log.type === 'success' ? 'SÉCURISÉ' : 'INFO' }}</span>
                    <span class="log-text">{{ log.text }}</span>
                  </div>
                }
              }
            </div>
          </div>

          <!-- HISTORIQUE CULTURE POO -->
          <div class="history-callout">
            <div class="hist-icon">📜</div>
            <div class="hist-body">
              <strong>Le péché originel de Java (1995) : <code>java.util.Stack extends Vector</code></strong>
              <p>
                Dans la version 1.0 de Java, les architectes ont fait hériter la classe <code>Stack</code> de <code>Vector</code> (le tableau dynamique synchronisé de l'époque) par pure paresse de développement. Conséquence : n'importe quel développeur pouvait écrire <code>stack.insertElementAt("oops", 2)</code> ou <code>stack.clear()</code> sans dépiler ! Vingt-cinq ans plus tard, la documentation officielle d'Oracle recommande formellement de <strong>ne plus jamais utiliser Stack</strong> et de privilégier <code>Deque</code> par composition.
              </p>
            </div>
          </div>
        </div>
      }

      @if (activeTab() === 'base-comp') {
        <div class="base-comp-wrapper">
          <div class="banner-box danger-box">
            <div class="banner-icon">🚨</div>
            <div class="banner-content">
              <strong>L'Anti-Patron BaseComponent en Angular :</strong>
              Créer un <code>abstract class BaseComponent</code> pour y regrouper les services courants (Router, HttpClient, Alerts, AuthService...) crée un <strong>couplage titanesque</strong>. Tout composant dérivé hérite de toutes ces dépendances, alourdit son empreinte mémoire et transforme l'écriture des tests unitaires en enfer de mockings.
            </div>
          </div>

          <div class="scenario-selector">
            <span class="label">Cas d'étude : Un composant simple qui affiche le profil utilisateur</span>
            <div class="toggle-view-btns">
              <button class="view-btn" [class.active]="baseCompSubTab() === 'arch'" (click)="baseCompSubTab.set('arch')">
                🏛️ Architecture &amp; Dépendances
              </button>
              <button class="view-btn" [class.active]="baseCompSubTab() === 'test'" (click)="baseCompSubTab.set('test')">
                🧪 L'Enfer des Tests Unitaires (Mocks)
              </button>
            </div>
          </div>

          @if (baseCompSubTab() === 'arch') {
            <div class="comp-arch-grid">
              <!-- APPROCHE HÉRITAGE -->
              <div class="arch-card bad">
                <div class="arch-card-header">
                  <span class="badge badge-danger">❌ HÉRITAGE DU MONSTRE</span>
                  <h3>UserProfileComponent extends BaseComponent</h3>
                </div>

                <div class="dependency-cloud">
                  <div class="cloud-title">6 Dépendances lourdes héritées d'office :</div>
                  <div class="dep-tags-list">
                    <span class="dep-tag unused">Router <small>(inutilisé)</small></span>
                    <span class="dep-tag unused">HttpClient <small>(inutilisé)</small></span>
                    <span class="dep-tag used">AuthService <small>(utilisé)</small></span>
                    <span class="dep-tag unused">AlertService <small>(inutilisé)</small></span>
                    <span class="dep-tag unused">AnalyticsService <small>(inutilisé)</small></span>
                    <span class="dep-tag unused">StorageService <small>(inutilisé)</small></span>
                  </div>
                </div>

                <pre class="code-box"><code>// ❌ BaseComponent : Puits sans fond de dépendances
abstract class BaseComponent &#123;
  protected router = inject(Router);
  protected http = inject(HttpClient);
  protected auth = inject(AuthService);
  protected alert = inject(AlertService);
  protected analytics = inject(AnalyticsService);
  protected storage = inject(StorageService);
&#125;

// Le composant enfant subit tout le fardeau :
@Component(&#123; ... &#125;)
export class UserProfileComponent extends BaseComponent &#123;
  // Il ne voulait qu'afficher le nom de l'utilisateur connecté !
  userName = computed(() =&gt; this.auth.currentUser()?.name);
&#125;</code></pre>

                <div class="drawback-list">
                  <div class="drawback-item">⚠️ <strong>Viol du principe ISP :</strong> Dépend de 5 interfaces dont il n'a que faire.</div>
                  <div class="drawback-item">⚠️ <strong>Fragilité maximale :</strong> Modifier BaseComponent peut casser 40 composants de l'app.</div>
                  <div class="drawback-item">⚠️ <strong>Arbre d'injection pollué :</strong> Angular instancie ou résout des tokens superflus.</div>
                </div>
              </div>

              <!-- APPROCHE MODERNE PAR COMPOSITION & INJECTION CIBLÉE -->
              <div class="arch-card good">
                <div class="arch-card-header">
                  <span class="badge badge-success">✔ COMPOSITION MODERNE (ANGULAR STANDALONE)</span>
                  <h3>UserProfileComponent Autonome &amp; Épuré</h3>
                </div>

                <div class="dependency-cloud secure-cloud">
                  <div class="cloud-title">1 seule dépendance ciblée (ou zéro avec input) :</div>
                  <div class="dep-tags-list">
                    <span class="dep-tag needed">AuthService <small>(strictement nécessaire)</small></span>
                  </div>
                </div>

                <pre class="code-box"><code>// ✅ Composant moderne Standalone : ZÉRO HÉRITAGE
@Component(&#123;
  selector: 'app-user-profile',
  standalone: true,
  template: \`&lt;h3&gt;{{ '{{' }} userName() {{ '}}' }}&lt;/h3&gt;\`
&#125;)
export class UserProfileComponent &#123;
  // N'injecte STRICTEMENT QUE ce dont il a besoin :
  private auth = inject(AuthService);
  userName = computed(() =&gt; this.auth.currentUser()?.name);
&#125;

// Alternative encore plus pure :
// export class UserProfileComponent &#123;
//   userName = input.required&lt;string&gt;();
// &#125;</code></pre>

                <div class="advantage-list">
                  <div class="adv-item">✔ <strong>Découplage total :</strong> Le composant est indépendant et ultra-portable.</div>
                  <div class="adv-item">✔ <strong>Tree-shaking optimal :</strong> Aucun import fantôme embarqué dans le bundle.</div>
                  <div class="adv-item">✔ <strong>Test unitaire instantané :</strong> 1 seul mock requis pour tester le composant !</div>
                </div>
              </div>
            </div>
          }

          @if (baseCompSubTab() === 'test') {
            <div class="test-comparison-view">
              <div class="test-view-header">
                <h3>Comparatif : Écrire le test unitaire de <code>UserProfileComponent</code></h3>
                <p>Mesurez la différence de charge mentale et de code technique entre les deux architectures.</p>
              </div>

              <div class="test-grid">
                <!-- TEST AVEC BASECOMPONENT -->
                <div class="test-col bad-test">
                  <div class="test-badge red">❌ 48 LIGNES DE MOCKS BOILERPLATE</div>
                  <h4>Test avec BaseComponent</h4>
                  <pre class="code-box small-code"><code>describe('UserProfileComponent (Héritage)', () =&gt; &#123;
  let component: UserProfileComponent;

  beforeEach(async () =&gt; &#123;
    // 💥 OBLIGÉ de mocker tous les services de BaseComponent,
    // même ceux que ce composant n'appelle JAMAIS !
    await TestBed.configureTestingModule(&#123;
      imports: [UserProfileComponent],
      providers: [
        &#123; provide: Router, useValue: &#123; navigate: vi.fn() &#125; &#125;,
        &#123; provide: HttpClient, useValue: &#123; get: vi.fn() &#125; &#125;,
        &#123; provide: AlertService, useValue: &#123; show: vi.fn() &#125; &#125;,
        &#123; provide: AnalyticsService, useValue: &#123; track: vi.fn() &#125; &#125;,
        &#123; provide: StorageService, useValue: &#123; get: vi.fn() &#125; &#125;,
        &#123; provide: AuthService, useValue: &#123;
            currentUser: signal(&#123; name: 'Alice' &#125;)
          &#125;
        &#125;
      ]
    &#125;).compileComponents();
  &#125;);

  it('affiche le nom d\\'Alice', () =&gt; &#123;
    expect(component.userName()).toBe('Alice');
  &#125;);
&#125;);</code></pre>
                  <div class="verdict-strip red">
                    90% du test est du bruit inutile pour satisfaire la classe mère.
                  </div>
                </div>

                <!-- TEST AVEC COMPOSITION -->
                <div class="test-col good-test">
                  <div class="test-badge green">✔ 12 LIGNES DE CODE ÉPURÉ</div>
                  <h4>Test avec Injection Ciblée / Composition</h4>
                  <pre class="code-box small-code"><code>describe('UserProfileComponent (Standalone)', () =&gt; &#123;
  it('affiche le nom d\\'Alice', async () =&gt; &#123;
    // ✅ Seul le service nécessaire est mocké !
    const mockAuth = &#123; currentUser: signal(&#123; name: 'Alice' &#125;) &#125;;

    await TestBed.configureTestingModule(&#123;
      imports: [UserProfileComponent],
      providers: [
        &#123; provide: AuthService, useValue: mockAuth &#125;
      ]
    &#125;).compileComponents();

    const fixture = TestBed.createComponent(UserProfileComponent);
    expect(fixture.componentInstance.userName()).toBe('Alice');
  &#125;);
&#125;);</code></pre>
                  <div class="verdict-strip green">
                    Test limpide, résilient aux refactorings et exécuté en 2 millisecondes.
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (activeTab() === 'lab') {
        <app-lab-runner [labNumber]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .module-container {
      max-width: 1200px;
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
        color: #ef4444;
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

        code {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
      }
    }

    .section-mode-tabs {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      .mode-tab-btn {
        padding: 0.75rem 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--surface-card);
        color: var(--text-muted);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
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

    .banner-box {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      align-items: flex-start;

      &.warning {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: var(--text-body);
      }

      &.danger-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: var(--text-body);
      }

      .banner-icon {
        font-size: 1.5rem;
        line-height: 1;
      }

      .banner-content {
        font-size: 0.9rem;
        line-height: 1.5;

        strong {
          display: block;
          margin-bottom: 0.25rem;
          color: var(--text-heading);
        }

        code {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
      }
    }

    .stack-experiment-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stack-dual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .stack-card {
      background: var(--surface-card);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border: 2px solid transparent;

      &.bad {
        border-color: rgba(239, 68, 68, 0.3);
      }

      &.good {
        border-color: rgba(16, 185, 129, 0.3);
      }

      .card-title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        h3 {
          margin: 0.35rem 0 0 0;
          font-size: 1.25rem;
          color: var(--text-heading);
        }
      }
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      letter-spacing: 0.05em;

      &.badge-danger {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }

      &.badge-success {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
    }

    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 0.4rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;

      &.btn-ghost {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-muted);
        border: 1px solid var(--border-color);

        &:hover {
          color: var(--text-heading);
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .code-snippet {
      padding: 0.85rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.78rem;
      line-height: 1.45;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      overflow-x: auto;
      white-space: pre-wrap;

      &.bad-code {
        background: rgba(239, 68, 68, 0.07);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: #f87171;
      }

      &.good-code {
        background: rgba(16, 185, 129, 0.07);
        border: 1px solid rgba(16, 185, 129, 0.2);
        color: #34d399;
      }
    }

    .stack-visual-zone {
      background: var(--surface-bg);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .stack-visual-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .counter-pill {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.15rem 0.5rem;
        border-radius: 1rem;
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;

        &.broken {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        &.secure {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
      }
    }

    .stack-tub-container {
      border: 2px dashed rgba(239, 68, 68, 0.35);
      border-top: none;
      border-radius: 0 0 0.75rem 0.75rem;
      padding: 1rem 1rem 0.5rem 1rem;
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      background: rgba(0, 0, 0, 0.15);

      &.good-tub {
        border-color: rgba(16, 185, 129, 0.35);
      }

      .stack-top-arrow {
        font-size: 0.7rem;
        font-weight: 700;
        color: #f87171;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;

        &.secure-arrow {
          color: #34d399;
        }
      }

      .stack-elements-col {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .empty-stack {
        text-align: center;
        font-size: 0.85rem;
        color: var(--text-muted);
        padding: 1.5rem;
        font-style: italic;
      }

      .stack-item {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 0.4rem;
        padding: 0.4rem 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: monospace;
        font-weight: 600;
        font-size: 0.85rem;
        color: #e2e8f0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: dropIn 0.2s ease-out;

        &.tampered {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        &.good-item {
          border-color: #059669;
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
        }

        .item-idx {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .item-tampered-badge {
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 0.2rem;
          font-weight: 700;
        }

        .item-secure-badge {
          background: #059669;
          color: #ffffff;
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 0.2rem;
          font-weight: 700;
        }
      }

      .stack-bottom-line {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-top: 0.5rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
    }

    @keyframes dropIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .actions-panel {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      .actions-subtitle {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;

        &.danger-sub {
          color: #ef4444;
          margin-top: 0.4rem;
        }

        &.secure-sub {
          color: #10b981;
          margin-top: 0.4rem;
        }
      }

      .btn-row {
        display: flex;
        gap: 0.5rem;
      }

      .btn-row-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 0.5rem;
      }

      .btn-act {
        padding: 0.55rem 0.75rem;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 0.5rem;
        cursor: pointer;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        transition: all 0.2s;

        small {
          font-size: 0.65rem;
          opacity: 0.85;
          font-weight: normal;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        &.btn-primary {
          background: #4f46e5;
          color: #ffffff;
          &:hover:not(:disabled) { background: #4338ca; }
        }

        &.btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-heading);
          &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.15); }
        }

        &.btn-success {
          background: #059669;
          color: #ffffff;
          &:hover:not(:disabled) { background: #047857; }
        }

        &.btn-danger {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          &:hover:not(:disabled) { background: #ef4444; color: #ffffff; }
        }

        &.btn-locked {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
          cursor: help;
          &:hover {
            border-color: #10b981;
            color: #34d399;
          }
        }
      }
    }

    .audit-log-card {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .audit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .audit-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          h4 {
            margin: 0;
            font-size: 0.95rem;
            color: var(--text-heading);
          }

          .live-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 8px #10b981;
          }
        }
      }

      .audit-logs-list {
        max-height: 180px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .no-logs {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0.5rem 0;
        }

        .log-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: monospace;
          font-size: 0.8rem;
          padding: 0.35rem 0.6rem;
          border-radius: 0.35rem;
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-body);

          &.log-danger {
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            .log-badge { background: #ef4444; color: #ffffff; }
          }

          &.log-success {
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
            .log-badge { background: #10b981; color: #ffffff; }
          }

          .log-badge {
            font-size: 0.65rem;
            font-weight: 700;
            padding: 0.1rem 0.35rem;
            border-radius: 0.2rem;
            background: #64748b;
            color: #ffffff;
          }

          .log-text {
            flex: 1;
          }
        }
      }
    }

    .history-callout {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);

      .hist-icon {
        font-size: 1.5rem;
      }

      .hist-body {
        font-size: 0.85rem;
        line-height: 1.55;
        color: var(--text-body);

        strong {
          color: #818cf8;
          display: block;
          margin-bottom: 0.3rem;
        }

        p { margin: 0; }
      }
    }

    .base-comp-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .scenario-selector {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface-card);
      padding: 0.85rem 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);

      .label {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--text-heading);
      }

      .toggle-view-btns {
        display: flex;
        gap: 0.5rem;

        .view-btn {
          padding: 0.4rem 0.85rem;
          border-radius: 0.4rem;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;

          &.active {
            background: #4f46e5;
            color: #ffffff;
            border-color: #6366f1;
          }
        }
      }
    }

    .comp-arch-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .arch-card {
      background: var(--surface-card);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border: 2px solid transparent;

      &.bad { border-color: rgba(239, 68, 68, 0.3); }
      &.good { border-color: rgba(16, 185, 129, 0.3); }

      .arch-card-header {
        h3 {
          margin: 0.35rem 0 0 0;
          font-size: 1.15rem;
          color: var(--text-heading);
        }
      }
    }

    .dependency-cloud {
      background: rgba(0, 0, 0, 0.2);
      border: 1px dashed rgba(239, 68, 68, 0.4);
      border-radius: 0.6rem;
      padding: 0.85rem;

      &.secure-cloud {
        border-color: rgba(16, 185, 129, 0.4);
      }

      .cloud-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
      }

      .dep-tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;

        .dep-tag {
          font-family: monospace;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 0.3rem;

          &.unused {
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
          }

          &.used {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          &.needed {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
        }
      }
    }

    .code-box {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 0.85rem;
      font-size: 0.78rem;
      line-height: 1.45;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      color: #cbd5e1;
      overflow-x: auto;

      &.small-code {
        font-size: 0.72rem;
      }
    }

    .drawback-list, .advantage-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: var(--text-muted);

      strong {
        color: var(--text-heading);
      }
    }

    .test-comparison-view {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .test-view-header {
        background: var(--surface-card);
        padding: 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);

        h3 {
          margin: 0 0 0.35rem 0;
          font-size: 1.2rem;
          color: var(--text-heading);
        }

        p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      }
    }

    .test-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .test-col {
      background: var(--surface-card);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      border: 1px solid var(--border-color);

      &.bad-test { border-top: 4px solid #ef4444; }
      &.good-test { border-top: 4px solid #10b981; }

      .test-badge {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 0.3rem;
        width: fit-content;

        &.red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        &.green { background: rgba(16, 185, 129, 0.15); color: #10b981; }
      }

      h4 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-heading);
      }
    }

    .verdict-strip {
      padding: 0.65rem 0.85rem;
      border-radius: 0.4rem;
      font-size: 0.78rem;
      font-weight: 600;

      &.red {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      &.green {
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.2);
      }
    }
  `]
})
export class AntipatternsDebugComponent {
  activeTab = signal<'stack' | 'base-comp' | 'lab'>('stack');
  baseCompSubTab = signal<'arch' | 'test'>('arch');

  badStack = signal<{ id: number; val: number; tampered?: boolean }[]>([
    { id: 1, val: 10 },
    { id: 2, val: 25 },
    { id: 3, val: 40 }
  ]);
  isBadLIFOViolated = signal<boolean>(false);

  goodStack = signal<{ id: number; val: number }[]>([
    { id: 1, val: 10 },
    { id: 2, val: 25 },
    { id: 3, val: 40 }
  ]);

  counter = 4;
  logs = signal<LogItem[]>([
    { id: 1, text: 'Initialisation des deux piles avec [10, 25, 40].', type: 'info' }
  ]);

  nextVal(): number {
    return this.counter * 15;
  }

  reversedBadStack() {
    return [...this.badStack()].reverse();
  }

  reversedGoodStack() {
    return [...this.goodStack()].reverse();
  }

  badPush() {
    const val = this.nextVal();
    const item = { id: this.counter++, val };
    this.badStack.update(s => [...s, item]);
    this.addLog(`empiler(${val}) exécuté normalement via Array.push().`, 'info');
  }

  badPop() {
    const s = this.badStack();
    if (s.length === 0) return;
    const popped = s[s.length - 1];
    this.badStack.set(s.slice(0, -1));
    this.addLog(`depiler() -> ${popped.val} dépilé normalement depuis le sommet.`, 'info');
  }

  badSplice() {
    const s = [...this.badStack()];
    if (s.length < 2) return;
    const removed = s.splice(1, 1)[0];
    this.badStack.set(s);
    this.isBadLIFOViolated.set(true);
    this.addLog(`💥 CATASTROPHE : .splice(1, 1) a dérobé l'élément ${removed.val} au beau milieu de la pile ! L'invariant LIFO est détruit !`, 'danger');
  }

  badSort() {
    const s = [...this.badStack()];
    if (s.length < 2) return;
    s.sort((a, b) => b.val - a.val);
    s.forEach(item => item.tampered = true);
    this.badStack.set(s);
    this.isBadLIFOViolated.set(true);
    this.addLog(`💥 CATASTROPHE : .sort() a trié le tableau en mémoire ! L'ordre chronologique d'insertion (LIFO) a été irrémédiablement anéanti !`, 'danger');
  }

  badUnshift() {
    const val = 999;
    const item = { id: this.counter++, val, tampered: true };
    this.badStack.update(s => [item, ...s]);
    this.isBadLIFOViolated.set(true);
    this.addLog(`💥 CATASTROPHE : .unshift(999) a injecté une valeur directement sous la base de la pile ! Impossible avec une vraie pile !`, 'danger');
  }

  resetBadStack() {
    this.counter = 4;
    this.badStack.set([
      { id: 1, val: 10 },
      { id: 2, val: 25 },
      { id: 3, val: 40 }
    ]);
    this.isBadLIFOViolated.set(false);
    this.addLog('Pile par héritage réinitialisée.', 'info');
  }

  goodPush() {
    const val = this.nextVal();
    const item = { id: this.counter++, val };
    this.goodStack.update(s => [...s, item]);
    this.addLog(`empiler(${val}) exécuté de manière sécurisée dans le tableau privé #elements.`, 'success');
  }

  goodPop() {
    const s = this.goodStack();
    if (s.length === 0) return;
    const popped = s[s.length - 1];
    this.goodStack.set(s.slice(0, -1));
    this.addLog(`depiler() -> ${popped.val} dépilé du sommet privé.`, 'success');
  }

  attemptIllegalOperation(op: string) {
    this.addLog(`🔒 OPÉRATION REJETÉE PAR TYPESCRIPT : La méthode '.${op}()' n'existe pas sur le type 'Pile<T>'. L'encapsulation privée a bloqué le piratage !`, 'success');
  }

  resetGoodStack() {
    this.goodStack.set([
      { id: 1, val: 10 },
      { id: 2, val: 25 },
      { id: 3, val: 40 }
    ]);
    this.addLog('Pile par composition réinitialisée avec succès.', 'info');
  }

  private addLog(text: string, type: 'info' | 'danger' | 'success') {
    this.logs.update(list => [{ id: Date.now(), text, type }, ...list.slice(0, 9)]);
  }
}
