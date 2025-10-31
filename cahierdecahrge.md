🧭 Cahier des Charges — Template Vue 3 + Firebase Realtime + CMS intégré
📘 Objectif global
Créer un template complet Vue 3 / Vite / Firebase duplicable, incluant :
•	Une base Vue 3 + Pinia + Router + i18n (FR/EN),
•	Authentification (email, Google, anonyme),
•	Base de données Firebase Realtime,
•	Un CMS intégré (page Settings) permettant :
o	la personnalisation du thème (couleurs, layout),
o	la gestion de la navbar/footer,
o	l’édition i18n en ligne (FR/EN) avec flux Draft → Preview → Publish → Audit → Restore,
•	Un backend Node.js pour automatiser backups et maintenance,
•	Une architecture claire, modulaire et réutilisable.
 
🧩 Technologies principales
Domaine	Choix	Raison
Frontend	Vue 3 + Vite	Rapide, moderne, modulaire
State	Pinia	Simple, lisible, scalable
Routing	Vue Router	Intégré, guards flexibles
Auth	Firebase Authentication	Email, Google, Anonyme
DB	Firebase Realtime Database	Temps réel + sécurité RLS simple
i18n	Vue I18n	Multilingue (FR/EN), extensible
Backend	Node.js (scripts orchestrés)	Maintenance, backups
CI	GitHub Actions	Build + tests (smoke) automatiques
 
⚙️ Arborescence du projet
your-app/
├─ .env.development
├─ .env.production
├─ package.json
├─ vite.config.js
├─ index.html
├─ README.md
├─ docs/
│  ├─ realtime-rules.md               # Règles de sécurité DB
│  ├─ architecture-decisions.md       # Choix structurants
│  └─ cms-settings.md                 # Spécifications CMS
├─ .github/
│  └─ workflows/
│     └─ ci.yml                       # Pipeline build + tests
├─ backend/
│  ├─ package.json
│  ├─ index.js                        # Orchestrateur
│  └─ scripts/
│     ├─ hello.js
│     ├─ db-maintenance.js
│     ├─ backup-i18n.js
│     └─ backup-settings.js
└─ src/
   ├─ main.js                         # Bootstrap Vue/Pinia/Router/i18n
   ├─ App.vue                         # ErrorBoundary + Layout dynamique
   ├─ assets/
   │  └─ css/main.css                 # Variables CSS + reset
   ├─ router/index.js                 # Routes + guards
   ├─ stores/
   │  ├─ app.js
   │  ├─ auth.js
   │  └─ settings.js
   ├─ i18n/
   │  ├─ i18n.js
   │  └─ i18n-schema.md
   ├─ firebase/firebase.js
   ├─ layouts/
   │  ├─ DefaultLayout.vue
   │  └─ AuthLayout.vue
   ├─ components/
   │  ├─ NavBar.vue
   │  ├─ AppFooter.vue
   │  ├─ Toasts.vue
   │  ├─ ErrorBoundary.vue
   │  ├─ ThemePreview.vue
   │  ├─ ToggleList.vue
   │  └─ I18nEditor.vue
   ├─ composables/
   │  ├─ useDb.js
   │  ├─ useAuthGuard.js
   │  ├─ useToast.js
   │  ├─ useThemeVars.js
   │  └─ useI18nLive.js
   ├─ helpers/
   │  ├─ validate.js
   │  └─ cms-validators.js
   └─ pages/
      ├─ Home.vue
      ├─ About.vue
      ├─ Contact.vue
      ├─ Product.vue
      ├─ Price.vue
      └─ Settings.vue
________________________________________
🧱 Structure Realtime Database
/app/
  ├─ public/                         # Lecture publique, aucune écriture
  ├─ private/{uid}/...               # Lecture/écriture réservée à {uid}
  ├─ settings/
  │   ├─ current/                    # Version publiée
  │   ├─ draft/                      # Version en édition
  │   └─ audit/{timestamp}/          # Snapshots complets + résumé
  └─ i18n/
      ├─ live/{locale}/...           # Traductions publiées
      ├─ draft/{locale}/...          # Traductions en édition
      └─ audit/{timestamp}/          # Snapshots complets + résumé
/users/
  └─ {uid}/role                      # "user" | "editor" | "admin"
