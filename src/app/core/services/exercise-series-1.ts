import { Exercise } from '../models/app.models';

export const EXERCISES_SERIES_1: Exercise[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Création du Processeur & Injection dans Ordinateur',
    subtitle: 'Comprendre la relation « a-un » (has-a) par injection de constructeur',
    sectionId: 'heritage-pathologies',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Créez une classe Processeur avec une méthode calculer(): string retournant "Calcul en cours...". Créez ensuite une classe Ordinateur dont le constructeur reçoit et stocke une instance de Processeur (private processeur: Processeur). Instanciez les deux et affichez un message.',
    hint: 'Utilisez constructor(private processeur: Processeur) {} dans la classe Ordinateur.',
    initialCode: `// 1. Déclarez la classe Processeur avec calculer(): string\nclass Processeur {\n  calculer(): string {\n    return "Calcul en cours...";\n  }\n}\n\n// 2. Déclarez la classe Ordinateur qui « a-un » Processeur injecté :\nclass Ordinateur {\n  constructor(private processeur: Processeur) {}\n}\n\n// 3. Instanciez un Processeur et un Ordinateur, puis faites un log :\nconst cpu = new Processeur();\nconst pc = new Ordinateur(cpu);\nconsole.log("Ordinateur assemblé avec succès !");\n`,
    solutionCode: `class Processeur {\n  calculer(): string {\n    return "Calcul en cours...";\n  }\n}\n\nclass Ordinateur {\n  constructor(private processeur: Processeur) {}\n}\n\nconst cpu = new Processeur();\nconst pc = new Ordinateur(cpu);\nconsole.log("Ordinateur assemblé avec succès !");\n`,
    currentCode: `// 1. Déclarez la classe Processeur avec calculer(): string\nclass Processeur {\n  // TODO: méthode calculer(): string\n}\n\n// 2. Déclarez la classe Ordinateur qui « a-un » Processeur injecté :\nclass Ordinateur {\n  // TODO: injectez le processeur dans le constructeur\n}\n\n// 3. Instanciez et vérifiez :\nconst cpu = new Processeur();\nconst pc = new Ordinateur(cpu);\nconsole.log("Ordinateur assemblé avec succès !");\n`,
    isCompleted: false,
    solutionExplanation: [
      'La classe Processeur est un composant autonome et réutilisable.',
      'La classe Ordinateur n\'hérite pas de Processeur (un PC n\'est pas un processeur).',
      'L\'ordinateur possède un processeur grâce à l\'attribut privé injecté par le constructeur.'
    ],
    criteria: [
      {
        id: 'c1-cpu',
        label: 'Classe Processeur définie',
        description: 'Processeur doit posséder la méthode calculer() retournant "Calcul en cours...".',
        passed: false,
        hint: 'calculer(): string { return "Calcul en cours..."; }'
      },
      {
        id: 'c1-pc',
        label: 'Classe Ordinateur avec injection has-a',
        description: 'Ordinateur doit recevoir un Processeur dans son constructeur.',
        passed: false,
        hint: 'constructor(private processeur: Processeur) {}'
      },
      {
        id: 'c1-logged',
        label: 'Validation d\'assemblage',
        description: 'La console doit confirmer l\'assemblage sans erreur.',
        passed: false,
        hint: 'console.log("Ordinateur assemblé avec succès !");'
      }
    ]
  },
  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Délégation simple',
    subtitle: 'Transférer l\'exécution du travail au collaborateur interne',
    sectionId: 'heritage-pathologies',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans la classe Ordinateur, implémentez la méthode executer(): string qui délègue le travail en appelant et retournant le résultat de this.processeur.calculer(). Affichez le résultat de pc.executer().',
    hint: 'Dans Ordinateur : executer(): string { return this.processeur.calculer(); }',
    initialCode: `class Processeur {\n  calculer(): string {\n    return "CPU : Traitement 4.2 GHz achevé !";\n  }\n}\n\nclass Ordinateur {\n  constructor(private processeur: Processeur) {}\n\n  // TODO: Implémentez la méthode executer() par délégation :\n  executer(): string {\n    return "";\n  }\n}\n\nconst pc = new Ordinateur(new Processeur());\nconsole.log(pc.executer());\n`,
    solutionCode: `class Processeur {\n  calculer(): string {\n    return "CPU : Traitement 4.2 GHz achevé !";\n  }\n}\n\nclass Ordinateur {\n  constructor(private processeur: Processeur) {}\n\n  executer(): string {\n    return this.processeur.calculer();\n  }\n}\n\nconst pc = new Ordinateur(new Processeur());\nconsole.log(pc.executer());\n`,
    currentCode: `class Processeur {\n  calculer(): string {\n    return "CPU : Traitement 4.2 GHz achevé !";\n  }\n}\n\nclass Ordinateur {\n  constructor(private processeur: Processeur) {}\n\n  // TODO: Implémentez la méthode executer() par délégation :\n  \n}\n\nconst pc = new Ordinateur(new Processeur());\nconsole.log(pc.executer());\n`,
    isCompleted: false,
    solutionExplanation: [
      'La délégation consiste pour Ordinateur à confier l\'action à this.processeur.',
      'L\'utilisateur externe dialogue avec l\'ordinateur sans manipuler directement le processeur.',
      'L\'encapsulation est totale : si l\'implémentation de Processeur change, Ordinateur n\'a pas besoin d\'être réécrit.'
    ],
    criteria: [
      {
        id: 'c2-delegation',
        label: 'Méthode executer() implémentée',
        description: 'Ordinateur.executer() doit appeler this.processeur.calculer().',
        passed: false,
        hint: 'return this.processeur.calculer();'
      },
      {
        id: 'c2-logged',
        label: 'Sortie console conforme',
        description: 'La console doit afficher "CPU : Traitement 4.2 GHz achevé !".',
        passed: false,
        hint: 'console.log(pc.executer());'
      }
    ]
  },
  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Multi-composition (Assembler plusieurs briques)',
    subtitle: 'Composer plusieurs objets indépendants (impossible en héritage simple)',
    sectionId: 'heritage-pathologies',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez une classe MemoireVive avec une méthode capaciteGo(): number retournant 32. Injectez cette mémoire dans Ordinateur aux côtés du Processeur, et ajoutez une méthode diagnostic(): string affichant la capacité et le calcul du processeur.',
    hint: 'constructor(private processeur: Processeur, private ram: MemoireVive) {}',
    initialCode: `class Processeur {\n  calculer(): string { return "CPU OK"; }\n}\n\n// 1. Créez la classe MemoireVive avec capaciteGo(): number\n\n\n// 2. Mettez à jour Ordinateur pour accepter le Processeur et la MemoireVive :\nclass Ordinateur {\n  constructor(\n    private processeur: Processeur\n    // Ajoutez la RAM ici\n  ) {}\n\n  diagnostic(): string {\n    return "";\n  }\n}\n\n// 3. Testez l'assemblage complet :\n`,
    solutionCode: `class Processeur {\n  calculer(): string { return "CPU OK"; }\n}\n\nclass MemoireVive {\n  capaciteGo(): number { return 32; }\n}\n\nclass Ordinateur {\n  constructor(\n    private processeur: Processeur,\n    private ram: MemoireVive\n  ) {}\n\n  diagnostic(): string {\n    return \`PC avec \${this.ram.capaciteGo()} Go RAM - \${this.processeur.calculer()}\`;\n  }\n}\n\nconst pc = new Ordinateur(new Processeur(), new MemoireVive());\nconsole.log(pc.diagnostic());\n`,
    currentCode: `class Processeur {\n  calculer(): string { return "CPU OK"; }\n}\n\n// 1. Créez la classe MemoireVive avec capaciteGo(): number qui retourne 32\n\n\n// 2. Mettez à jour Ordinateur avec Processeur ET MemoireVive :\nclass Ordinateur {\n  constructor(\n    private processeur: Processeur\n  ) {}\n\n  diagnostic(): string {\n    return "";\n  }\n}\n\n// 3. Instanciez et affichez diagnostic()\n`,
    isCompleted: false,
    solutionExplanation: [
      'En TypeScript, une classe ne peut étendre qu\'une seule classe mère (héritage simple).',
      'La composition brise cette limitation : un Ordinateur peut agréger un Processeur, une MemoireVive, une CarteGraphique, etc.',
      'Chaque brique conserve sa responsabilité propre et son cycle de vie.'
    ],
    criteria: [
      {
        id: 'c3-ram',
        label: 'Classe MemoireVive définie',
        description: 'MemoireVive doit avoir une méthode capaciteGo() retournant 32.',
        passed: false,
        hint: 'capaciteGo(): number { return 32; }'
      },
      {
        id: 'c3-multi',
        label: 'Ordinateur multi-composé',
        description: 'Le constructeur d\'Ordinateur doit recevoir Processeur et MemoireVive.',
        passed: false,
        hint: 'constructor(private processeur: Processeur, private ram: MemoireVive)'
      },
      {
        id: 'c3-diag',
        label: 'Méthode diagnostic fonctionnelle',
        description: 'diagnostic() doit afficher les 32 Go et le calcul du processeur.',
        passed: false,
        hint: 'console.log(pc.diagnostic());'
      }
    ]
  },
  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Encapsulation protectrice (Boîte noire)',
    subtitle: 'Garantir que les collaborateurs internes ne fuient pas vers l\'extérieur',
    sectionId: 'heritage-pathologies',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Modifiez la classe Ordinateur pour que processeur et ram soient strictement privés. Ajoutez un getter public specs(): string qui résume les composants sans jamais exposer les objets internes directement.',
    hint: 'Utilisez get specs(): string { return ...; } et vérifiez que les champs sont private.',
    initialCode: `class Processeur {\n  nom(): string { return "Intel Core i7"; }\n}\n\nclass MemoireVive {\n  taille(): string { return "16 Go DDR5"; }\n}\n\nclass Ordinateur {\n  constructor(\n    private processeur: Processeur,\n    private ram: MemoireVive\n  ) {}\n\n  // TODO: Ajoutez le getter public specs(): string\n  get specs(): string {\n    return "";\n  }\n}\n\nconst pc = new Ordinateur(new Processeur(), new MemoireVive());\nconsole.log("Spécifications :", pc.specs);\n`,
    solutionCode: `class Processeur {\n  nom(): string { return "Intel Core i7"; }\n}\n\nclass MemoireVive {\n  taille(): string { return "16 Go DDR5"; }\n}\n\nclass Ordinateur {\n  constructor(\n    private processeur: Processeur,\n    private ram: MemoireVive\n  ) {}\n\n  get specs(): string {\n    return \`\${this.processeur.nom()} - \${this.ram.taille()}\`;\n  }\n}\n\nconst pc = new Ordinateur(new Processeur(), new MemoireVive());\nconsole.log("Spécifications :", pc.specs);\n`,
    currentCode: `class Processeur {\n  nom(): string { return "Intel Core i7"; }\n}\n\nclass MemoireVive {\n  taille(): string { return "16 Go DDR5"; }\n}\n\nclass Ordinateur {\n  // TODO: Déclarez processeur et ram en private dans le constructeur\n  constructor(\n    processeur: Processeur,\n    ram: MemoireVive\n  ) {}\n\n  // TODO: Getter specs retournant les infos combinées\n}\n\nconst pc = new Ordinateur(new Processeur(), new MemoireVive());\nconsole.log("Spécifications :", pc.specs);\n`,
    isCompleted: false,
    solutionExplanation: [
      'L\'encapsulation stricte (black-box reuse) protège les invariants du système.',
      'Le client ne doit pas pouvoir remplacer le processeur ou modifier la RAM en accédant aux attributs de l\'extérieur.',
      'L\'exposition se fait par des méthodes ou getters publics soigneusement maîtrisés.'
    ],
    criteria: [
      {
        id: 'c4-private',
        label: 'Champs privés dans le constructeur',
        description: 'processeur et ram doivent être déclarés avec le mot-clé private.',
        passed: false,
        hint: 'constructor(private processeur: Processeur, private ram: MemoireVive)'
      },
      {
        id: 'c4-specs',
        label: 'Getter specs implémenté',
        description: 'specs doit retourner le résumé contenant "Intel Core i7" et "16 Go DDR5".',
        passed: false,
        hint: 'get specs(): string { return `${this.processeur.nom()} - ${this.ram.taille()}`; }'
      }
    ]
  },
  {
    id: 'ex-1-5',
    labNumber: 1,
    number: '1.5',
    title: 'Assemblage complet & Validation finale',
    subtitle: 'Instancier et exécuter une machine complète sans un seul mot-clé extends',
    sectionId: 'heritage-pathologies',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Assemblez une classe Serveur composée d\'un Processeur (calculer() -> "Serveur CPU actif"), d\'un DisqueDur (espaceLibreGo() -> 2000) et d\'un nom public. Implémentez la méthode demarrer(): string et affichez la chaîne complète dans la console.',
    hint: 'Créez les 3 briques et vérifiez le log final avec demarrer().',
    initialCode: `// 1. Composant Processeur :\nclass Processeur {\n  calculer(): string { return "Serveur CPU actif"; }\n}\n\n// 2. Composant DisqueDur avec espaceLibreGo(): number -> 2000 :\nclass DisqueDur {\n  espaceLibreGo(): number { return 2000; }\n}\n\n// 3. Classe composite Serveur avec nom public et composants injectés :\nclass Serveur {\n  constructor(\n    public readonly nom: string,\n    private cpu: Processeur,\n    private stockage: DisqueDur\n  ) {}\n\n  demarrer(): string {\n    return \`Serveur \${this.nom} démarré [\${this.cpu.calculer()}, \${this.stockage.espaceLibreGo()} Go libres]\`;\n  }\n}\n\nconst srv = new Serveur("Datacenter-1", new Processeur(), new DisqueDur());\nconsole.log(srv.demarrer());\n`,
    solutionCode: `class Processeur {\n  calculer(): string { return "Serveur CPU actif"; }\n}\n\nclass DisqueDur {\n  espaceLibreGo(): number { return 2000; }\n}\n\nclass Serveur {\n  constructor(\n    public readonly nom: string,\n    private cpu: Processeur,\n    private stockage: DisqueDur\n  ) {}\n\n  demarrer(): string {\n    return \`Serveur \${this.nom} démarré [\${this.cpu.calculer()}, \${this.stockage.espaceLibreGo()} Go libres]\`;\n  }\n}\n\nconst srv = new Serveur("Datacenter-1", new Processeur(), new DisqueDur());\nconsole.log(srv.demarrer());\n`,
    currentCode: `// 1. Créez Processeur (calculer() -> "Serveur CPU actif")\n\n// 2. Créez DisqueDur (espaceLibreGo() -> 2000)\n\n// 3. Créez la classe Serveur avec nom public, cpu privé, stockage privé\n// et méthode demarrer(): string\n\n// 4. Testez :\nconst srv = new Serveur("Datacenter-1", new Processeur(), new DisqueDur());\nconsole.log(srv.demarrer());\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le Serveur est 100% composite : il ne dérive d\'aucune classe mère.',
      'La réutilisation se fait par assemblage d\'instances autonomes.',
      'Zéro couplage d\'héritage, zéro risque de Fragile Base Class.'
    ],
    criteria: [
      {
        id: 'c5-classes',
        label: 'Classes Processeur et DisqueDur conformes',
        description: 'Processeur et DisqueDur doivent exposer leurs méthodes respectives.',
        passed: false,
        hint: 'Vérifiez les méthodes calculer() et espaceLibreGo().'
      },
      {
        id: 'c5-serveur',
        label: 'Classe Serveur composite',
        description: 'Serveur doit injecter les deux briques et exposer demarrer().',
        passed: false,
        hint: 'demarrer(): string { return ...; }'
      },
      {
        id: 'c5-logged',
        label: 'Sortie console validée',
        description: 'La console doit afficher "Datacenter-1" et "2000 Go libres".',
        passed: false,
        hint: 'console.log(srv.demarrer());'
      }
    ]
  }
];
