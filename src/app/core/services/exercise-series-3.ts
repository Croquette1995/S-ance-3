import { Exercise } from '../models/app.models';

export const EXERCISES_SERIES_3: Exercise[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Définition du contrat ServiceNotification',
    subtitle: 'Créer une abstraction pour découpler l\'émetteur du canal technique',
    sectionId: 'dip-interfaces',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Déclarez une interface ServiceNotification avec une méthode envoyer(destinataire: string, message: string): boolean. Déclarez une classe ConsoleNotification qui l\'implémente en affichant le message et en retournant true.',
    hint: 'interface ServiceNotification { envoyer(destinataire: string, message: string): boolean; }',
    initialCode: `// 1. Déclarez l'interface ServiceNotification :\ninterface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\n// 2. Implémentez ConsoleNotification :\nclass ConsoleNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`[Notification à \${destinataire}] : \${message}\`);\n    return true;\n  }\n}\n\nconst notif = new ConsoleNotification();\nnotif.envoyer("admin@site.be", "Serveur démarré");\n`,
    solutionCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass ConsoleNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`[Notification à \${destinataire}] : \${message}\`);\n    return true;\n  }\n}\n\nconst notif = new ConsoleNotification();\nnotif.envoyer("admin@site.be", "Serveur démarré");\n`,
    currentCode: `// 1. Déclarez interface ServiceNotification\n\n\n// 2. Déclarez class ConsoleNotification implements ServiceNotification\n\n\nconst notif = new ConsoleNotification();\nnotif.envoyer("admin@site.be", "Serveur démarré");\n`,
    isCompleted: false,
    solutionExplanation: [
      'L\'inversion des dépendances (DIP) stipule que les modules de haut niveau doivent dépendre d\'abstractions, non de détails.',
      'L\'interface ServiceNotification est cette abstraction.',
      'Peu importe le protocole (SMTP, SMS, Push, Console), le contrat d\'appel reste strictement identique.'
    ],
    criteria: [
      {
        id: 'c31-contract',
        label: 'Interface ServiceNotification déclarée',
        description: 'L\'interface doit avoir la signature envoyer(destinataire: string, message: string): boolean.',
        passed: false,
        hint: 'envoyer(destinataire: string, message: string): boolean;'
      },
      {
        id: 'c31-impl',
        label: 'ConsoleNotification implémente l\'interface',
        description: 'ConsoleNotification doit logger et retourner true.',
        passed: false,
        hint: 'return true;'
      }
    ]
  },
  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Implémentation EmailNotification',
    subtitle: 'Créer le canal d\'envoi de courriels',
    sectionId: 'dip-interfaces',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez EmailNotification implements ServiceNotification. La méthode envoyer doit logger "📧 Email envoyé à [destinataire] : [message]" et retourner true. Testez avec client@eafc.be.',
    hint: 'console.log(`📧 Email envoyé à ${destinataire} : ${message}`); return true;',
    initialCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\n// TODO: Coder EmailNotification implements ServiceNotification :\nclass EmailNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`📧 Email envoyé à \${destinataire} : \${message}\`);\n    return true;\n  }\n}\n\nconst emailService = new EmailNotification();\nemailService.envoyer("client@eafc.be", "Votre commande #42 est prête !");\n`,
    solutionCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`📧 Email envoyé à \${destinataire} : \${message}\`);\n    return true;\n  }\n}\n\nconst emailService = new EmailNotification();\nemailService.envoyer("client@eafc.be", "Votre commande #42 est prête !");\n`,
    currentCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\n// TODO: Coder class EmailNotification implements ServiceNotification\n\n\nconst emailService = new EmailNotification();\nemailService.envoyer("client@eafc.be", "Votre commande #42 est prête !");\n`,
    isCompleted: false,
    solutionExplanation: [
      'EmailNotification est une implémentation concrète du contrat.',
      'Elle isole tous les détails propres aux courriels (sujet, format, destinataire).',
      'Le reste du code de l\'application n\'a pas besoin de savoir comment l\'email est envoyé.'
    ],
    criteria: [
      {
        id: 'c32-email',
        label: 'Classe EmailNotification conforme',
        description: 'Elle doit implémenter ServiceNotification et logger le message.',
        passed: false,
        hint: 'class EmailNotification implements ServiceNotification { ... }'
      },
      {
        id: 'c32-logged',
        label: 'Message email capturé dans la console',
        description: 'La console doit contenir "📧 Email envoyé à client@eafc.be".',
        passed: false,
        hint: 'Vérifiez la chaîne de log.'
      }
    ]
  },
  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Implémentation SmsNotification',
    subtitle: 'Créer un canal alternatif sans toucher au code existant',
    sectionId: 'dip-interfaces',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez SmsNotification implements ServiceNotification. La méthode envoyer doit logger "📱 SMS envoyé au [destinataire] : [message]" et retourner true. Testez avec +32470123456.',
    hint: 'console.log(`📱 SMS envoyé au ${destinataire} : ${message}`); return true;',
    initialCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\n// TODO: Coder SmsNotification implements ServiceNotification :\nclass SmsNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`📱 SMS envoyé au \${destinataire} : \${message}\`);\n    return true;\n  }\n}\n\nconst smsService = new SmsNotification();\nsmsService.envoyer("+32470123456", "Code de sécurité : 8941");\n`,
    solutionCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean {\n    console.log(\`📱 SMS envoyé au \${destinataire} : \${message}\`);\n    return true;\n  }\n}\n\nconst smsService = new SmsNotification();\nsmsService.envoyer("+32470123456", "Code de sécurité : 8941");\n`,
    currentCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\n// TODO: Coder class SmsNotification implements ServiceNotification\n\n\nconst smsService = new SmsNotification();\nsmsService.envoyer("+32470123456", "Code de sécurité : 8941");\n`,
    isCompleted: false,
    solutionExplanation: [
      'Ajouter un canal SMS ne demande aucune modification du contrat existant.',
      'La substitution est parfaite : partout où ServiceNotification est attendu, SmsNotification peut être fourni.',
      'C\'est la force du typage structurel et des contrats d\'interface.'
    ],
    criteria: [
      {
        id: 'c33-sms',
        label: 'Classe SmsNotification conforme',
        description: 'Elle doit implémenter ServiceNotification et logger le SMS.',
        passed: false,
        hint: 'class SmsNotification implements ServiceNotification { ... }'
      },
      {
        id: 'c33-logged',
        label: 'SMS capturé dans la console',
        description: 'La console doit afficher "📱 SMS envoyé au +32470123456".',
        passed: false,
        hint: 'Vérifiez le numéro et le message.'
      }
    ]
  },
  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Injection dans le GestionnaireCommandes',
    subtitle: 'La classe métier ne connaît aucune classe concrète',
    sectionId: 'dip-interfaces',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Créez la classe GestionnaireCommandes dont le constructeur reçoit private notif: ServiceNotification. Implémentez la méthode validerCommande(client: string, total: number): void qui effectue la notification. Testez avec EmailNotification puis avec SmsNotification.',
    hint: 'constructor(private notif: ServiceNotification) {}',
    initialCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`Email -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`SMS -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\n// TODO: Coder GestionnaireCommandes :\nclass GestionnaireCommandes {\n  constructor(private notif: ServiceNotification) {}\n\n  validerCommande(client: string, total: number): void {\n    this.notif.envoyer(client, \`Commande validée (\${total} €)\`);\n  }\n}\n\nconst gestEmail = new GestionnaireCommandes(new EmailNotification());\ngestEmail.validerCommande("alice@site.be", 99);\n\nconst gestSms = new GestionnaireCommandes(new SmsNotification());\ngestSms.validerCommande("+32499112233", 45);\n`,
    solutionCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`Email -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`SMS -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\nclass GestionnaireCommandes {\n  constructor(private notif: ServiceNotification) {}\n\n  validerCommande(client: string, total: number): void {\n    this.notif.envoyer(client, \`Commande validée (\${total} €)\`);\n  }\n}\n\nconst gestEmail = new GestionnaireCommandes(new EmailNotification());\ngestEmail.validerCommande("alice@site.be", 99);\n\nconst gestSms = new GestionnaireCommandes(new SmsNotification());\ngestSms.validerCommande("+32499112233", 45);\n`,
    currentCode: `interface ServiceNotification {\n  envoyer(destinataire: string, message: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`Email -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean {\n    console.log(\`SMS -> \${dest} : \${msg}\`);\n    return true;\n  }\n}\n\n// TODO: Coder GestionnaireCommandes avec injection de ServiceNotification dans le constructeur\n// et méthode validerCommande(client: string, total: number): void\n\n\nconst gestEmail = new GestionnaireCommandes(new EmailNotification());\ngestEmail.validerCommande("alice@site.be", 99);\n\nconst gestSms = new GestionnaireCommandes(new SmsNotification());\ngestSms.validerCommande("+32499112233", 45);\n`,
    isCompleted: false,
    solutionExplanation: [
      'GestionnaireCommandes ignore totalement s\'il envoie un Email ou un SMS.',
      'La dépendance est injectée depuis l\'extérieur (Inversion de Contrôle / Injection de Dépendances).',
      'Le couplage est dit « faible » ou « lâche » (loose coupling).'
    ],
    criteria: [
      {
        id: 'c34-dip',
        label: 'Constructeur dépendant de l\'interface',
        description: 'GestionnaireCommandes doit dépendre uniquement de ServiceNotification.',
        passed: false,
        hint: 'constructor(private notif: ServiceNotification)'
      },
      {
        id: 'c34-valider',
        label: 'validerCommande appelle la délégation',
        description: 'La méthode doit transmettre la notification.',
        passed: false,
        hint: 'this.notif.envoyer(client, `Commande validée (${total} €)`);'
      },
      {
        id: 'c34-logged',
        label: 'Sorties console conformes',
        description: 'La console doit afficher l\'envoi email puis l\'envoi SMS.',
        passed: false,
        hint: 'Vérifiez les logs de sortie.'
      }
    ]
  },
  {
    id: 'ex-3-5',
    labNumber: 3,
    number: '3.5',
    title: 'Élimination du new en dur (Refactoring anti-couplage)',
    subtitle: 'Transformer une composition rigide en composition découplée propre',
    sectionId: 'dip-interfaces',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Soit une classe Facturation qui instancie en dur private service = new EmailNotification() dans son corps. Refactorisez-la pour injecter ServiceNotification par son constructeur (avec une valeur par défaut facultative ou par injection pure).',
    hint: 'Remplacez private service = new EmailNotification(); par constructor(private service: ServiceNotification = new EmailNotification()) {}',
    initialCode: `interface ServiceNotification {\n  envoyer(dest: string, msg: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("Email :", msg); return true; }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("SMS :", msg); return true; }\n}\n\n// Classe avec couplage fort à refactoriser :\n// Mauvais : instanciation en dur à l'intérieur\nclass Facturation {\n  // TODO: Refactorisez cette ligne en injection par constructeur :\n  constructor(private service: ServiceNotification = new EmailNotification()) {}\n\n  facturer(client: string, montant: number): void {\n    this.service.envoyer(client, \`Facture de \${montant} € générée\`);\n  }\n}\n\nconst factSms = new Facturation(new SmsNotification());\nfactSms.facturer("Bob", 120);\n`,
    solutionCode: `interface ServiceNotification {\n  envoyer(dest: string, msg: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("Email :", msg); return true; }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("SMS :", msg); return true; }\n}\n\nclass Facturation {\n  constructor(private service: ServiceNotification = new EmailNotification()) {}\n\n  facturer(client: string, montant: number): void {\n    this.service.envoyer(client, \`Facture de \${montant} € générée\`);\n  }\n}\n\nconst factSms = new Facturation(new SmsNotification());\nfactSms.facturer("Bob", 120);\n`,
    currentCode: `interface ServiceNotification {\n  envoyer(dest: string, msg: string): boolean;\n}\n\nclass EmailNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("Email :", msg); return true; }\n}\n\nclass SmsNotification implements ServiceNotification {\n  envoyer(dest: string, msg: string): boolean { console.log("SMS :", msg); return true; }\n}\n\n// TODO: Refactorisez Facturation pour recevoir ServiceNotification dans son constructeur\nclass Facturation {\n  // Refactorisez ici pour éliminer le couplage fort en dur\n\n  facturer(client: string, montant: number): void {\n    // déléguer\n  }\n}\n\nconst factSms = new Facturation(new SmsNotification());\nfactSms.facturer("Bob", 120);\n`,
    isCompleted: false,
    solutionExplanation: [
      'Le mot-clé `new` à l\'intérieur d\'une méthode ou d\'un constructeur constitue une « colle gluante » qui empêche l\'interchangeabilité.',
      'En déléguant la création de l\'instance au parent ou à un injecteur de dépendances, la classe devient testable et réutilisable.',
      'Fournir une valeur par défaut facultative (new EmailNotification()) permet de garder la commodité d\'usage sans perdre la souplesse.'
    ],
    criteria: [
      {
        id: 'c35-ctor',
        label: 'Injection par constructeur mise en place',
        description: 'Facturation doit accepter ServiceNotification en paramètre de constructeur.',
        passed: false,
        hint: 'constructor(private service: ServiceNotification = ...)'
      },
      {
        id: 'c35-sms',
        label: 'Facturation avec SmsNotification réussie',
        description: 'La console doit prouver que Bob a reçu un SMS.',
        passed: false,
        hint: 'Vérifiez la sortie console avec "SMS : Facture de 120 € générée".'
      }
    ]
  }
];
