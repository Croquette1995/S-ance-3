import { Exercise } from '../models/app.models';

export const EXERCISES_SERIES_4: Exercise[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Le contrat de service PasserellePaiement',
    subtitle: 'Isoler un service externe dangereux ou payant derrière une interface',
    sectionId: 'duel-decision-tree',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Déclarez une interface PasserellePaiement avec une méthode debiter(montant: number): boolean. Créez une classe BanqueReelle implements PasserellePaiement simulant un appel bancaire réel avec log.',
    hint: 'interface PasserellePaiement { debiter(montant: number): boolean; }',
    initialCode: `// 1. Déclarez interface PasserellePaiement avec debiter(montant: number): boolean\n\n\n// 2. Déclarez class BanqueReelle implements PasserellePaiement\n\n\n// 3. Testez en débitant 50 € :\n// const banque = new BanqueReelle();\n// banque.debiter(50);\n`,
    solutionCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass BanqueReelle implements PasserellePaiement {\n  debiter(montant: number): boolean {\n    console.log(\`[Banque Réelle] Débit de \${montant} € traité avec succès\`);\n    return true;\n  }\n}\n\nconst banque = new BanqueReelle();\nbanque.debiter(50);\n`,
    currentCode: `// 1. Déclarez interface PasserellePaiement avec debiter(montant: number): boolean\n\n\n// 2. Déclarez class BanqueReelle implements PasserellePaiement\n\n\n// 3. Testez en débitant 50 € :\n// const banque = new BanqueReelle();\n// banque.debiter(50);\n`,
    isCompleted: false,
    solutionExplanation: [
      'En production, une vraie passerelle bancaire facture chaque appel et exige un réseau sécurisé.',
      'La modéliser sous forme d\'interface permet d\'en créer une doublure (mock) pour les tests unitaires automatisés.',
      'C\'est le secret des tests qui s\'exécutent en 5 millisecondes au lieu de 3 secondes.'
    ],
    criteria: [
      {
        id: 'c41-interface',
        label: 'Interface PasserellePaiement déclarée',
        description: 'L\'interface doit comporter la méthode debiter(montant: number): boolean.',
        passed: false,
        hint: 'debiter(montant: number): boolean;'
      },
      {
        id: 'c41-logged',
        label: 'BanqueReelle validée',
        description: 'La console doit afficher le débit simulé de 50 €.',
        passed: false,
        hint: 'console.log(...);'
      }
    ]
  },
  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Création du Mock déterministe',
    subtitle: 'Créer un faux service léger pour les tests sans réseau ni banque',
    sectionId: 'duel-decision-tree',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez une classe MockPasserellePaiement implements PasserellePaiement. Elle ne contacte aucune banque, stocke le dernier montant débité dans public dernierMontant: number = 0, et retourne toujours true.',
    hint: 'class MockPasserellePaiement implements PasserellePaiement { dernierMontant = 0; debiter(m: number): boolean { this.dernierMontant = m; return true; } }',
    initialCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\n// TODO: Coder class MockPasserellePaiement implements PasserellePaiement\n// avec public dernierMontant: number = 0 et méthode debiter qui stocke le montant et renvoie true\n\n\n// TODO: Testez en débitant 150 € et loggez dernierMontant\n`,
    solutionCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  public dernierMontant: number = 0;\n\n  debiter(montant: number): boolean {\n    this.dernierMontant = montant;\n    return true;\n  }\n}\n\nconst mock = new MockPasserellePaiement();\nconst ok = mock.debiter(150);\nconsole.log("Mock débité :", mock.dernierMontant, "Succès :", ok);\n`,
    currentCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\n// TODO: Coder class MockPasserellePaiement implements PasserellePaiement\n// avec public dernierMontant: number = 0 et méthode debiter qui stocke le montant et renvoie true\n\n\n// TODO: Testez en débitant 150 € et loggez dernierMontant\n`,
    isCompleted: false,
    solutionExplanation: [
      'Un Mock est une doublure de test déterministe et ultra-rapide.',
      'Il permet d\'espionner les arguments reçus (ici dernierMontant) pour vérifier que la classe testée a bien appelé le collaborateur.',
      'La composition rend cette substitution immédiate en passant le mock au constructeur.'
    ],
    criteria: [
      {
        id: 'c42-mock',
        label: 'MockPasserellePaiement implémenté',
        description: 'Le mock doit avoir dernierMontant et retourner true dans debiter().',
        passed: false,
        hint: 'this.dernierMontant = montant; return true;'
      },
      {
        id: 'c42-logged',
        label: 'Espionnage confirmé',
        description: 'La console doit indiquer dernierMontant = 150.',
        passed: false,
        hint: 'console.log("Mock débité :", mock.dernierMontant);'
      }
    ]
  },
  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Classe métier à tester (PanierAchat)',
    subtitle: 'Composer le panier avec la passerelle injectée',
    sectionId: 'duel-decision-tree',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez la classe PanierAchat dont le constructeur reçoit private passerelle: PasserellePaiement. Elle possède une méthode payer(montant: number): string qui retourne "PAIEMENT_VALIDE" si le débit réussit, ou "ECHEC_PAIEMENT" sinon.',
    hint: 'payer(montant: number): string { return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT"; }',
    initialCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  debiter(montant: number): boolean { return true; }\n}\n\n// TODO: Coder PanierAchat (reçoit PasserellePaiement dans constructeur, méthode payer(montant))\n\n\n// TODO: Instanciez panier = new PanierAchat(new MockPasserellePaiement()) et affichez panier.payer(100)\n`,
    solutionCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  debiter(montant: number): boolean { return true; }\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\nconst panier = new PanierAchat(new MockPasserellePaiement());\nconsole.log("Résultat :", panier.payer(100));\n`,
    currentCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  debiter(montant: number): boolean { return true; }\n}\n\n// TODO: Coder PanierAchat (reçoit PasserellePaiement dans constructeur, méthode payer(montant))\n\n\n// TODO: Instanciez panier = new PanierAchat(new MockPasserellePaiement()) et affichez panier.payer(100)\n`,
    isCompleted: false,
    solutionExplanation: [
      'PanierAchat dépend d\'un contrat PasserellePaiement.',
      'La logique métier propre au panier est isolée de la plomberie bancaire.',
      'La classe est 100% testable de façon isolée.'
    ],
    criteria: [
      {
        id: 'c43-panier',
        label: 'PanierAchat dépend de l\'interface',
        description: 'Constructeur avec PasserellePaiement et méthode payer().',
        passed: false,
        hint: 'constructor(private passerelle: PasserellePaiement)'
      },
      {
        id: 'c43-result',
        label: 'Retour "PAIEMENT_VALIDE" constaté',
        description: 'La méthode payer(100) doit retourner "PAIEMENT_VALIDE".',
        passed: false,
        hint: 'console.log("Résultat :", panier.payer(100));'
      }
    ]
  },
  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Test unitaire automatisé avec console.assert',
    subtitle: 'Écrire l\'assertion automatisée qui valide le comportement du panier',
    sectionId: 'duel-decision-tree',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez le test unitaire complet : instanciez MockPasserellePaiement, injectez-le dans PanierAchat, appelez panier.payer(80) et utilisez console.assert pour vérifier que le retour vaut "PAIEMENT_VALIDE" et que le mock a bien reçu 80 €.',
    hint: 'console.assert(resultat === "PAIEMENT_VALIDE" && mock.dernierMontant === 80, "Le test doit réussir");',
    initialCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  dernierMontant = 0;\n  debiter(m: number): boolean { this.dernierMontant = m; return true; }\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\n// --- SUITE DE TEST UNITAIRE ---\n// TODO: Instanciez mock, panier avec mock, payez 80 € et écrivez les assertions console.assert\n`,
    solutionCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  dernierMontant = 0;\n  debiter(m: number): boolean { this.dernierMontant = m; return true; }\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\nconst mock = new MockPasserellePaiement();\nconst panier = new PanierAchat(mock);\nconst resultat = panier.payer(80);\n\nconsole.assert(resultat === "PAIEMENT_VALIDE", "Le statut de paiement doit être valide");\nconsole.assert(mock.dernierMontant === 80, "Le mock doit avoir reçu 80 €");\nconsole.log("Test unitaire exécuté avec succès !");\n`,
    currentCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass MockPasserellePaiement implements PasserellePaiement {\n  dernierMontant = 0;\n  debiter(m: number): boolean { this.dernierMontant = m; return true; }\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\n// --- SUITE DE TEST UNITAIRE ---\n// TODO: Instanciez mock, panier avec mock, payez 80 € et écrivez les assertions console.assert\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le test unitaire s\'exécute sans aucune dépendance externe (ni base de données, ni réseau).',
      'On valide à la fois la valeur de retour et le fait que la bonne commande a été transmise au collaborateur.',
      'Si le panier héritait de BanqueReelle, écrire ce test nécessiterait de lancer un serveur bancaire en local !'
    ],
    criteria: [
      {
        id: 'c44-assert',
        label: 'Assertions console.assert conformes',
        description: 'Le code doit contenir les deux console.assert pour resultat et mock.dernierMontant.',
        passed: false,
        hint: 'console.assert(resultat === "PAIEMENT_VALIDE"); console.assert(mock.dernierMontant === 80);'
      },
      {
        id: 'c44-success',
        label: 'Test validé avec succès',
        description: 'Aucune assertion ne doit échouer dans la console.',
        passed: false,
        hint: 'Vérifiez la console virtuelle.'
      }
    ]
  },
  {
    id: 'ex-4-5',
    labNumber: 4,
    number: '4.5',
    title: 'Simulation d\'échec bancaire (MockPasserelleRejet)',
    subtitle: 'Tester les cas limites et les erreurs en injectant une doublure d\'échec',
    sectionId: 'duel-decision-tree',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Créez un second mock MockPasserelleRejet implements PasserellePaiement qui retourne toujours false (carte volée ou solde insuffisant). Vérifiez que panier.payer(500) retourne bien "ECHEC_PAIEMENT" via une assertion console.assert.',
    hint: 'class MockPasserelleRejet implements PasserellePaiement { debiter(): boolean { return false; } }',
    initialCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\n// TODO: Coder MockPasserelleRejet implements PasserellePaiement (debiter retourne false)\n// Testez avec panier = new PanierAchat(new MockPasserelleRejet()), res = panier.payer(500) et console.assert(res === "ECHEC_PAIEMENT")\n`,
    solutionCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\nclass MockPasserelleRejet implements PasserellePaiement {\n  debiter(montant: number): boolean {\n    return false;\n  }\n}\n\nconst panierRejet = new PanierAchat(new MockPasserelleRejet());\nconst res = panierRejet.payer(500);\n\nconsole.assert(res === "ECHEC_PAIEMENT", "Le paiement refusé doit renvoyer ECHEC_PAIEMENT");\nconsole.log("Gestion du rejet validée :", res);\n`,
    currentCode: `interface PasserellePaiement {\n  debiter(montant: number): boolean;\n}\n\nclass PanierAchat {\n  constructor(private passerelle: PasserellePaiement) {}\n  payer(montant: number): string {\n    return this.passerelle.debiter(montant) ? "PAIEMENT_VALIDE" : "ECHEC_PAIEMENT";\n  }\n}\n\n// TODO: Coder MockPasserelleRejet implements PasserellePaiement (debiter retourne false)\n// Testez avec panier = new PanierAchat(new MockPasserelleRejet()), res = panier.payer(500) et console.assert(res === "ECHEC_PAIEMENT")\n`,
    isCompleted: false,
    solutionExplanation: [
      'Dans le monde réel, simuler une panne réseau ou une carte expirée avec une vraie banque est fastidieux.',
      'Avec la composition et l\'injection d\'interface, il suffit de créer une classe de 3 lignes retournant false.',
      'La testabilité atteint 100% de couverture de branches sans friction.'
    ],
    criteria: [
      {
        id: 'c45-rejet',
        label: 'MockPasserelleRejet implémenté',
        description: 'Le mock doit retourner false dans debiter().',
        passed: false,
        hint: 'debiter(montant: number): boolean { return false; }'
      },
      {
        id: 'c45-assert',
        label: 'Assertion de rejet validée',
        description: 'console.assert doit valider que le résultat est "ECHEC_PAIEMENT".',
        passed: false,
        hint: 'console.assert(res === "ECHEC_PAIEMENT");'
      }
    ]
  }
];
