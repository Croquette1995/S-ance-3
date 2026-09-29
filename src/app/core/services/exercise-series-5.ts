import { Exercise } from '../models/app.models';

export const EXERCISES_SERIES_5: Exercise[] = [
  {
    id: 'ex-5-1',
    labNumber: 5,
    number: '5.1',
    title: 'Réparation de la Pile cassée (Convenience Inheritance)',
    subtitle: 'Sortir de l\'héritage paresseux de Array en encapsulant un tableau privé',
    sectionId: 'antipatterns-debug',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Soit la classe défaillante class Pile<T> extends Array<T>. Refactorisez-la en une classe autonome Pile<T> qui N\'HÉRITE PAS de Array, mais stocke private elements: T[] = []. Implémentez empiler(valeur: T): void en déléguant à this.elements.push(valeur).',
    hint: 'Supprimez "extends Array<T>" et déclarez private elements: T[] = [];',
    initialCode: `// Refactorisez cette classe pour qu'elle n'hérite PAS d'Array mais encapsule un tableau privé :\nclass Pile<T> {\n  // TODO: private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    // TODO: à implémenter\n  }\n}\n\n// TODO: Instanciez la pile, empilez "Doc1" et "Doc2", puis loggez "Pile saine créée sans héritage de Array !"\n`,
    solutionCode: `class Pile<T> {\n  private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    this.elements.push(valeur);\n  }\n}\n\nconst pile = new Pile<string>();\npile.empiler("Doc1");\npile.empiler("Doc2");\nconsole.log("Pile saine créée sans héritage de Array !");\n`,
    currentCode: `// Refactorisez cette classe pour qu'elle n'hérite PAS d'Array mais encapsule un tableau privé :\nclass Pile<T> {\n  // TODO: private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    // TODO: à implémenter\n  }\n}\n\n// TODO: Instanciez la pile, empilez "Doc1" et "Doc2", puis loggez "Pile saine créée sans héritage de Array !"\n`,
    isCompleted: false,
    solutionExplanation: [
      'Une Pile N\'EST PAS un tableau : c\'est une structure LIFO (Last-In First-Out).',
      'Hériter d\'Array (convenience inheritance) expose des dizaines de méthodes interdites (splice, sort, shift, unshift).',
      'En composant avec un tableau privé, l\'objet contrôle scrupuleusement son interface publique.'
    ],
    criteria: [
      {
        id: 'c51-noextends',
        label: 'Aucun extends Array',
        description: 'La classe Pile ne doit pas hériter d\'Array.',
        passed: false,
        hint: 'Supprimez extends Array<T>.'
      },
      {
        id: 'c51-empiler',
        label: 'Méthode empiler fonctionnelle',
        description: 'empiler doit déléguer à push sur le tableau privé.',
        passed: false,
        hint: 'this.elements.push(valeur);'
      }
    ]
  },
  {
    id: 'ex-5-2',
    labNumber: 5,
    number: '5.2',
    title: 'Implémentation stricte de LIFO',
    subtitle: 'Fournir uniquement les opérations canoniques : empiler, depiler et taille',
    sectionId: 'antipatterns-debug',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Complétez la classe Pile en ajoutant depiler(): T | undefined (qui délègue à this.elements.pop()) et un getter get taille(): number retournant this.elements.length. Empilez "A" et "B", dépilez une fois et affichez l\'élément dépilé ainsi que la taille restante.',
    hint: 'depiler(): T | undefined { return this.elements.pop(); } get taille(): number { return this.elements.length; }',
    initialCode: `class Pile<T> {\n  private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    this.elements.push(valeur);\n  }\n\n  // TODO: Coder depiler(): T | undefined\n\n  // TODO: Coder get taille(): number\n}\n\n// TODO: Empilez "A" puis "B", dépilez une fois et affichez dépilé et taille restante\n`,
    solutionCode: `class Pile<T> {\n  private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    this.elements.push(valeur);\n  }\n\n  depiler(): T | undefined {\n    return this.elements.pop();\n  }\n\n  get taille(): number {\n    return this.elements.length;\n  }\n}\n\nconst p = new Pile<string>();\np.empiler("A");\np.empiler("B");\nconst depile = p.depiler();\nconsole.log("Dépilé :", depile);\nconsole.log("Taille restante :", p.taille);\n`,
    currentCode: `class Pile<T> {\n  private elements: T[] = [];\n\n  empiler(valeur: T): void {\n    this.elements.push(valeur);\n  }\n\n  // TODO: Coder depiler(): T | undefined\n\n  // TODO: Coder get taille(): number\n}\n\n// TODO: Empilez "A" puis "B", dépilez une fois et affichez dépilé et taille restante\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le principe LIFO est garanti à 100% : le dernier entré est le premier sorti.',
      'L\'utilisateur externe ne peut rien faire d\'autre que ces 3 actions prévues.',
      'Les invariants de structure sont protégés par le cordon sanitaire de l\'encapsulation.'
    ],
    criteria: [
      {
        id: 'c52-methods',
        label: 'Méthodes depiler et taille implémentées',
        description: 'depiler() et le getter taille doivent être fonctionnels.',
        passed: false,
        hint: 'Vérifiez les délégations pop() et .length.'
      },
      {
        id: 'c52-lifo',
        label: 'Ordre LIFO respecté',
        description: 'Dépiler "B" et constater que la taille passe à 1.',
        passed: false,
        hint: 'Vérifiez la console.'
      }
    ]
  },
  {
    id: 'ex-5-3',
    labNumber: 5,
    number: '5.3',
    title: 'Validation de l\'encapsulation protectrice',
    subtitle: 'Observer que les méthodes pirates (splice, sort) sont désormais invisibles',
    sectionId: 'antipatterns-debug',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Sur l\'instance de Pile, observez que les méthodes comme splice ou sort n\'existent plus. Écrivez un getter sommet(): T | undefined retournant le dernier élément sans le dépiler (sans altérer la taille). Empilez 10 et 20, puis affichez le sommet et la taille.',
    hint: 'get sommet(): T | undefined { return this.elements[this.elements.length - 1]; }',
    initialCode: `class Pile<T> {\n  private elements: T[] = [];\n  empiler(v: T): void { this.elements.push(v); }\n  depiler(): T | undefined { return this.elements.pop(); }\n  get taille(): number { return this.elements.length; }\n\n  // TODO: Ajoutez le getter sommet(): T | undefined\n}\n\n// TODO: Empilez 10 et 20, puis affichez p.sommet et p.taille\n`,
    solutionCode: `class Pile<T> {\n  private elements: T[] = [];\n  empiler(v: T): void { this.elements.push(v); }\n  depiler(): T | undefined { return this.elements.pop(); }\n  get taille(): number { return this.elements.length; }\n\n  get sommet(): T | undefined {\n    return this.elements[this.elements.length - 1];\n  }\n}\n\nconst p = new Pile<number>();\np.empiler(10);\np.empiler(20);\nconsole.log("Sommet actuel :", p.sommet);\nconsole.log("Taille inchangée :", p.taille);\n`,
    currentCode: `class Pile<T> {\n  private elements: T[] = [];\n  empiler(v: T): void { this.elements.push(v); }\n  depiler(): T | undefined { return this.elements.pop(); }\n  get taille(): number { return this.elements.length; }\n\n  // TODO: Ajoutez le getter sommet(): T | undefined\n}\n\n// TODO: Empilez 10 et 20, puis affichez p.sommet et p.taille\n`,
    isCompleted: false,
    solutionExplanation: [
      'Consulter le sommet est une opération classique (peek).',
      'Elle ne modifie pas la taille du tableau interne.',
      'L\'API de Pile reste minimaliste, concise et fidèle à son contrat fonctionnel.'
    ],
    criteria: [
      {
        id: 'c53-sommet',
        label: 'Getter sommet implémenté',
        description: 'sommet doit retourner le dernier élément du tableau.',
        passed: false,
        hint: 'return this.elements[this.elements.length - 1];'
      },
      {
        id: 'c53-logged',
        label: 'Sommet 20 et taille 2 vérifiés',
        description: 'La console doit afficher le sommet 20 et la taille 2.',
        passed: false,
        hint: 'console.log(p.sommet); console.log(p.taille);'
      }
    ]
  },
  {
    id: 'ex-5-4',
    labNumber: 5,
    number: '5.4',
    title: 'Découpage d\'un "God Object" (Extraction SRP)',
    subtitle: 'Extraire les responsabilités parasites (validation et email) dans deux composants dédiés',
    sectionId: 'antipatterns-debug',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Au lieu d\'une classe Utilisateur énorme qui valide les emails et gère la messagerie, créez deux composants spécialisés : ValidateurEmail (methode valider(email: string): boolean qui vérifie qu\'il y a un @) et Notificateur (methode notifier(email: string, msg: string): void). Testez ces deux briques.',
    hint: 'class ValidateurEmail { valider(email: string): boolean { return email.includes("@"); } }',
    initialCode: `// TODO 1: Coder class ValidateurEmail\n\n\n// TODO 2: Coder class Notificateur\n\n\n// TODO 3: Instanciez et testez\n`,
    solutionCode: `class ValidateurEmail {\n  valider(email: string): boolean {\n    return email.includes("@");\n  }\n}\n\nclass Notificateur {\n  notifier(email: string, msg: string): void {\n    console.log(\`Notification envoyée à \${email} : \${msg}\`);\n  }\n}\n\nconst v = new ValidateurEmail();\nconst n = new Notificateur();\nconsole.log("Email valide ?", v.valider("test@eafc.be"));\nn.notifier("test@eafc.be", "Bienvenue !");\n`,
    currentCode: `// TODO 1: Coder class ValidateurEmail\n\n\n// TODO 2: Coder class Notificateur\n\n\n// TODO 3: Instanciez et testez\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le principe de responsabilité unique (SRP) indique qu\'une classe ne doit avoir qu\'une seule raison de changer.',
      'La validation de syntaxe d\'adresse email et l\'envoi de messages sont des responsabilités distinctes.',
      'En les extrayant dans deux petites classes, elles deviennent réutilisables dans toute l\'application.'
    ],
    criteria: [
      {
        id: 'c54-validateur',
        label: 'ValidateurEmail fonctionnel',
        description: 'valider() doit retourner true pour une adresse avec un @.',
        passed: false,
        hint: 'return email.includes("@");'
      },
      {
        id: 'c54-notif',
        label: 'Notificateur opérationnel',
        description: 'notifier() doit afficher le message avec l\'email.',
        passed: false,
        hint: 'console.log(...);'
      }
    ]
  },
  {
    id: 'ex-5-5',
    labNumber: 5,
    number: '5.5',
    title: 'Assemblage final & Respect strict du SRP',
    subtitle: 'Composer l\'Utilisateur avec ses deux collaborateurs sans aucun héritage',
    sectionId: 'antipatterns-debug',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Créez la classe Utilisateur recevant public readonly email: string, private validateur: ValidateurEmail et private notif: Notificateur. Ajoutez une méthode inscrire(): boolean : si l\'email est valide, elle notifie "Inscription réussie !" et retourne true ; sinon elle logge "Email invalide" et retourne false.',
    hint: 'if (this.validateur.valider(this.email)) { this.notif.notifier(this.email, "Inscription réussie !"); return true; } return false;',
    initialCode: `class ValidateurEmail {\n  valider(email: string): boolean { return email.includes("@"); }\n}\n\nclass Notificateur {\n  notifier(email: string, msg: string): void { console.log(\`[\${email}] \${msg}\`); }\n}\n\n// TODO: Créez Utilisateur (injectez email, validateur, notif) avec méthode inscrire(): boolean\n\n\n// TODO: Instanciez user = new Utilisateur("julie@eafc.be", new ValidateurEmail(), new Notificateur()), inscrivez-le et loggez le résultat\n`,
    solutionCode: `class ValidateurEmail {\n  valider(email: string): boolean { return email.includes("@"); }\n}\n\nclass Notificateur {\n  notifier(email: string, msg: string): void { console.log(\`[\${email}] \${msg}\`); }\n}\n\nclass Utilisateur {\n  constructor(\n    public readonly email: string,\n    private validateur: ValidateurEmail,\n    private notif: Notificateur\n  ) {}\n\n  inscrire(): boolean {\n    if (this.validateur.valider(this.email)) {\n      this.notif.notifier(this.email, "Inscription réussie !");\n      return true;\n    }\n    console.log("Email invalide : inscription refusée");\n    return false;\n  }\n}\n\nconst user = new Utilisateur("julie@eafc.be", new ValidateurEmail(), new Notificateur());\nconst ok = user.inscrire();\nconsole.log("Statut inscription :", ok);\n`,
    currentCode: `class ValidateurEmail {\n  valider(email: string): boolean { return email.includes("@"); }\n}\n\nclass Notificateur {\n  notifier(email: string, msg: string): void { console.log(\`[\${email}] \${msg}\`); }\n}\n\n// TODO: Créez Utilisateur (injectez email, validateur, notif) avec méthode inscrire(): boolean\n\n\n// TODO: Instanciez user = new Utilisateur("julie@eafc.be", new ValidateurEmail(), new Notificateur()), inscrivez-le et loggez le résultat\n`,
    isCompleted: false,
    solutionExplanation: [
      'L\'Utilisateur est un chef d\'orchestre : il coordonne ses collaborateurs sans faire le travail sale lui-même.',
      'Aucune classe mère abstraite fourre-tout n\'a été nécessaire.',
      'La solution est robuste, évolutive, hautement testable et conforme aux standards du génie logiciel.'
    ],
    criteria: [
      {
        id: 'c55-user',
        label: 'Classe Utilisateur composite',
        description: 'Constructeur injectant ValidateurEmail et Notificateur.',
        passed: false,
        hint: 'constructor(public readonly email: string, private validateur: ValidateurEmail, private notif: Notificateur)'
      },
      {
        id: 'c55-inscrire',
        label: 'Méthode inscrire conforme',
        description: 'inscrire() doit déléguer et retourner true pour julie@eafc.be.',
        passed: false,
        hint: 'user.inscrire() === true'
      },
      {
        id: 'c55-logged',
        label: 'Confirmation d\'inscription loggée',
        description: 'La console doit contenir "Inscription réussie !".',
        passed: false,
        hint: 'Vérifiez la sortie console.'
      }
    ]
  }
];