________________________________________
🔐 Sécurité (concept des règles Realtime DB)
Chemin	Lecture	Écriture	Rôle requis
/app/settings/current	Publique	Admin/Editor	✳️
/app/settings/draft	Admin/Editor	Admin/Editor	⚙️
/app/settings/audit/**	Admin/Editor	Admin/Editor	🕒
/app/i18n/live/**	Publique	Admin/Editor	✳️
/app/i18n/draft/**	Admin/Editor	Admin/Editor	⚙️
/app/i18n/audit/**	Admin/Editor	Admin/Editor	🕒
/app/private/{uid}/**	{uid}	{uid}	🔒
/users/{uid}	{uid}/Admin	{uid}/Admin	👤
________________________________________
🧭 Décisions techniques validées
Sujet	Décision	Raison
Lecture publique	✅ Oui pour settings/current & i18n/live	Performances & simplicité
Rôles	Hybride : user, editor, admin + claims	Délégation fine
i18n	Namespaces + clés en dot-case (nav.home)	Lisible, structuré
Audit	Snapshots complets + résumé	Restauration immédiate
i18n format	JSON plat { "nav.home": "Accueil" }	Facile à éditer/importer/exporter
________________________________________
🧰 Fonctionnalités principales
🔐 Authentification
•	Firebase Auth : Email+MDP, Google, Anonyme.
•	Navbar : login/logout, affichage session.
•	Guards :
o	requireAuthGuard : bloque routes protégées.
o	requireRoleGuard("editor"|"admin") : protège /settings.
________________________________________
🧑‍🎨 CMS — Page “Settings”
Objectifs
Gérer en ligne :
•	Thème (couleurs, variables CSS),
•	Navbar / Footer (visibilité, ordre, labels),
•	Textes i18n (FR/EN),
•	Réglages généraux (titre, langues, flags),
•	Historique (audit, restore).
Fonctionnalités
Action	Description
Preview	Applique le brouillon localement sans publication
Publish	Copie draft → current / draft → live et crée snapshot audit
Reset	Recharge draft depuis current / live
Restore	Restaure snapshot d’audit dans draft
Audit	Stocke snapshot complet + résumé humain
Import/Export	JSON plat { "nav.home": "Accueil" } avec support arbre
Séparation logique
•	Theme : couleurs + preview.
•	Navigation/Footer : liste triable + visible/order/labelKey/path.
•	i18n : table clé/valeur (locale+namespace) + recherche + import/export.
•	General : siteTitle, localeDefault, features flags.
•	Historique : audit entries + restore.
________________________________________
🌍 i18n — Internationalisation
•	Locales : fr, en.
•	Structure : dot-case namespaced (nav.home, forms.contact.message.label).
•	Format : JSON plat.
•	Live update : écoute /app/i18n/live/{locale}.
•	Fallback : bundle local (i18n/i18n.js).
________________________________________
🎨 Thème & apparence
•	Variables CSS : --bg, --bg-elev, --fg, --border, --muted.
•	Thème appliqué via useThemeVars → :root.
•	ThemePreview permet de visualiser le brouillon avant publication.
________________________________________
🧩 Composants clés
Composant	Fonction
NavBar.vue	Navigation dynamique + Auth + Lang switch
AppFooter.vue	Texte/visibilité dynamiques
Toasts.vue	Système de notifications
ErrorBoundary.vue	Gestion erreurs UI
ThemePreview.vue	Aperçu en direct du thème
ToggleList.vue	Gestion visuelle des items Navbar/Footer
I18nEditor.vue	Table clé/valeur + recherche + import/export
________________________________________
🧠 Composables
Composable	Rôle
useDb.js	CRUD générique Realtime DB + helper mine(uid)
useAuthGuard.js	Guards (auth + rôle)
useToast.js	Bus toast global
useThemeVars.js	Injection CSS vars (thème)
useI18nLive.js	Merge runtime + écoute live
________________________________________
🧮 Stores Pinia
Store	Rôle
app.js	Flags globaux (ready, UI)
auth.js	Session utilisateur (Firebase Auth)
settings.js	Core CMS (draft, current, i18n live, audit, actions Preview/Publish/Reset/Restore)
________________________________________
🧰 Backend (Node.js)
Script	Description
hello.js	Test pipeline
db-maintenance.js	Nettoyage / migrations
backup-i18n.js	Export i18n live (JSON horodaté)
backup-settings.js	Export settings current (JSON horodaté)
________________________________________
🧪 Tests & CI
•	Tests unitaires minimum (helpers/composables).
•	GitHub Actions :
o	npm ci
o	npm run build
o	npm test
________________________________________
🚀 Roadmap d’implémentation
1.	Bootstrap Vue/Pinia/Router/i18n + CSS global.
2.	Auth store + Navbar (login/logout).
3.	Guards (auth + rôle).
4.	Store Settings (current, draft, i18n live, audit).
5.	Layouts + composants (NavBar, Footer, Toasts).
6.	Pages : Home, About, Contact, Product, Price.
7.	Page Settings : Theme → Nav/Footer → i18n → Général → Historique.
8.	Flux Draft/Preview/Publish/Reset/Restore + Audit.
9.	Backend : maintenance + backup JSON.
10.	CI + Docs finalisation.
________________________________________
✅ Critères d’acceptation
Fonction	Condition de validation
Auth	Email, Google, anonyme fonctionnels
Product	Inaccessible sans auth
Settings	Réservé admin/editor
Preview	Applique draft sans publication
Publish	Persiste changements en DB
Navbar/Footer	Réagit à settings/current
i18n	Modifications visibles live après publish
Audit	Snapshots complets, restore fonctionnel
Contact	Validation + toasts OK
Sécurité	Aucune écriture publique
CI	Build + tests OK
________________________________________
🧭 Bonnes pratiques finales
•	Lecture publique = contenus visuels, jamais de secrets.
•	Rôles hybrides (simple + claims).
•	Snapshots complets pour audit (rollback instantané).
•	Format i18n plat pour l’édition, arborescent compatible.
•	Respect des namespaces cohérents (nav, home, forms).
•	Toujours documenter toute clé i18n ou feature ajoutée.
•	Backups réguliers (cron ou manuel via scripts backend).
•	Utiliser docs/architecture-decisions.md pour consigner toute évolution.
________________________________________
Souhaites-tu que je te fasse maintenant la checklist développeur par fichier (ligne de tâches) à partir de ce cahier des charges ?
👉 Cela te donnerait un plan d’action direct à suivre dans VS Code, fichier par fichier.
You said:
oui fais 
ChatGPT said:
Parfait — voici la checklist développeur par fichier (zéro code, 100% actionnable). Tu peux la coller dans docs/dev-checklist.md et cocher au fur et à mesure.
________________________________________
✅ Setup de départ (unique)
•	Créer projet Vite + Vue 3.
•	Installer vue, vue-router, pinia, vue-i18n, firebase.
•	Créer .env.development / .env.production avec variables VITE_*.
•	Activer dans Firebase Auth : Email/MDP, Google, Anonyme. Ajouter domaines autorisés (localhost + prod).
•	Créer Realtime DB (région EU conseillée) et préparer arbres /app/*, /users/*.
•	Documenter règles cibles dans docs/realtime-rules.md.
________________________________________
📂 Racine
/index.html
•	Mettre lang="fr", meta viewport.
•	Div unique #app. Titre générique.
/vite.config.js
•	Ajouter plugin Vue.
•	Fixer port dev (5173) si besoin.
/package.json
•	Scripts : dev, build, preview, test (si tu ajoutes vitest).
•	Ajouter type: "module" si usage ESM côté backend.
/README.md
•	Prérequis, installation, variables d’env, démarrage.
•	Lien vers docs/ (règles, décisions, CMS).
________________________________________
🗂️ Docs
docs/realtime-rules.md
•	Décrire lecture publique de settings/current, i18n/live.
•	Décrire écritures protégées (admin/editor) pour drafts, current/live, audit.
•	Préciser /app/private/{uid} lecture/écriture par {uid} uniquement.
•	TBD: blocs de règles finaux à saisir dans console Firebase.
docs/architecture-decisions.md
•	Noter décisions validées (lecture publique, rôles hybrides, i18n dot-case, snapshots, format plat).
•	Ajouter date et raison d’être.
docs/cms-settings.md
•	Décrire flux : Draft → Preview → Publish → Audit → Restore.
•	Définir structure Settings + i18n live (clés/objets attendus).
•	Décrire politique de rétention d’audit (ex. 20 derniers snapshots).
________________________________________
🛠️ Backend
/backend/package.json
•	Scripts : start, backup:i18n, backup:settings, maintenance.
•	Node ESM (type module) si nécessaire.
/backend/index.js
•	Orchestrer l’exécution séquentielle des scripts.
•	Log clair (start/end, erreurs).
•	Paramètres CLI basiques (ex. --dryRun).
/backend/scripts/hello.js
•	Log simple pour valider pipeline.
/backend/scripts/db-maintenance.js
•	Paramètre --dryRun (aucune écriture sans switch).
•	TODO list : migrations futures, nettoyages, vérifs d’intégrité.
/backend/scripts/backup-i18n.js
•	Lire /app/i18n/live/** et écrire un JSON horodaté.
•	Stockage dans /backups/ (local) ou autre cible.
•	Log du nombre de clés exportées.
/backend/scripts/backup-settings.js
•	Lire /app/settings/current et écrire JSON horodaté.
•	Log de la taille / champs principaux.
________________________________________
🌐 Frontend
src/main.js
•	Créer app Vue, brancher Pinia, Router, i18n.
•	Importer assets/css/main.css.
•	Monter sur #app.
src/App.vue
•	Wrapper avec ErrorBoundary.
•	Sélection dynamique du layout via route.meta.layout.
•	Rendre <router-view> dans le layout actif.
________________________________________
🎨 Styles
src/assets/css/main.css
•	Définir variables --bg, --bg-elev, --fg, --border, --muted.
•	Reset léger (box-sizing, margin body).
•	Classe .container (max-width + padding).
•	Vérifier contrastes (AA minimal).
________________________________________
🧭 Router
src/router/index.js
•	Déclarer routes : / Home, /about, /contact, /product (protégée), /price, /settings (rôle).
•	scrollBehavior → top:0.
•	Attacher beforeEnter :
o	requireAuthGuard sur /product.
o	requireRoleGuard('editor'|'admin') sur /settings.
________________________________________
🧠 Stores
src/stores/app.js
•	State : ready (bool), éventuellement marqueurs UI.
•	Action : setReady(true) après bootstrap complet.
src/stores/auth.js
•	State : user, loading.
•	Action init : écouter onAuthStateChanged.
•	Actions : login email/MDP, register, login Google, login anonyme, logout.
•	Getter : isAuthenticated.
src/stores/settings.js
•	State :
o	current (settings publiés),
o	draft,
o	previewMode,
o	i18nLive (par locale),
o	audit (list).
•	Actions :
o	loadCurrent() + écoute temps réel.
o	loadDraft() (uniquement sur /settings) + écoute temps réel.
o	applyPreview() (appliquer en mémoire thème + nav/footer + i18n draft).
o	publishSettings() (copier draft → current + snapshot audit + résumé).
o	resetSettingsDraft() (current → draft).
o	loadI18nLive(locale) + écoute temps réel.
o	publishI18n(locale) (draft → live + snapshot audit + résumé).
o	restoreAuditToDraft(entry) (snapshot → draft).
•	Intégrer useThemeVars pour appliquer current.theme.colors.
________________________________________
🌍 i18n
src/i18n/i18n.js
•	Définir bundle de base FR/EN (clé dot-case namespaced).
•	Initialiser i18n (FR par défaut, fallback EN).
•	Exposer mécanisme de fusion avec i18nLive (runtime).
src/i18n/i18n-schema.md
•	Décrire conventions :
o	Dot-case, pas d’espaces/majuscules.
o	Namespaces (nav, home, forms, etc.).
o	Clés ≤ 64 chars, valeurs ≤ 200 chars (reco).
•	Exemples de clés.
________________________________________
🔥 Firebase
src/firebase/firebase.js
•	Initialiser App depuis import.meta.env.*.
•	Exporter auth, db (Realtime).
•	Ajouter garde-fou si variables manquantes (log clair).
________________________________________
🧩 Layouts & composants
src/layouts/DefaultLayout.vue
•	Inclure NavBar, slot page, AppFooter, Toasts.
•	Pas de logique métier.
src/layouts/AuthLayout.vue
•	Grille centrée, slot pour écrans auth (si besoin).
src/components/NavBar.vue
•	Construire items depuis settings.current.navbar.items triés par order & visible.
•	Afficher labels via i18n (labelKey).
•	Sélecteur FR/EN (persistance locale optionnelle).
•	Zone Auth : boutons login (anonyme/Google) si non auth ; email/“anon” + logout sinon.
src/components/AppFooter.vue
•	Respecter settings.current.footer.visible.
•	Afficher texte via i18n (footer.textKey).
src/components/Toasts.vue
•	Écouter bus (useToast), empiler, auto-dismiss TTL.
src/components/ErrorBoundary.vue
•	Capturer erreurs enfant, afficher message et bouton “Réessayer”.
src/components/ThemePreview.vue
•	Afficher palette draft.theme.colors.
•	Bouton “Prévisualiser” (appliquer en mémoire), “Quitter preview”.
src/components/ToggleList.vue
•	Afficher liste items (Navbar/Footer) avec :
o	drag & drop ou contrôles up/down,
o	visible (checkbox),
o	labelKey (texte),
o	path (route).
•	Émettre événements de mise à jour (sauvegarde dans draft).
src/components/I18nEditor.vue
•	Sélecteur locale + namespace.
•	Table clé/valeur (format plat).
•	Recherche/filtre.
•	Ajouter/supprimer clé.
•	Import/Export JSON plat.
•	Indicateur “modifié vs current”.
________________________________________
🧩 Composables
src/composables/useDb.js
•	Exposer get, set, update, remove, push.
•	mine(path) → /app/private/{uid}/{path} (throw si non auth).
•	Gérer erreurs et logs basiques.
src/composables/useAuthGuard.js
•	requireAuthGuard(to, from, next) :
o	Attendre fin auth.loading.
o	Si auth.user, next(), sinon redirect /.
•	requireRoleGuard(roleOrClaim) :
o	Lire /users/{uid}/role (et/ou claims) puis décider.
o	Redirect / si insuffisant.
src/composables/useToast.js
•	API : success(msg), error(msg), info(msg), show(msg, type, ttl).
•	Bus interne (on/off/emit).
src/composables/useThemeVars.js
•	applyTheme(colors) → écrit CSS vars sur :root.
•	snapshot/revert optionnel pour preview.
src/composables/useI18nLive.js
•	Charger /app/i18n/live/{locale} et fusionner dans i18n runtime.
•	Écouter les changements en temps réel.
•	Fournir helpers : setLiveMessage(locale, key, value) (si utilisé côté Settings).
________________________________________
🧰 Helpers
src/helpers/validate.js
•	required, email, minLen(n), runValidators(value, rules).
src/helpers/cms-validators.js
•	isValidHexColor(str).
•	isValidI18nKey(str) (dot-case).
•	maxLen(str, n).
________________________________________
📄 Pages
src/pages/Home.vue
•	Titre & intro via i18n.
•	Si auth.user, afficher UID (diagnostic).
src/pages/About.vue
•	Texte statique (prévoir clés i18n futures).
src/pages/Contact.vue
•	Champs : email, message.
•	Validations : required + email + longueur max.
•	Afficher erreurs inline.
•	Toast succès (stub, pas d’envoi réel).
src/pages/Product.vue
•	Contenu protégé.
•	Vérifier que guard empêche l’accès si non auth.
src/pages/Price.vue
•	Plans basiques, ou visibilité pilotée par settings.current.features.
src/pages/Settings.vue
•	Route protégée (editor/admin).
•	Onglets :
o	Theme : édition couleurs, Preview, Publish, Reset.
o	Navigation & Footer : ToggleList + clés i18n, Preview/Publish/Reset.
o	i18n : I18nEditor (locale/namespace), Preview (dans runtime), Publish/Reset.
o	Général : siteTitle, localeDefault, localesEnabled, features.
o	Historique : lister snapshots audit, bouton Restore → draft.
•	Actions globales (selon l’onglet) :
o	Preview (en mémoire uniquement).
o	Publish (copie draft → current/live + audit).
o	Reset (current/live → draft).
o	Restore (audit → draft).
________________________________________
🧪 Tests & CI
CI (.github/workflows/ci.yml)
•	Étapes : checkout → setup node → npm ci → npm run build → npm test (si tests).
Tests (au minimum)
•	Smoke test (ex. addition, import i18n, etc.).
•	Tests unitaires ciblés (optionnels) : cms-validators, useThemeVars (applique CSS vars), useI18nLive (merge).
________________________________________
🔐 Rôles & Gouvernance
•	Définir role par utilisateur (/users/{uid}/role).
•	(Optionnel) Définir claims granulaires (ex. canEditSettings, canEditI18n) et endroit de vérité (DB ou custom claims).
•	Procédure d’attribution/révocation (documentée).
________________________________________
♻️ Backups & Audit
•	Mettre en place exécution régulière (manuelle ou cron) de backup-i18n et backup-settings.
•	Politique de rétention snapshots d’audit (ex. 20 derniers / 30 jours).
•	Vérifier que Publish crée bien un snapshot complet + résumé humain.
________________________________________
✅ Recette finale (acceptation)
•	Auth (Email, Google, Anonyme) OK.
•	/product : inaccessible si non auth.
•	/settings : inaccessible sans rôle (editor/admin).
•	Theme Preview : change l’UI sans publier ; Publish persiste.
•	Navbar/Footer : reflètent settings/current.
•	i18n : modifs draft visibles en preview ; Publish bascule live.
•	Audit : snapshots complets + restore vers draft fonctionnel.
•	Contact : validations visibles + toasts OK.
•	Aucune écriture publique dans DB.
•	CI passe (build + tests).

