# Support Pédagogique Interactif — Séance 3 : Présentation générale d'Angular

Ce projet est une application web Angular v21/v22 interactive, conçue comme support de cours et démonstrateur pour la **Séance 3 : Architecture SPA, CLI & Composants Standalone**.

---

## 🚀 Fonctionnalités & Modules Pédagogiques

L'application intègre 8 modules de démonstration et de pratique :

1. **Simulateur d'Architecture : MPA vs SPA**
   - Comparateur visuel de flux réseau (rechargement total vs requêtes JSON AJAX/Fetch sans rafraîchissement).
   - Matrice dynamique interactive Avantages / Défis avec filtres thématiques.

2. **Explorateur d'Arborescence & Fichiers Clés**
   - Arborescence interactive représentant la structure standard d'un projet Angular modernisé (`src/`, `main.ts`, `app.config.ts`, `index.html`, etc.).
   - Inspecteur de rôle décrivant la responsabilité de chaque fichier avec extrait de code.

3. **Simulateur de Démarrage (Bootstrap Flow)**
   - Visualiseur séquentiel étape par étape (Étapes 1 à 4) du cycle d'amorçage.
   - Inspecteur du DOM en direct synchronisé.

4. **Anatomie d'un Composant Standalone**
   - Déconstructeur de la classe TypeScript et du décorateur `@Component`.
   - **Mode Rayons X** : Survol des propriétés et affichage des impacts ciblés HTML et CSS.

5. **Bac à Sable des Liaisons de Données (Template Bindings)**
   - Playground interactif sur l'Interpolation `{{ }}`, le Property Binding `[property]` et l'Event Binding `(event)`.

6. **Laboratoire d'Encapsulation CSS (View Encapsulation)**
   - Démonstrateur de l'isolation des styles CSS entre composant Parent et Enfant via l'injection de l'attribut `_ngcontent-ng-c...`.

7. **Console Virtuelle du CLI Angular**
   - Terminal interactif pour exécuter et simuler les commandes clés (`ng serve`, `ng generate component`, `ng build`, `ng test`).

8. **Espace Ateliers Pratiques (Labo Étudiant avec Monaco Editor)**
   - Studio d'apprentissage intégrant l'éditeur Monaco (VS Code).
   - 4 Ateliers pratiques guidés (Ateliers 3.1 à 3.4) avec moteur de validation automatique du code et solution guidée.

---

## 🛠️ Stack Technique

- **Framework** : Angular v21+ (100% Standalone Architecture)
- **Gestion d'état & Réactivité** : Angular Signals (`signal`, `computed`)
- **Syntaxe Templates** : Native Control Flow (`@if`, `@for`, `@switch`)
- **Éditeur de Code** : `@monaco-editor/loader`
- **UI & Stylisme** : Angular Material + Bootstrap CSS & Bootstrap Icons
- **Thème** : Mode Sombre par défaut / Bascule Mode Clair

---

## 📦 Installation & Exécution Locale

### 1. Prérequis
- Node.js `v18+` ou `v20+` ou `v22+`
- npm `v9+` ou `v10+`

### 2. Installation des Dépendances
```bash
npm install --legacy-peer-deps
```

### 3. Démarrage du Serveur de Développement
```bash
npm start
```
Ou via la commande directe Angular CLI :
```bash
npx ng serve
```

Ouvrez ensuite votre navigateur à l'adresse : `http://localhost:4200/`.

---

## 🧪 Ateliers Pratiques inclus dans l'Éditeur Monaco

- **Atelier 3.1** — Déclaration & Interpolation (`studentName`, `academicYear`)
- **Atelier 3.2** — Compteur interactif & Property Binding (`clickCount`, `[disabled]`)
- **Atelier 3.3** — Composant Standalone & Imbrication (`HeaderComponent`, `<app-header>`)
- **Atelier 3.4** — Isolation des styles CSS (`ViewEncapsulation`)
