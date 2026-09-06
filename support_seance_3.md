# Séance 3 — Présentation générale d'Angular

## Description de la séance

- **Bloc** : 0 — Mise en route (séances 1 à 4)
    
- **Durée** : 3 heures
    
- **Préréquis** : Séances 1 (Introduction générale à l'OO & Git) et 2 (Présentation du langage TypeScript)
    
- **Objectif principal** : Comprendre le fonctionnement d'une application monopage (SPA), appréhender la structure et l'écosystème d'un projet Angular moderne (version 21/22), comprendre l'anatomie d'un composant _standalone_ et se familiariser avec l'environnement de développement local.
    

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant sera capable de :

1. **Expliquer** la différence conceptuelle et technique entre une application web traditionnelle (Multi-Page Application — MPA) et une application monopage (Single Page Application — SPA).
    
2. **Identifier** la fonction et le rôle de chaque dossier et fichier clé dans l'arborescence standard d'un projet généré par le CLI Angular.
    
3. **Décrire** l'anatomie d'un composant Angular _standalone_ (décorateur `@Component`, logique TypeScript, template HTML, style CSS scopé).
    
4. **Tracer** le flux d'exécution initial d'une application Angular, depuis le chargement du fichier `index.html` jusqu'à l'instanciation du composant racine dans le DOM.
    
5. **Manipuler** l'environnement de développement local : exécuter un projet Angular cloné via Git, lancer le serveur de développement (`ng serve`) et interagir avec les commandes de base du CLI.
    

## 1. Partie théorique

### 1.1 Architecture des applications Web : MPA vs SPA

#### 1.1.1 L'approche traditionnelle : Multi-Page Application (MPA)

Dans l'architecture web classique dite _Multi-Page Application_ (MPA), chaque interaction nécessitant un changement de vue ou de données donne lieu à une requête HTTP du client (le navigateur) vers le serveur web. Le serveur génère dynamiquement une nouvelle page HTML complète (par exemple via PHP, Java EE, ASP.NET) et la renvoie au navigateur.

```
+------------------+                    +------------------+
|                  | --- Requête HTTP ->|                  |
|    Navigateur    |                    |   Serveur Web    |
|    (Client)      | <- Page HTML ----- |   (Rendu HTML)   |
+------------------+    complète        +------------------+
```

Ce modèle présente plusieurs limites majeures pour les applications modernes :

- **Latence et réactivité globale** : Chaque transition entraîne un rechargement complet de la page (effet de « flash » blanc), détruisant l'état du DOM et sollicitant inutilement le réseau pour télécharger à nouveau les scripts, styles et en-têtes identiques.
    
- **Couplage fort** : La logique de présentation (rendu HTML) est intimement liée à la logique serveur, rendant difficile la réutilisation des fonctionnalités pour d'autres clients (applications mobiles, tiers).
    
- **Charge serveur élevée** : Le serveur consacre une partie importante de ses ressources à composer du HTML plutôt qu'à exécuter la seule logique métier.
    

#### 1.1.2 L'approche moderne : Single Page Application (SPA)

Une _Single Page Application_ (SPA) est une application web qui ne charge qu'une seule page HTML (`index.html`) lors de la première requête. L'ensemble des interactions ultérieures avec l'utilisateur (navigation entre pages virtuelles, soumission de formulaires, mises à jour de données) s'effectue sans rechargement de la page.

```
                +---------------------------------------+
                |          Chargement Initial           |
                |   Index.html + Scripts JS + Styles    |
                +---------------------------------------+
                                    |
                                    v
+------------------+                    +------------------+
|                  | --- Requête JSON ->|                  |
|    Navigateur    |     (AJAX/Fetch)   |    API REST /    |
|   (SPA - Exec)   |                    |    Backend       |
|                  | <- Données JSON ---|                  |
+------------------+                    +------------------+
```

##### Mécanisme de fonctionnement d'une SPA

1. **Chargement initial** : Le navigateur télécharge le document `index.html` (très minimal), accompagné des bundles JavaScript et CSS compilés.
    
2. **Prise en main par le client** : Le code JavaScript s'exécute dans le navigateur et prend le contrôle de l'IHM (Interface Homme-Machine).
    
3. **Rendu dynamique** : Le DOM est modifié localement et dynamiquement par le framework (ex. Angular) en fonction des actions de l'utilisateur.
    
4. **Communication asynchrone** : Lorsque des données métier sont nécessaires, le client effectue des requêtes HTTP asynchrones (via l'API `Fetch` ou l'HTTP Client d'Angular) vers une API web (REST/GraphQL). Le serveur ne renvoie que des données brutes, généralement au format JSON.
    
5. **Routage côté client** : La navigation entre les "pages" est interceptée par un routeur JavaScript qui met à jour l'URL du navigateur via l'API HTML5 `History` sans déclencher de requête serveur pour une nouvelle page HTML.
    

##### Avantages et inconvénients des SPA

|   |   |
|---|---|
|**Avantages**|**Inconvénients / Défis**|
|**Expérience utilisateur fluide** (proche d'une application native).|**Temps de chargement initial** potentiellement plus long (taille du bundle JS).|
|**Séparation stricte** entre Frontend (UI) et Backend (API).|**Indexation SEO** complexe si le rendu est exclusivement côté client (_Client-Side Rendering_).|
|**Réduction de la charge serveur** (le serveur ne fournit que de la donnée JSON).|**Gestion de l'état** et de la mémoire entièrement à la charge du client.|
|**Réutilisabilité** des API du backend pour d'autres clients (apps mobiles).|**Dépendance à JavaScript** (nécessite l'exécution du JS sur le client).|

### 1.2 Présentation du Framework Angular et de son CLI

#### 1.2.1 Qu'est-ce qu'Angular ?

**Angular** est une plateforme et un framework de développement web open source maintenu par **Google** et une vaste communauté. Développé en TypeScript depuis sa refonte majeure (historiquement Angular 2+), Angular est un framework complet (_opinionated_ ou « clé en main »), fournissant de manière intégrée :

- Une architecture basée sur des composants _standalone_.
    
- Un moteur d'injection de dépendances puissant.
    
- Un système de routage avancé.
    
- Des outils de gestion de formulaires et de communication HTTP.
    
- Une réactivité moderne basée sur l'API **Signals** (réactivité à granularité fine).
    

#### 1.2.2 Le CLI Angular (`@angular/cli`)

Le **CLI** (_Command Line Interface_) est l'outil officiel en ligne de commande permettant de créer, développer, scaffold (générer du code), tester et déployer des applications Angular.

##### Commandes essentielles du CLI :

- **`ng new <nom-du-projet>`** : Initialise une nouvelle application Angular avec la structure de répertoires standard et les configurations recommandées.
    
- **`ng serve`** (ou `npm start`) : Compile l'application en mémoire, démarre un serveur de développement local (par défaut sur `http://localhost:4200`) et active le rafraîchissement automatique à chaud (_Live Reload_).
    
- **`ng generate <type> <nom>`** (ou `ng g ...`) : Génère de nouveaux blocs de code respectant les bonnes pratiques de la communauté (ex. `ng g component pages/home`, `ng g service services/user`).
    
- **`ng build`** : Compile et optimise l'application pour la production (minification, tree-shaking) dans le dossier `dist/`.
    
- **`ng test`** : Exécute la suite de tests unitaires du projet.
    

### 1.3 Arborescence et structure d'un projet Angular (v21/22)

Lorsqu'un projet Angular moderne est créé, l'organisation des fichiers répond à une convention stricte.

```
mon-projet-angular/
├── .angular/                  # Cache interne du compilateur Angular
├── node_modules/              # Dépendances Node.js / npm du projet
├── public/                    # Fichiers statiques (images, favicons, fonts...)
├── src/                       # Code source principal de l'application
│   ├── app/                   # Fichiers de l'application Angular
│   │   ├── app.component.css  # Styles CSS spécifiques au composant racine
│   │   ├── app.component.html # Template HTML du composant racine
│   │   ├── app.component.spec.ts # Fichier de test unitaire
│   │   ├── app.component.ts   # Logique TypeScript du composant racine
│   │   ├── app.config.ts      # Configuration globale de l'application (providers, router)
│   │   └── app.routes.ts      # Définition de la table de routage
│   ├── index.html             # Unique fichier HTML servi par l'application
│   ├── main.ts                # Point d'entrée TypeScript de l'application
│   └── styles.css             # Styles CSS globaux de l'application
├── angular.json               # Fichier de configuration du CLI Angular
├── package.json               # Déclarations des dépendances npm et scripts
├── tsconfig.json              # Configuration de base du compilateur TypeScript
└── tsconfig.app.json          # Configuration TypeScript spécifique à l'application
```

#### Rôle détaillé des fichiers stratégiques

1. **`src/index.html`** : Le document HTML principal. Il contient l'en-tête HTML classique, les métadonnées et la balise personnalisée racine `<app-root></app-root>`. Aucun code HTML métier n'est écrit directement dans ce fichier.
    
2. **`src/main.ts`** : Le point d'entrée exécutable de l'application. C'est ici que la fonction `bootstrapApplication()` est appelée pour démarrer l'application Angular en chargeant le composant racine (`AppComponent`) avec la configuration issue de `app.config.ts`.
    
3. **`src/app/app.config.ts`** : Contient la configuration globale de l'application (définie via le type `ApplicationConfig`), telle que la fourniture du routeur (`provideRouter(routes)`) ou du client HTTP (`provideHttpClient()`), sans recourir à d'anciens modules (`NgModule`).
    
4. **`src/app/app.component.ts`** : Le composant de niveau supérieur (racine). Tous les autres composants de l'interface seront imbriqués directement ou indirectement au sein de celui-ci.
    
5. **`angular.json`** : Le fichier maître de configuration du projet. Il indique au CLI Angular où se trouvent les sources, quels fichiers de styles globaux inclure, comment compiler l'application selon les environnements (développement, production), etc.
    

### 1.4 Vue d'ensemble d'un composant Angular Standalone

#### 1.4.1 Concept de composant

En Angular, l'interface utilisateur est construite sous la forme d'un **arbre de composants**. Un composant est une unité autonome qui regroupe :

- La **logique applicative et l'état** (écrite en TypeScript dans une classe).
    
- La **vue** (écrite en HTML dans un template).
    
- Le **style visuel** (écrit en CSS/SCSS, scopé spécifiquement au composant).
    

```
         +------------------------+
         |     AppComponent       |
         +------------------------+
           /                    \
          v                      v
+------------------+    +------------------+
| HeaderComponent  |    | SidebarComponent |
+------------------+    +------------------+
```

#### 1.4.2 Anatomie du code d'un composant Standalone

Depuis Angular 15+ (et de façon définitivement généralisée en Angular 17-22), les composants sont **standalone** : ils n'ont plus besoin d'être déclarés dans un `NgModule`. Ils gèrent explicitement leurs propres dépendances via le décorateur `@Component`.

Voici la structure type du fichier `app.component.ts` :

```
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'Application de démonstration';
  author: string = 'Département Informatique';
}
```

##### Analyse des éléments du décorateur `@Component` :

- **`selector`** : Définit la balise HTML personnalisée permettant d'instancier ce composant dans un template (ex. `<app-root></app-root>`).
    
- **`standalone: true`** : Indique qu'il s'agit d'un composant autonome (optionnel si réglé par défaut dans les versions récents d'Angular, mais explicite).
    
- **`imports`** : Liste des composants, directives, pipes ou modules Angular directement utilisés à l'intérieur du template HTML de ce composant.
    
- **`templateUrl`** : Chemin relatif vers le fichier HTML contenant le template de la vue (alternative : `template` pour du code HTML écrit inline dans la chaîne de caractères).
    
- **`styleUrl`** : Chemin relatif vers le fichier de style CSS appliqué au composant.
    

#### 1.4.3 Principes de base de la liaison de données (_Template Binding_)

Dans cette séance d'introduction, trois formes élémentaires de liaisons de données au sein du template HTML sont abordées (sans encore entrer dans le détail de l'API des Signals) :

