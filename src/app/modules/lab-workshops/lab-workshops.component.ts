import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import loader from '@monaco-editor/loader';
import { AppStateService } from '../../services/app-state.service';

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  instructions: string[];
  initialTs: string;
  initialHtml: string;
  initialCss: string;
  solutionTs: string;
  solutionHtml: string;
  solutionCss: string;
  validateFn: (ts: string, html: string, css: string) => { valid: boolean; feedback: string };
}

@Component({
  selector: 'app-lab-workshops',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './lab-workshops.component.html',
  styleUrl: './lab-workshops.component.css'
})
export class LabWorkshopsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;

  readonly appState = inject(AppStateService);
  private editorInstance: any = null;

  activeTab = signal<'ts' | 'html' | 'css'>('ts');
  selectedWorkshopId = signal<string>('3.1');
  validationResult = signal<{ tested: boolean; valid: boolean; feedback: string }>({
    tested: false,
    valid: false,
    feedback: ''
  });
  showSolution = signal<boolean>(false);

  // Workshop 3.2 Live Simulation Counter
  labCounter = signal<number>(0);

  // Workshop Code Cache
  codeStore = signal<Record<string, { ts: string; html: string; css: string }>>({});

  readonly workshops: Workshop[] = [
    {
      id: '3.1',
      title: 'Atelier 3.1 — Déclaration & Interpolation',
      subtitle: 'Ajout de propriétés TypeScript et injection {{ }} dans le template HTML',
      instructions: [
        'Dans le code TypeScript, ajoutez la propriété studentName = "Jean Dupont" (ou votre nom).',
        'Ajoutez la propriété academicYear = "2025-2026".',
        'Dans le template HTML, utilisez l\'interpolation {{ studentName }} et {{ academicYear }} pour afficher ces données.'
      ],
      initialTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  courseName = 'Programmation Orientée Objet';
  // TODO: Ajoutez studentName et academicYear ici
}`,
      initialHtml: `<div class="card p-3">
  <h2>{{ courseName }}</h2>
  <!-- TODO: Affichez l'étudiant et l'année académique ici -->
</div>`,
      initialCss: `.card { border-left: 4px solid #dd0031; }`,
      solutionTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  courseName = 'Programmation Orientée Objet';
  studentName = 'Jean Dupont';
  academicYear = '2025-2026';
}`,
      solutionHtml: `<div class="card p-3">
  <h2>{{ courseName }}</h2>
  <p>Étudiant : <strong>{{ studentName }}</strong> (Année {{ academicYear }})</p>
</div>`,
      solutionCss: `.card { border-left: 4px solid #dd0031; }`,
      validateFn: (ts, html, css) => {
        const hasStudentNameTS = /studentName\s*[:=]/i.test(ts);
        const hasAcademicYearTS = /academicYear\s*[:=]/i.test(ts);
        const hasStudentNameHTML = /\{\{\s*studentName(\(\))?\s*\}\}/.test(html);
        const hasAcademicYearHTML = /\{\{\s*academicYear(\(\))?\s*\}\}/.test(html);

        if (!hasStudentNameTS) return { valid: false, feedback: 'La propriété "studentName" est absente de la classe TypeScript.' };
        if (!hasAcademicYearTS) return { valid: false, feedback: 'La propriété "academicYear" est absente de la classe TypeScript.' };
        if (!hasStudentNameHTML) return { valid: false, feedback: 'L\'interpolation {{ studentName }} est absente du template HTML.' };
        if (!hasAcademicYearHTML) return { valid: false, feedback: 'L\'interpolation {{ academicYear }} est absente du template HTML.' };

        return { valid: true, feedback: 'Félicitations ! Vos déclarations et interpolations sont parfaitement conformes.' };
      }
    },

    {
      id: '3.2',
      title: 'Atelier 3.2 — Compteur & Property Binding',
      subtitle: 'Gestion d\'événements, incrémentation et désactivation conditionnelle [disabled]',
      instructions: [
        'Dans la classe TS, déclarez clickCount = 0.',
        'Ajoutez les méthodes increment() { this.clickCount++; } et resetCounter() { this.clickCount = 0; }.',
        'Dans le HTML, liez les clics des boutons (click)="increment()" et (click)="resetCounter()".',
        'Désactivez le bouton réinitialiser via le property binding [disabled]="clickCount === 0".'
      ],
      initialTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  // TODO: Ajoutez clickCount, increment() et resetCounter()
}`,
      initialHtml: `<div class="card p-3">
  <h3>Nombre de clics : <!-- TODO: {{ clickCount }} --></h3>
  <button class="btn btn-success">Compter</button>
  <button class="btn btn-secondary">Réinitialiser</button>
</div>`,
      initialCss: `button { margin-right: 8px; }`,
      solutionTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  clickCount = 0;

  increment() {
    this.clickCount++;
  }

  resetCounter() {
    this.clickCount = 0;
  }
}`,
      solutionHtml: `<div class="card p-3">
  <h3>Nombre de clics : {{ clickCount }}</h3>
  <button class="btn btn-success" (click)="increment()">Compter</button>
  <button class="btn btn-secondary" (click)="resetCounter()" [disabled]="clickCount === 0">Réinitialiser</button>
</div>`,
      solutionCss: `button { margin-right: 8px; }`,
      validateFn: (ts, html, css) => {
        const hasClickCount = /clickCount\s*[:=]/i.test(ts);
        const hasIncrement = /increment\s*\(\)/.test(ts);
        const hasReset = /resetCounter\s*\(\)/.test(ts);
        const hasDisabledBinding = /\[disabled\]\s*=\s*"[^"]*clickCount(\(\))?\s*===\s*0[^"]*"/.test(html) || /\[disabled\]\s*=\s*"[^"]*!clickCount[^"]*"/.test(html);
        const hasClickBinding = /\(click\)\s*=\s*"increment\(\)"/.test(html);

        if (!hasClickCount) return { valid: false, feedback: 'La propriété "clickCount" est absente du TypeScript.' };
        if (!hasIncrement || !hasReset) return { valid: false, feedback: 'Les méthodes increment() et resetCounter() doivent être définies.' };
        if (!hasClickBinding) return { valid: false, feedback: 'Lien d\'événement (click)="increment()" manquant sur le bouton.' };
        if (!hasDisabledBinding) return { valid: false, feedback: 'Liaison de propriété [disabled]="clickCount === 0" manquante.' };

        return { valid: true, feedback: 'Bravo ! Votre compteur interactif avec Property Binding fonctionne parfaitement.' };
      }
    },

    {
      id: '3.3',
      title: 'Atelier 3.3 — Composant Standalone & Imbrication',
      subtitle: 'Déclaration de HeaderComponent dans les imports et intégration du sélecteur <app-header>',
      instructions: [
        'Importez HeaderComponent dans le tableau imports: [HeaderComponent] du décorateur @Component.',
        'Ajoutez la balise du sélecteur <app-header></app-header> tout au début du template HTML.'
      ],
      initialTs: `import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // TODO: Ajoutez HeaderComponent dans les imports
  templateUrl: './app.component.html'
})
export class AppComponent {}`,
      initialHtml: `<!-- TODO: Insérez la balise <app-header> ici -->
<div class="content p-3">
  <p>Contenu principal de l'application</p>
</div>`,
      initialCss: ``,
      solutionTs: `import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}`,
      solutionHtml: `<app-header></app-header>
<div class="content p-3">
  <p>Contenu principal de l'application</p>
</div>`,
      solutionCss: ``,
      validateFn: (ts, html, css) => {
        const hasImports = /imports\s*:\s*\[\s*HeaderComponent\s*\]/.test(ts);
        const hasHeaderTag = /<app-header\s*>\s*<\/app-header\s*>|<app-header\s*\/>/.test(html);

        if (!hasImports) return { valid: false, feedback: 'HeaderComponent doit être ajouté dans le tableau imports: [] du décorateur.' };
        if (!hasHeaderTag) return { valid: false, feedback: 'La balise <app-header></app-header> doit être présente dans le HTML.' };

        return { valid: true, feedback: 'Parfait ! Le composant standalone est importé et instancié dans le template.' };
      }
    },

    {
      id: '3.4',
      title: 'Atelier 3.4 — Isolation des Styles CSS (View Encapsulation)',
      subtitle: 'Vérification de la non-pollution des règles CSS entre composants',
      instructions: [
        'Dans le fichier CSS, ajoutez la règle p { color: purple; font-style: italic; }.',
        'Observez le résultat et validez pour vérifier la compréhension de l\'encapsulation.'
      ],
      initialTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {}`,
      initialHtml: `<div class="header-box">
  <p>Ceci est le paragraphe de l'en-tête (HeaderComponent)</p>
</div>`,
      initialCss: `/* TODO: Ajoutez la règle p { color: purple; font-style: italic; } */`,
      solutionTs: `import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {}`,
      solutionHtml: `<div class="header-box">
  <p>Ceci est le paragraphe de l'en-tête (HeaderComponent)</p>
</div>`,
      solutionCss: `p {
  color: purple;
  font-style: italic;
}`,
      validateFn: (ts, html, css) => {
        const hasPurple = /color\s*:\s*purple/i.test(css) || /color\s*:\s*#800080/i.test(css);
        const hasItalic = /font-style\s*:\s*italic/i.test(css);

        if (!hasPurple || !hasItalic) return { valid: false, feedback: 'La règle CSS "p { color: purple; font-style: italic; }" est manquante.' };

        return { valid: true, feedback: 'Excellent ! L\'encapsulation des styles Angular garantit qu\'aucun autre composant ne sera affecté.' };
      }
    }
  ];

  get currentWorkshop(): Workshop {
    return this.workshops.find(w => w.id === this.selectedWorkshopId()) || this.workshops[0];
  }

  get currentCode() {
    const id = this.selectedWorkshopId();
    if (!this.codeStore()[id]) {
      const w = this.currentWorkshop;
      this.codeStore.update(s => ({
        ...s,
        [id]: { ts: w.initialTs, html: w.initialHtml, css: w.initialCss }
      }));
    }
    return this.codeStore()[id];
  }

  ngAfterViewInit() {
    this.initMonaco();
  }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.dispose();
    }
  }

  selectWorkshop(w: Workshop) {
    this.selectedWorkshopId.set(w.id);
    this.validationResult.set({ tested: false, valid: false, feedback: '' });
    this.showSolution.set(false);
    this.updateEditorContent();
  }

  setTab(tab: 'ts' | 'html' | 'css') {
    this.activeTab.set(tab);
    this.updateEditorContent();
  }

  private initMonaco() {
    // Configure loader fallback
    loader.config({
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
      }
    });

    loader.init().then(monaco => {
      if (!this.editorContainer) return;

      this.editorInstance = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.currentCode[this.activeTab()],
        language: this.getMonacoLanguage(this.activeTab()),
        theme: this.appState.theme() === 'dark' ? 'vs-dark' : 'vs',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false
      });

      this.editorInstance.onDidChangeModelContent(() => {
        const val = this.editorInstance.getValue();
        const tab = this.activeTab();
        const id = this.selectedWorkshopId();

        this.codeStore.update(s => ({
          ...s,
          [id]: {
            ...s[id],
            [tab]: val
          }
        }));
      });
    }).catch(err => {
      console.warn('Monaco Editor CDN load warning:', err);
    });
  }

  private updateEditorContent() {
    if (!this.editorInstance) return;
    const code = this.currentCode[this.activeTab()];
    const lang = this.getMonacoLanguage(this.activeTab());

    const model = this.editorInstance.getModel();
    if (model) {
      loader.init().then(monaco => {
        monaco.editor.setModelLanguage(model, lang);
        this.editorInstance.setValue(code);
      });
    }
  }

  private getMonacoLanguage(tab: 'ts' | 'html' | 'css'): string {
    switch (tab) {
      case 'ts': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
    }
  }

  onTabCodeChange(newCode: string) {
    const tab = this.activeTab();
    const id = this.selectedWorkshopId();
    this.codeStore.update(s => ({
      ...s,
      [id]: {
        ...s[id],
        [tab]: newCode
      }
    }));
  }

  validateSolution() {
    const code = this.currentCode;
    const res = this.currentWorkshop.validateFn(code.ts, code.html, code.css);
    this.validationResult.set({ tested: true, ...res });

    if (res.valid) {
      this.appState.markWorkshopCompleted(this.selectedWorkshopId());
    }
  }

  toggleSolution() {
    this.showSolution.update(v => !v);
  }

  loadSolutionCode() {
    const w = this.currentWorkshop;
    const id = w.id;
    this.codeStore.update(s => ({
      ...s,
      [id]: { ts: w.solutionTs, html: w.solutionHtml, css: w.solutionCss }
    }));
    this.updateEditorContent();
    this.validateSolution();
  }

  incrementLabCounter() {
    this.labCounter.update(c => c + 1);
  }

  resetLabCounter() {
    this.labCounter.set(0);
  }
}
