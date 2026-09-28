# 🏛️ Laboratoire Interactif Angular — Séance 9 : Composition vs Héritage
## Programmation Orientée Objet Avancée & Architecture Modulaire Angular (Bachelier en Informatique — EAFC)

Bienvenue dans l'application web interactive de la **Séance 9**, conçue sur mesure pour les étudiants de Bachelier en Informatique. Cette plateforme pédagogique de pointe a pour objectif de démystifier les pièges de l'héritage d'implémentation (`extends`), de maîtriser la relation **« A un » (*has-a*)**, d'exploiter la **délégation pure**, d'appliquer le principe d'**Inversion des Dépendances (DIP)** et de construire des architectures frontend modulaires et maintenables avec **Angular v22** et **TypeScript**.

---

## 🚀 Fonctionnalités Clés & Pédagogie Active

L'application s'articule autour de **8 modules interactifs complets** et d'un **hub d'ateliers pratiques intégrés avec Monaco Editor** :

### 1. 💥 Pourquoi l'Héritage ne suffit plus ? (Les 3 Pathologies)
* **Simulateur d'Explosion Combinatoire ($2^N$)** : Sélectionnez jusqu'à 4 options orthogonales (Essence/Électrique, Boîte Manuelle/Auto, GPS/Sans GPS, Standard/Longue Autonomie) et observez en direct la multiplication exponentielle des sous-classes requises en héritage (16 classes nécessaires !) face à **1 seule classe composite** en POO propre.
* **Démonstrateur de Fragile Base Class** : Observez en temps réel comment la refactorisation innocente d'une méthode mère (`deposerPlusieurs()`) brise silencieusement les invariants de la classe fille (`CompteAvecJournal`) et duplique les logs comptables.
* **Métaphore de Joe Armstrong** : Le « Gorille et la Banane » (*« Vous vouliez une banane, mais vous obtenez un gorille qui tient la banane, et toute la jungle qui va avec »*). Comparateur interactif entre classe monolithique et services ciblés.

### 2. 📐 Les Piliers Sémantiques : « Est-un » vs « A-un »
* **Diagrammes UML Dynamiques** : Comparaison visuelle entre flèche d'héritage rigide (triangle blanc) et losange de composition/agrégation.
* **Quiz Interactif de Diagnostic (4 questions pièges)** : Auto-évaluation immédiate avec explications détaillées, incluant le piège classique du Carré et du Rectangle (violation du principe de substitution de Liskov - LSP).

### 3. ⚙️ Le Cœur de la Composition : Mécanisme & Délégation
* **Animation Visuelle Pas-à-Pas** : Visualisez le cheminement de l'appel : `Client -> Voiture.demarrer() -> Moteur.demarrer()`. La voiture agit en façade et délègue l'action à son collaborateur interne.
* **Les 3 Vertus Cardinales de la Composition** :
  1. *Spécialisation* : Chaque classe n'a qu'une seule responsabilité (SRP).
  2. *Cloisonnement* : Boîte noire absolue sans fuite d'implémentation.
  3. *Réutilisabilité Transversale* : Le même moteur peut propulser une Voiture, un Bateau ou un Groupe Électrogène sans duplication de code.

### 4. 🔄 Le Super-Pouvoir : Remplacement Dynamique à Chaud (*Runtime Swap*)
* **Banc d'Essai Temps Réel** : Permutez instantanément entre un Moteur Thermique V8 (rugissement sonore, accélération brutale), un Moteur Électrique (couple instantané, silence) et un Moteur Éco (consommation optimisée).
* Observez le compteur de vitesse, la jauge sonore et la jauge d'énergie s'adapter en direct.
* **Conservation d'état** : Le kilométrage et l'identité du véhicule sont préservés lors du remplacement du moteur (strictement impossible avec `extends`).

### 5. 🔌 Découplage par l'Interface & Inversion des Dépendances (DIP)
* **Le Piège du `new` en dur** : Pourquoi `new MoteurThermique()` dans un constructeur annule tous les bénéfices de la composition.
* **Inversion des Dépendances (DIP - SOLID)** : La classe de haut niveau et les briques de bas niveau dépendent toutes d'une abstraction pure (`interface Engine`).
* **Studio de Test & Mocking** : Injectez un `MockEngine` espion pour tester unitairement votre classe en isolation complète sans dépendances réelles.

### 6. 🧭 Le Duel & L'Arbre de Décision Interactif
* **Tableau Comparatif à 8 Critères** : Couplage, Flexibilité, Réutilisabilité, Testabilité unitaire, Taille du code, Encapsulation, Évolution, Complexité.
* **Logigramme Décisionnel Pas-à-Pas** : Répondez aux questions directrices pour savoir avec certitude si vous devez utiliser `extends` ou `has-a`.
* **La Règle d'Or du Gang of Four (GoF, 1994)** : *« Favoriser la composition d'objets par rapport à l'héritage de classes. »*