##### 1. L'Interpolation : `{{ expression }}`

Permet d'évaluer une expression TypeScript et d'injecter son résultat texte directement dans le DOM HTML.

_Exemple dans le fichier HTML (`app.component.html`) :_

```
<h1>Bienvenue sur {{ title }}</h1>
<p>Auteur : {{ author }}</p>
```

##### 2. La liaison de propriété (_Property Binding_) : `[propriete]="expression"`

Permet de lier dynamiquement une valeur de la classe TypeScript à une propriété d'un élément HTML ou d'un composant enfant.

_Exemple dans le fichier HTML :_

```
<button [disabled]="isButtonDisabled">Valider</button>
<img [src]="imageUrl" alt="Illustration" />
```

##### 3. La liaison d'événement (_Event Binding_) : `(evenement)="methode()"`

Permet d'écouter un événement émis par le DOM (ex. clic, survol, saisie clavier) et de déclencher une méthode membre de la classe du composant.

_Exemple dans la classe (`app.component.ts`) :_

```
export class AppComponent {
  counter: number = 0;

  incrementCounter(): void {
    this.counter++;
  }
}
```

_Exemple dans le template (`app.component.html`) :_

```
<p>Compteur : {{ counter }}</p>
<button (click)="incrementCounter()">Incrémenter</button>
```

