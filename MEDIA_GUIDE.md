# Configuration de `technician_media`

Ce dépôt dédié héberge les médias et son `media-manifest.json` est la source de
vérité pour leur catalogue. Le contrat TypeScript partagé se trouve dans
`src/contract.ts` de `technician_verti` et doit rester cohérent avec le dépôt
`technician_hori`.

## Arborescence recommandée

```text
technician_media/
├── audios/
│   └── episodes/
├── images/
│   ├── covers/
│   └── slideshow/
├── videos/
├── media-manifest.json
└── README.md
```

Les chemins du manifeste sont relatifs à la racine du dépôt. Utiliser des noms
de fichiers en minuscules, séparés par des tirets, sans espaces ni accents.
Ne référencer dans le manifeste que des fichiers réellement présents.

## Optimisation et formats

- **Images :** WebP, dimensions adaptées à l'affichage (prévoir des variantes
  pour les affichages responsives), métadonnées EXIF supprimées. Viser une
  qualité de 75 à 85 et vérifier visuellement chaque image ; conserver une
  qualité supérieure si les artefacts sont visibles.
- **Audio :** MP3, mono 64–96 kbit/s pour la voix ou stéréo 96–128 kbit/s si le
  contenu le justifie, à 44,1 kHz. Supprimer les silences inutiles et les
  métadonnées non nécessaires.
- **Vidéo :** MP4 avec vidéo H.264 et audio AAC, durée strictement inférieure à
  60 secondes. Viser 480p ou 720p avec un débit vidéo de 600–1 200 kbit/s et un
  débit audio de 64–96 kbit/s ; activer le démarrage rapide (`faststart`).

## Manifeste

`media-manifest.json` contient `version`, les métadonnées du podcast et la
liste `assets`. Chaque ressource possède un identifiant stable, un type, un
titre, un chemin relatif, un format et un type MIME. Renseigner
`durationSeconds` pour les médias audio/vidéo, et `altText`, `width` et
`height` lorsqu'ils sont pertinents pour une image. `coverAssetId` référence
l'identifiant d'une ressource image présente dans `assets`.

## Livraison et intégration sécurisées

- Servir les médias avec une politique de cache adaptée à leur mutabilité :
  préférer `Cache-Control: no-cache, must-revalidate` pour les fichiers
  susceptibles d'être remplacés. Utiliser `no-store` pour tout contenu privé ;
  éviter une longue durée `max-age` immuable pour des URL réutilisées.
- Configurer CORS côté hébergement avec les origines front-end autorisées
  explicitement. Ne pas utiliser `Access-Control-Allow-Origin: *` avec des
  credentials ; ne pas activer les credentials si le média n'en a pas besoin.
- Dans le front-end, limiter l'interface de téléchargement native avec
  `controlsList="nodownload"` sur les lecteurs audio/vidéo lorsque c'est
  souhaité. C'est uniquement une indication d'interface, pas une protection :
  tout média publiquement lisible peut être récupéré. Ne jamais y placer de
  contenu confidentiel.
- Échapper les métadonnées affichées et valider les chemins du manifeste avant
  de les utiliser comme URL. Ne pas construire une URL à partir d'une entrée
  utilisateur non fiable.
