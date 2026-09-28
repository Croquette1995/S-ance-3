import { Exercise } from '../models/app.models';

export const EXERCISES_SERIES_2: Exercise[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Système d\'armes de jeu vidéo (Interface Arme)',
    subtitle: 'Poser un contrat commun pour des comportements interchangeables',
    sectionId: 'runtime-swap',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Déclarez une interface Arme avec une méthode attaquer(): string. Coder deux classes implémentant ce contrat : Epee (retournant "Tranchant de l\'épée !") et Arc (retournant "Flèche décochée à distance !"). Instanciez chaque arme et affichez leur attaque.',
    hint: 'interface Arme { attaquer(): string; } puis class Epee implements Arme { ... }',
    initialCode: `// 1. Déclarez interface Arme avec attaquer(): string\n\n\n// 2. Déclarez class Epee implements Arme\n\n\n// 3. Déclarez class Arc implements Arme\n\n\n// 4. Instanciez et affichez :\n// const epee = new Epee();\n// const arc = new Arc();\n// console.log("Épée :", epee.attaquer());\n// console.log("Arc :", arc.attaquer());\n`,
    solutionCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string {\n    return "Tranchant de l'épée !";\n  }\n}\n\nclass Arc implements Arme {\n  attaquer(): string {\n    return "Flèche décochée à distance !";\n  }\n}\n\nconst epee = new Epee();\nconst arc = new Arc();\nconsole.log("Épée :", epee.attaquer());\nconsole.log("Arc :", arc.attaquer());\n`,
    currentCode: `// 1. Déclarez interface Arme avec attaquer(): string\n\n\n// 2. Déclarez class Epee implements Arme\n\n\n// 3. Déclarez class Arc implements Arme\n\n\n// 4. Instanciez et affichez :\n// const epee = new Epee();\n// const arc = new Arc();\n// console.log("Épée :", epee.attaquer());\n// console.log("Arc :", arc.attaquer());\n`,
    isCompleted: false,
    solutionExplanation: [
      'L\'interface Arme formalise le contrat commun pour tous les types d\'armes.',
      'Epee et Arc n\'ont aucun lien de filiation entre elles, seule l\'interface les unit.',
      'C\'est la base indispensable pour autoriser le polymorphisme et le swap à l\'exécution.'
    ],
    criteria: [
      {
        id: 'c21-interface',
        label: 'Interface Arme déclarée',
        description: 'L\'interface doit exiger la méthode attaquer(): string.',
        passed: false,
        hint: 'interface Arme { attaquer(): string; }'
      },
      {
        id: 'c21-classes',
        label: 'Classes Epee et Arc conformes',
        description: 'Epee et Arc doivent implémenter Arme et retourner leurs messages respectifs.',
        passed: false,
        hint: 'class Epee implements Arme { attaquer() { return ...; } }'
      },
      {
        id: 'c21-logged',
        label: 'Exécution console réussie',
        description: 'La console doit afficher les deux attaques.',
        passed: false,
        hint: 'console.log(epee.attaquer()); console.log(arc.attaquer());'
      }
    ]
  },
  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Classe Guerrier modulable',
    subtitle: 'Créer un porteur composite qui possède une Arme privée',
    sectionId: 'runtime-swap',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez la classe Guerrier dont le constructeur prend un nom public (public readonly nom: string) et une arme privée (private arme: Arme). Instanciez un guerrier "Conan" avec une Epee.',
    hint: 'class Guerrier { constructor(public readonly nom: string, private arme: Arme) {} }',
    initialCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\n// TODO: Créez la classe Guerrier (nom public readonly, arme privée de type Arme)\n\n\n// TODO: Instanciez conan = new Guerrier("Conan", new Epee()) et loggez "Guerrier prêt : " + conan.nom\n`,
    solutionCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n}\n\nconst conan = new Guerrier("Conan", new Epee());\nconsole.log("Guerrier prêt :", conan.nom);\n`,
    currentCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\n// TODO: Créez la classe Guerrier (nom public readonly, arme privée de type Arme)\n\n\n// TODO: Instanciez conan = new Guerrier("Conan", new Epee()) et loggez "Guerrier prêt : " + conan.nom\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le Guerrier n\'est pas une Arme : il a une Arme.',
      'En typant l\'attribut interne avec l\'interface Arme plutôt qu\'Epee, Guerrier est prêt à accueillir n\'importe quelle arme.',
      'C\'est l\'essence du couplage lâche.'
    ],
    criteria: [
      {
        id: 'c22-guerrier',
        label: 'Constructeur avec arme de type Arme',
        description: 'Guerrier doit recevoir Arme (l\'interface) et non une classe concrète.',
        passed: false,
        hint: 'constructor(public readonly nom: string, private arme: Arme)'
      },
      {
        id: 'c22-logged',
        label: 'Guerrier instancié avec succès',
        description: 'La console doit afficher le nom du guerrier ("Conan").',
        passed: false,
        hint: 'console.log("Guerrier prêt :", conan.nom);'
      }
    ]
  },
  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Délégation de combat',
    subtitle: 'Faire attaquer le guerrier en déléguant à son arme active',
    sectionId: 'runtime-swap',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans la classe Guerrier, ajoutez la méthode frapper(): string. Cette méthode doit déléguer l\'action à this.arme.attaquer() et retourner "[NomDuGuerrier] frappe : [AttaqueArme]". Testez avec Conan équipé de son épée.',
    hint: 'frapper(): string { return `${this.nom} frappe : ${this.arme.attaquer()}`; }',
    initialCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  // TODO: Ajoutez la méthode frapper(): string qui délègue à this.arme.attaquer()\n}\n\n// TODO: Instanciez conan avec une Epee et affichez conan.frapper()\n`,
    solutionCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n}\n\nconst conan = new Guerrier("Conan", new Epee());\nconsole.log(conan.frapper());\n`,
    currentCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  // TODO: Ajoutez la méthode frapper(): string qui délègue à this.arme.attaquer()\n}\n\n// TODO: Instanciez conan avec une Epee et affichez conan.frapper()\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le guerrier ne sait pas comment l\'arme blesse : il délègue l\'action d\'attaque.',
      'Si une arme magique fait des dégâts élémentaires, la classe Guerrier n\'a pas à changer.',
      'La responsabilité est parfaitement cloisonnée.'
    ],
    criteria: [
      {
        id: 'c23-frapper',
        label: 'Méthode frapper() implémentée',
        description: 'frapper() doit appeler this.arme.attaquer().',
        passed: false,
        hint: 'return `${this.nom} frappe : ${this.arme.attaquer()}`;'
      },
      {
        id: 'c23-logged',
        label: 'Résultat conforme affiché',
        description: 'La console doit afficher "Conan frappe : Tranchant de l\'épée !".',
        passed: false,
        hint: 'console.log(conan.frapper());'
      }
    ]
  },
  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Méthode de permutation (Runtime Swap)',
    subtitle: 'Permettre le remplacement de l\'arme à chaud en cours d\'exécution',
    sectionId: 'runtime-swap',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Ajoutez à Guerrier la méthode equiperArme(nouvelleArme: Arme): void qui remplace l\'arme interne (this.arme = nouvelleArme). C\'est le super-pouvoir de la composition : la mutabilité temporelle sans réinstanciation !',
    hint: 'equiperArme(nouvelleArme: Arme): void { this.arme = nouvelleArme; }',
    initialCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Arc implements Arme {\n  attaquer(): string { return "Flèche décochée à distance !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  // TODO: Implémentez equiperArme(nouvelleArme: Arme): void\n}\n\n// TODO: Testez avec conan = new Guerrier("Conan", new Epee()), loggez frapper(), puis equiperArme(new Arc()) et reloggez frapper()\n`,
    solutionCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Arc implements Arme {\n  attaquer(): string { return "Flèche décochée à distance !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  equiperArme(nouvelleArme: Arme): void {\n    this.arme = nouvelleArme;\n  }\n}\n\nconst conan = new Guerrier("Conan", new Epee());\nconsole.log(conan.frapper());\nconan.equiperArme(new Arc());\nconsole.log(conan.frapper());\n`,
    currentCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass Arc implements Arme {\n  attaquer(): string { return "Flèche décochée à distance !"; }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  // TODO: Implémentez equiperArme(nouvelleArme: Arme): void\n}\n\n// TODO: Testez avec conan = new Guerrier("Conan", new Epee()), loggez frapper(), puis equiperArme(new Arc()) et reloggez frapper()\n`,
    isCompleted: false,
    solutionExplanation: [
      'La référence this.arme est mutable : elle peut pointer vers n\'importe quel objet Arme.',
      'L\'objet conan conserve son identité, ses points de vie, son nom et son historique.',
      'Avec l\'héritage classique (class GuerrierEpee, class GuerrierArc), ce changement dynamique serait strictement impossible sans détruire et recréer l\'objet.'
    ],
    criteria: [
      {
        id: 'c24-swap',
        label: 'Méthode equiperArme définie',
        description: 'equiperArme doit recevoir une Arme et l\'assigner à this.arme.',
        passed: false,
        hint: 'equiperArme(nouvelleArme: Arme): void { this.arme = nouvelleArme; }'
      },
      {
        id: 'c24-dynamic',
        label: 'Changement observable du comportement',
        description: 'Le guerrier doit attaquer à l\'épée, puis à l\'arc après permutation.',
        passed: false,
        hint: 'Vérifiez les logs console avec l\'épée puis avec l\'arc.'
      }
    ]
  },
  {
    id: 'ex-2-5',
    labNumber: 2,
    number: '2.5',
    title: 'Validation du Swap & Impossibilité en Héritage',
    subtitle: 'Créer une troisième arme magique et vérifier la souplesse dynamique',
    sectionId: 'runtime-swap',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Créez une classe SceptreMagique implements Arme (retournant "Boule de feu incandescente !"). Équipez Conan avec ce sceptre en vol sans recréer le guerrier, et affichez son attaque.',
    hint: 'class SceptreMagique implements Arme { attaquer(): string { return "Boule de feu incandescente !"; } }',
    initialCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\n// TODO 1: Créez class SceptreMagique implements Arme\n\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  equiperArme(nouvelleArme: Arme): void {\n    this.arme = nouvelleArme;\n  }\n}\n\n// TODO 2: Instanciez conan = new Guerrier("Conan", new Epee()), équipez-le avec SceptreMagique, puis affichez conan.frapper()\n`,
    solutionCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\nclass SceptreMagique implements Arme {\n  attaquer(): string {\n    return "Boule de feu incandescente !";\n  }\n}\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  equiperArme(nouvelleArme: Arme): void {\n    this.arme = nouvelleArme;\n  }\n}\n\nconst conan = new Guerrier("Conan", new Epee());\nconsole.log(conan.frapper());\nconan.equiperArme(new SceptreMagique());\nconsole.log(conan.frapper());\n`,
    currentCode: `interface Arme {\n  attaquer(): string;\n}\n\nclass Epee implements Arme {\n  attaquer(): string { return "Tranchant de l'épée !"; }\n}\n\n// TODO 1: Créez class SceptreMagique implements Arme\n\n\nclass Guerrier {\n  constructor(\n    public readonly nom: string,\n    private arme: Arme\n  ) {}\n\n  frapper(): string {\n    return \`\${this.nom} frappe : \${this.arme.attaquer()}\`;\n  }\n\n  equiperArme(nouvelleArme: Arme): void {\n    this.arme = nouvelleArme;\n  }\n}\n\n// TODO 2: Instanciez conan = new Guerrier("Conan", new Epee()), équipez-le avec SceptreMagique, puis affichez conan.frapper()\n`,
    isCompleted: false,
    solutionExplanation: [
      'Ajouter une nouvelle arme n\'a exigé AUCUNE modification de la classe Guerrier.',
      'C\'est le respect absolu du principe Open/Closed (ouvert à l\'extension, fermé à la modification).',
      'L\'héritage aurait imposé de créer une nouvelle sous-classe GuerrierMage et de transférer tout l\'état manuellement.'
    ],
    criteria: [
      {
        id: 'c25-sceptre',
        label: 'Classe SceptreMagique créée',
        description: 'SceptreMagique doit implémenter Arme et retourner "Boule de feu incandescente !".',
        passed: false,
        hint: 'class SceptreMagique implements Arme { attaquer(): string { return "Boule de feu incandescente !"; } }'
      },
      {
        id: 'c25-logged',
        label: 'Attaque magique confirmée',
        description: 'La console doit afficher "Conan frappe : Boule de feu incandescente !".',
        passed: false,
        hint: 'console.log(conan.frapper());'
      }
    ]
  }
];