### 1.5 Flux d'exécution au démarrage de l'application

Afin de bien comprendre l'enchaînement technique lors de l'accès à une application Angular, le processus s'effectue en 4 étapes clés :

```
1. Requête HTTP -> Serveur renvoie index.html
2. Le navigateur lit index.html et charge main.ts (compilé en JS)
3. main.ts exécute bootstrapApplication(AppComponent, appConfig)
4. Angular remplace la balise <app-root> par le rendu du composant AppComponent
```

## 2. Démonstration Angular (Trame guidée)

L'enseignant met à disposition des étudiants un dépôt Git contenant une application minimaliste. Les étudiants effectuent un `git clone` puis suivent la démonstration pas à pas.

### Objectifs de la démonstration :

1. Cloner, installer et démarrer un projet Angular réel.
    
2. Suivre visuellement le flux d'exécution complet du code.
    
3. Modifier le composant racine et observer la réactivité de l'environnement de développement (_Live Reloading_).
    
4. Découvrir l'isolation des styles CSS (_View Encapsulation_).
    

### Étape 1 : Récupération du projet et lancement

1. Ouvrir le terminal dans l'environnement IDE (ex. WebStorm).
    
2. Cloner le dépôt d'exemple fourni par l'enseignant :
    
    ```
    git clone https://github.com/enseignement/angular-demo-seance3.git
    cd angular-demo-seance3
    ```
    