### 7. 🛡️ Pièges Fréquents & Anti-Patterns Débogués
* **Anti-patron 1 : `Pile extends Array`** :
  * Démonstration interactive de sabotage : utilisez `.splice(1, 1)` pour voler une donnée au milieu de la pile, `.sort()` pour détruire l'ordre chronologique LIFO, ou `.unshift()` pour insérer sous la base.
  * Forteresse par Composition : encapsulation hermétique dans un attribut privé `#elements` où seules les opérations légitimes (`empiler()`, `depiler()`, `sommet`) sont autorisées par le typage.
* **Anti-patron 2 : Le Monstre `BaseComponent` en Angular** :
  * Analyse de l'arbre d'injection pollué par 6 services non utilisés.
  * Comparatif de tests unitaires : 48 lignes de mocks superflus vs 12 lignes limpides avec Angular Standalone.

### 8. 🚗 Démonstration Pratique Angular : Le Garage Modulaire
* **Showroom Interactif de Véhicules Composites** : Flotte de véhicules assemblés (Tesla Model 3, Ford Mustang GT, Renault Zoé, Porsche 911, Toyota Prius, Alpine Alpenglow).
* **Délégation Réactive** : Le clic sur la carte déclenche `car().start()` qui délègue au moteur interne et met à jour un signal réactif `engineSound`.
* **Concepteur de Véhicule sur Mesure** : Assemblez une voiture personnalisée, injectez son moteur et visualisez le code TypeScript correspondant.
* **Explorateur de Code Source Complet** : Visualisation synchrone des interfaces, modèles, composants enfants et composant parent.

### 9. 💻 Le Hub des 25 Micro-Ateliers Monaco
* **25 Micro-Défis Programmés** répartis sur 5 séries thématiques progressives :
  * *Série 1 (Ex 1.1 à 1.5)* : Les Pathologies de l'Héritage & Prise en main du lien « a-un »
  * *Série 2 (Ex 2.1 à 2.5)* : Piliers Sémantiques, Invariants & Composition Interne
  * *Série 3 (Ex 3.1 à 3.5)* : Mécanisme de Délégation, Façades & Réutilisabilité
  * *Série 4 (Ex 4.1 à 4.5)* : Inversion des Dépendances (DIP), Contrats & Mocks
  * *Série 5 (Ex 5.1 à 5.5)* : Anti-Patrons, Refactoring de code legacy & Architecture Angular
* **Environnement de Travail Avancé** :
  * Monaco Editor officiel intégré (coloration syntaxique TypeScript, raccourcis VS Code).
  * Transpilateur et Bac à sable d'exécution JavaScript 100% côté client.
  * Console virtuelle avec capture colorée des `console.log`, `warn`, `error` et `console.assert`.
  * Évaluation multi-critères en temps réel avec badges de statut et persistance `localStorage`.
  * Indices progressifs, affichage de solution officielle et injection directe dans l'éditeur.

---

## 🛠️ Stack Technique

* **Framework** : Angular v22 (dernière version stable, architecture 100% Standalone).
* **Réactivité** : Angular Signals (`signal`, `computed`, `input.required`, `output`).
* **Contrôle de flux moderne** : `@if`, `@for`, `@switch`, `@case`.
* **Éditeur de code** : `monaco-editor` v0.56.0 chargé localement sans dépendance réseau externe obligatoire.
* **Moteur de test** : Vitest v4.1 (suite de 26 tests unitaires automatisés validant 100% des exercices).
* **Styles & Thème** : SCSS modulaire, palette Slate / Indigo / Emerald / Rose avec bascule instantanée Dark Mode / Light Mode.
* **Zéro Git** : Dossier de projet indépendant sans sous-dépôt Git configuré.

---

## 📦 Installation & Lancement

### 1. Installation des dépendances (si nécessaire)
```bash
npm install
```

### 2. Démarrer le serveur de développement
```bash
npm start
# ou
npx ng serve
```
Ouvrez ensuite votre navigateur sur **`http://localhost:4200`**.

### 3. Lancer la suite de tests automatisés (Vitest)
```bash
npx vitest run src/app/core/services/exercise-solutions.spec.ts
```
> **Résultat attendu** : 26 tests passés avec succès (validation des 25 micro-ateliers).

### 4. Compiler pour la production
```bash
npm run build
```
Les fichiers statiques optimisés seront générés dans le dossier `dist/angular-seance9-demo`.

---

## 👨‍🏫 Auteur & Cadre Académique
* **Cours** : Programmation Orientée Objet & Architecture Frontend
* **Établissement** : EAFC Colfontaine (Bachelier en Informatique)
* **Séance** : Séance 9 — Composition vs Héritage (Lien « A un », Délégation, Découplage faible & Architecture modulaire Angular)
