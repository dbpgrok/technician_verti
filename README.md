# technician_verti

Dépôt du module vertical et propriétaire du contrat TypeScript partagé par
l'architecture `technician_verti` / `technician_hori` / `technician_media`.
Ce guide présente les trois dépôts et les vérifications à effectuer avant
d'envoyer une modification.

## 1. Description et rôle dans l'architecture

- **Verti** définit les types et interfaces partagés, notamment
  `SystemMetrics`, `MediaAsset` et `PodcastMetadata`. C'est le point de départ
  pour toute évolution de ces contrats.
- **Hori** implémente le module horizontal et consomme le contrat de Verti.
- **Media** héberge les médias optimisés et leur catalogue
  `media-manifest.json`. Les propriétés du manifeste doivent rester compatibles
  avec `MediaAsset` et `PodcastMetadata`.

Les trois dépôts ont des historiques Git indépendants. Une modification du
contrat doit être coordonnée avec Hori ; une modification du manifeste ou des
fichiers médias se fait dans Media.

## 2. Création, structure et configuration

Pour travailler avec des chemins relatifs entre dépôts, placez les trois clones
au même niveau dans un workspace :

```text
workspace/
├── technician_verti/
├── technician_hori/
└── technician_media/
```

Clonage initial :

```bash
mkdir -p ~/workspace
cd ~/workspace
git clone https://github.com/dbpgrok/technician_verti.git
git clone https://github.com/dbpgrok/technician_hori.git
git clone https://github.com/dbpgrok/technician_media.git
```

Structure de référence de Verti :

```text
technician_verti/
├── .github/copilot-instructions.md
├── src/contract.ts
└── README.md
```

Les instructions de `.github/copilot-instructions.md` rappellent que Verti
gère la partie verticale et que ses interfaces doivent rester cohérentes avec
Hori. Le dépôt ne fournit actuellement ni `package.json` ni `tsconfig.json` :
les commandes TypeScript ci-dessous fixent donc explicitement les options de
compilation.

## 3. Cas d'usage : quand intervenir dans Verti

Intervenez ici pour ajouter ou modifier une interface partagée, corriger un type
utilisé par Hori, ou faire évoluer le contrat des métadonnées et des médias.
Avant de modifier un type utilisé par Hori, vérifiez son consommateur et
coordonnez les changements incompatibles. N'ajoutez pas les fichiers médias ni
le manifeste dans Verti : ils appartiennent à Media.

## 4. Exemples de tests et commandes

Vérifier la branche et les modifications :

```bash
git status --short --branch
git diff --check
git diff
```

Vérifier la syntaxe et les types du contrat (depuis la racine de Verti, avec
Node.js et npm disponibles) :

```bash
npx --yes --package typescript tsc --noEmit --strict --target ES2020 --moduleResolution node src/contract.ts
```

Vérifier aussi le consommateur Hori depuis son dépôt. Les trois clones doivent
être des dossiers frères pour que l'import relatif du consommateur soit
résolu :

```bash
cd ../technician_hori
npx --yes --package typescript tsc --noEmit --strict --target ES2020 --moduleResolution node src/consumer.ts
```

Le manifeste est vérifié dans Media :

```bash
cd ../technician_media
python -m json.tool media-manifest.json > /dev/null
```

Cette dernière commande confirme uniquement que le document est du JSON valide.
Pour contrôler le schéma et vérifier la présence des assets référencés, suivre
le contrôle Python décrit dans le README de Media.

## 5. Guide de dépannage

### Limite de deux Codespaces simultanés

Si le compte ou l'organisation limite à deux Codespaces actifs simultanément,
utilisez de préférence un seul Codespace contenant les trois clones frères.
Arrêtez un Codespace inutilisé avant d'en démarrer un autre ; le nombre de
dépôts n'impose pas de démarrer un Codespace par dépôt.

### Authentification Git ou GitHub CLI

Vérifiez d'abord le compte et les autorisations :

```bash
gh auth status
gh auth login
gh auth setup-git
```

Choisissez `github.com` et le protocole correspondant à l'URL du dépôt
(HTTPS ou SSH). En HTTPS, reconnectez-vous avec `gh auth login` si les
identifiants mémorisés sont refusés. En SSH, vérifiez la clé avec
`ssh -T git@github.com`. Ne partagez et ne collez jamais de jeton dans un
fichier ou une conversation.

### Historiques distants sans ancêtre commun

`--allow-unrelated-histories` n'est à utiliser que si Git indique explicitement
que les historiques n'ont pas de lien (par exemple après une initialisation
locale et une initialisation distante séparées). Vérifiez le dépôt et faites
une sauvegarde de la branche avant de fusionner :

```bash
git fetch origin
git log --oneline --graph --all -20
git merge --allow-unrelated-histories origin/main
```

Résolvez les conflits fichier par fichier, puis exécutez les tests. Ne fusionnez
pas les historiques de Verti, Hori et Media entre eux : ce sont trois dépôts
indépendants.

### Manifeste invalide ou assets manquants

Le manifeste appartient à Media. Exécutez d'abord `python -m json.tool
media-manifest.json`, puis le contrôle de schéma et de présence des fichiers
indiqué dans le README de Media. Vérifiez que chaque chemin est relatif à la
racine de Media, qu'il ne contient pas de remontée `..`, que le fichier existe
et que `coverAssetId` désigne une image déclarée. Ne masquez pas un échec en
retirant simplement l'asset du contrôle : corrigez le chemin ou ajoutez le
fichier attendu.