3. Télécharger les dépendances déclarées dans `package.json` :
    
    ```
    npm install
    ```
    
4. Lancer le serveur de développement local :
    
    ```
    npm start
    ```
    
    _(Ou la commande directe : `npx ng serve`)_
    
5. Ouvrir le navigateur à l'adresse indiquée : `http://localhost:4200`.
    

### Étape 2 : Exploration guidée du code par l'enseignant

#### Inspection de `src/index.html`

L'enseignant montre le contenu de `index.html` :

```
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Démo Séance 3 - Angular</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

_Point d'attention_ : Noter l'absence de tout contenu textuel dans le `<body>` en dehors de la balise `<app-root></app-root>`.

#### Inspection de `src/main.ts`

L'enseignant montre comment Angular amorce l'application :

```
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

#### Inspection et modification de `src/app/app.component.ts`

L'enseignant ouvre le composant principal et explique les annotations :

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
```

#### Modification du template `src/app/app.component.html`

L'enseignant modifie le fichier HTML pour illustrer les liaisons de données :

```
<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
```

#### Inspection du style isolé `src/app/app.component.css`

L'enseignant ajoute du style dans le fichier CSS spécifique du composant :

```
.card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.online {
  color: green;
  font-weight: bold;
}

.offline {
  color: red;
  font-weight: bold;
}
```

#### Observation du résultat

L'enseignant montre dans le navigateur :

1. Le rendu initial généré par Angular à l'intérieur de `<app-root>`.
    
2. Le clic sur le bouton qui déclenche la méthode `toggleStatus()`, modifiant la propriété `isOnline` et mettant immédiatement à jour le DOM sans aucun rechargement de page.
    

## 3. Prise en main guidée / Exercices d'application

Ces exercices sont conçus sous forme d'ateliers de prise en main guidée sur l'ordinateur de l'étudiant. Il ne s'agit pas de produire une logique OO complexe, mais de manipuler l'environnement, le CLI et les liaisons de composants.

### Atelier 3.1 — Exploration de l'arborescence et modification d'informations de base

#### Énoncé

1. Assurez-vous d'avoir démarré le projet minimal en local (`npm start`).
    
2. Dans le fichier `app.component.ts`, ajoutez deux nouvelles propriétés à la classe `AppComponent` :
    
    - `studentName` (chaine de caractères) contenant votre nom et prénom.
        
    - `academicYear` (chaine de caractères) contenant l'année académique courante (ex. `'2025-2026'`).
        
3. Dans `app.component.html`, modifiez le template pour afficher ces deux variables sous la forme d'un paragraphe au bas de la carte.
    
4. Observez le rafraîchissement automatique dans votre navigateur web sans recharger la page manuellement.
    

### Atelier 3.2 — Découverte de la liaison d'événement et de propriété

#### Énoncé

1. Dans `app.component.ts`, ajoutez une propriété `clickCount` de type `number` initialisée à `0`.
    
2. Ajoutez une méthode `resetCounter(): void` qui remet la valeur de `clickCount` à `0`.
    
3. Ajoutez une méthode `increment(): void` qui augmente `clickCount` de `1`.
    
4. Dans `app.component.html` :
    
    - Affichez le nombre de clics dans un élément de titre `<h3>`.
        
    - Créez un bouton « Compter » qui appelle la méthode `increment()`.
        
    - Créez un bouton « Réinitialiser » qui appelle la méthode `resetCounter()`.
        
    - Désactivez le bouton « Réinitialiser » en utilisant le _Property Binding_ `[disabled]` lorsque `clickCount` est égal à `0`.
        

### Atelier 3.3 — Génération d'un composant via le CLI Angular

#### Énoncé

1. Dans le terminal de votre IDE, ouvrez un nouvel onglet ou stoppez temporairement le serveur de développement (`Ctrl + C`).
    
2. Exécutez la commande du CLI permettant de générer un nouveau composant nommé `header` situé dans un dossier `components` :
    
    ```
    npx ng generate component components/header
    ```
    
3. Observez les 4 fichiers générés par le CLI dans le répertoire `src/app/components/header/`.
    
4. Inspectez le fichier `header.component.ts` et notez la valeur spécifiée dans la propriété `selector` du décorateur `@Component`.
    
5. Intégrez ce composant `HeaderComponent` dans votre composant principal `AppComponent` :
    
    - Ajoutez `HeaderComponent` dans le tableau `imports` de `@Component` au sein de `app.component.ts`.
        
    - Placez la balise du sélecteur au tout début du fichier `app.component.html`.
        
6. Relancez l'application (`npm start`) et vérifiez le rendu dans le navigateur.
    

### Atelier 3.4 — Vérification de l'encapsulation du style CSS

#### Énoncé

1. Ouvrez le fichier de style du composant d'en-tête récemment créé (`header.component.css`).
    
2. Ajoutez une règle ciblant la balise `p` :
    
    ```
    p {
      color: purple;
      font-style: italic;
    }
    ```
    
3. Observez le comportement dans le navigateur :
    
    - Les paragraphes `<p>` situés à l'intérieur du composant `HeaderComponent` deviennent-ils violets ?
        
    - Les paragraphes `<p>` situés dans le composant `AppComponent` deviennent-ils violets ? Pourquoi ?
        
4. Inspectez l'élément HTML via le panneau de développement de votre navigateur (`F12` / Inspecter) et observez les attributs générés automatiquement par Angular (ex. `_ngcontent-ng-c...`).
    

## Corrections des Ateliers

### Correction Atelier 3.1

#### Fichier `src/app/app.component.ts`

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;

  // Ajout des nouvelles propriétés (Atelier 3.1)
  studentName: string = 'Jean Dupont';
  academicYear: string = '2025-2026';

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
```

#### Fichier `src/app/app.component.html`

```
<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <!-- Affichage des informations de l'étudiant (Atelier 3.1) -->
  <p>Étudiant : <strong>{{ studentName }}</strong> (Année académique : {{ academicYear }})</p>

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
```

### Correction Atelier 3.2

#### Fichier `src/app/app.component.ts`

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;
  studentName: string = 'Jean Dupont';
  academicYear: string = '2025-2026';

  // Propriété du compteur (Atelier 3.2)
  clickCount: number = 0;

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }

  // Méthodes pour gérer le compteur (Atelier 3.2)
  increment(): void {
    this.clickCount++;
  }

  resetCounter(): void {
    this.clickCount = 0;
  }
}
```

#### Fichier `src/app/app.component.html`

```
<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <p>Étudiant : <strong>{{ studentName }}</strong> (Année {{ academicYear }})</p>

  <!-- Section Compteur (Atelier 3.2) -->
  <hr />
  <h3>Nombre d'interactions : {{ clickCount }}</h3>
  <button (click)="increment()">Compter</button>
  <button (click)="resetCounter()" [disabled]="clickCount === 0">Réinitialiser</button>
  <hr />

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
```

### Correction Atelier 3.3

#### 1. Commande de génération CLI exécutée dans le terminal

```
npx ng generate component components/header
```

#### 2. Fichier généré `src/app/components/header/header.component.ts`

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title: string = 'En-tête de l\'application';
}
```

#### 3. Fichier `src/app/app.component.ts` mis à jour

```
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // Importation du composant généré

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent], // Déclaration de HeaderComponent dans les imports
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Logic inchangée...
}
```

#### 4. Fichier `src/app/app.component.html` mis à jour

```
<!-- Inclusion de la balise du sélecteur HeaderComponent -->
<app-header></app-header>

<div class="card">
  <!-- Reste du template HTML -->
</div>
```

### Correction Atelier 3.4

#### Explication du comportement observé :

Seuls les paragraphes `<p>` situés dans le template du composant `HeaderComponent` prennent la couleur violette et l'alignement en italique. Les paragraphes `<p>` présents dans `AppComponent` restent totalement insensibles à cette règle CSS.

#### Raison technique (Isolation des styles / _View Encapsulation_) :

Par défaut, Angular applique un mécanisme d'encapsulation de style (_ViewEncapsulation.Emulated_). Lors de la compilation, le framework ajoute un attribut d'identification unique à chaque élément HTML généré par un composant spécifique (par exemple `_ngcontent-ng-c123456789`).

Les règles CSS écrites dans `header.component.css` sont réécrites à la volée par Angular sous la forme :

```
p[_ngcontent-ng-c123456789] {
  color: purple;
  font-style: italic;
}
```

Ce mécanisme garantit que les règles de style définies dans un composant n'affectent jamais les autres composants de l'application, évitant ainsi les effets de bord et la pollution des styles globaux.