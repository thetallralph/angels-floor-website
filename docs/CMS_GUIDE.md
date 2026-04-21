# Guide utilisateur — Éditer le contenu du site Angel's Floor

Ce guide explique comment modifier les textes, les images et les galeries de chaque page du site Angel's Floor, depuis l'interface d'administration. Aucune connaissance technique n'est nécessaire.

---

## 1. Ce que vous pouvez modifier

Depuis l'admin, vous pouvez personnaliser sur chaque page :

- **Les textes** : titres, sous-titres, descriptions, labels
- **Les images** : photo de hero, visuels de section
- **Les galeries** : carrousels et sliders contenant plusieurs images
- **Les pages légales** : CGV et Mentions légales avec un éditeur de texte enrichi (gras, italique, listes, liens…)

Chaque champ a déjà un contenu par défaut. Votre modification vient remplacer ce défaut. Vous pouvez toujours revenir au défaut d'un simple clic.

---

## 2. Se connecter

1. Rendez-vous sur : `https://angelsfloor.com/admin/login`
2. Saisissez votre email et votre mot de passe
3. Cliquez sur **Se connecter**

Vous arrivez sur le tableau de bord. Dans le menu à gauche, plusieurs sections sont disponibles : Dashboard, Produits, Blog, **Contenu**, Médias, Paramètres.

---

## 3. Ouvrir l'éditeur de contenu

Dans le menu à gauche, cliquez sur **Contenu**.

La page affiche :
- **Un onglet par page du site**, en haut : Accueil, À propos, Impact, Contact, Points de vente, Grossistes, CGV, Mentions légales
- **Le bouton "Sauvegarder les textes"** en haut à droite
- **La liste des champs éditables** de la page sélectionnée, regroupés par section (Hero, Stats, Produits, etc.)

Cliquez sur un onglet pour afficher les champs de la page correspondante.

---

## 4. Modifier un texte

Les champs texte apparaissent soit en **ligne unique**, soit en **zone redimensionnable** si le texte est long. Un petit badge `text` indique le type.

**Pour éditer :**
1. Cliquez dans le champ
2. Tapez votre modification (vous pouvez remplacer tout ou une partie)
3. Cliquez sur **Sauvegarder les textes** en haut à droite
4. Un message vert "Contenu sauvegardé" apparaît

**Remarque** : le bouton reste désactivé tant que vous n'avez rien modifié. Vous pouvez éditer plusieurs champs avant de cliquer — tout est sauvegardé d'un coup.

Après sauvegarde, ouvrez le site public dans un nouvel onglet pour voir le résultat. Faites un rafraîchissement forcé (Ctrl+Shift+R ou Cmd+Shift+R) si nécessaire.

---

## 5. Modifier une image

Les champs image affichent :
- **Une miniature** de l'image actuelle
- Un bouton **Téléverser une image** (ou **Remplacer** si une image est déjà personnalisée)
- Un bouton **Réinitialiser** (si une image personnalisée existe)
- Une indication des formats acceptés : JPG, PNG, WebP, max 5 Mo

**Pour remplacer une image :**
1. Cliquez sur **Téléverser une image** (ou **Remplacer**)
2. Choisissez votre fichier dans la fenêtre qui s'ouvre
3. L'upload démarre automatiquement — **pas besoin de cliquer sur Sauvegarder**
4. La miniature se met à jour et un message vert "Image mise à jour" apparaît

**Pour revenir à l'image par défaut :**
1. Cliquez sur **Réinitialiser**
2. Confirmez dans la fenêtre de dialogue
3. L'image personnalisée est supprimée, l'image d'origine du site réapparaît

---

## 6. Modifier une galerie (sliders, carrousels)

Les galeries permettent d'afficher plusieurs images (par exemple le slider de la page d'accueil). L'interface affiche :

- **Une grille de miniatures** des images personnalisées, numérotées dans leur ordre d'affichage
- Au **survol d'une miniature**, 3 boutons apparaissent :
  - ↑ Déplacer avant dans l'ordre
  - ↓ Déplacer après dans l'ordre
  - 🗑 Supprimer cette image
- Un bouton **Ajouter des images** (sélection multiple possible)
- Un bouton **Revenir aux images par défaut** (si des images personnalisées existent)

Si aucune image n'est personnalisée, un message l'indique et les images par défaut du site s'affichent sur la page publique.

**Pour ajouter des images :**
1. Cliquez sur **Ajouter des images**
2. Sélectionnez un ou plusieurs fichiers (Ctrl+clic ou Cmd+clic pour en choisir plusieurs)
3. Les images sont uploadées automatiquement et s'ajoutent à la fin de la galerie
4. Un message vert confirme l'ajout

**Pour réorganiser :**
- Survolez une miniature et utilisez les flèches ↑ ou ↓

**Pour supprimer une image :**
- Survolez la miniature et cliquez sur l'icône poubelle
- Confirmez dans la fenêtre de dialogue

**Pour revenir aux images d'origine :**
- Cliquez sur **Revenir aux images par défaut**
- Confirmez — toutes les images personnalisées sont supprimées

---

## 7. Modifier une page légale (CGV, Mentions légales)

Les pages légales utilisent un **éditeur de texte enrichi** (comme Word ou Google Docs en plus simple) pour le corps du document. Vous y trouvez une barre d'outils avec :

- **Gras**, *Italique*, ~~Barré~~
- **Titre** (H2) et **Sous-titre** (H3)
- Liste à puces, liste numérotée
- Citation
- Séparateur horizontal
- Lien (on vous demande l'URL)
- Annuler / Refaire (Ctrl+Z / Ctrl+Y fonctionnent aussi)

**Pour éditer :**
1. Cliquez dans la zone de texte
2. Sélectionnez du texte et appliquez un style via la barre d'outils
3. Utilisez les boutons Titre/Sous-titre pour structurer
4. Cliquez sur **Sauvegarder les textes** en haut à droite

**Attention** : sur les pages CGV et Mentions légales, le design par défaut affiche chaque article dans une jolie carte avec une icône. Dès que vous modifiez la rich text, ce design est remplacé par votre texte formaté en version simple (toujours lisible, mais sans les cartes colorées). Pour retrouver le design d'origine, il faut vider l'éditeur (voir section suivante) ou redemander au développeur.

---

## 8. Revenir aux valeurs par défaut

Chaque type de champ a sa manière de revenir au défaut :

| Type de champ | Comment revenir au défaut |
|---------------|----------------------------|
| **Texte** | Videz complètement le champ, puis cliquez sur **Sauvegarder les textes** |
| **Rich text** | Videz tout l'éditeur, puis cliquez sur **Sauvegarder les textes** |
| **Image** | Cliquez sur **Réinitialiser** sous l'image |
| **Galerie** | Cliquez sur **Revenir aux images par défaut** |

Dans tous les cas, le contenu d'origine du site réapparaît immédiatement.

---

## 9. Bonnes pratiques

- **Testez vos modifications** sur le site public après chaque sauvegarde pour vérifier le rendu
- **Gardez les titres courts** — ils sont affichés en gros caractères et un titre trop long peut casser la mise en page
- **Images** : privilégiez des formats JPG ou WebP pour les photos, PNG pour les visuels avec transparence
- **Taille des images** : 800×600 à 1600×1200 px suffisent pour la plupart des sections ; au-delà, c'est inutile et ralentit le site
- **Pour un slider**, essayez d'uploader des images au même format (paysage ou portrait) pour un rendu homogène
- **Sauvegardez fréquemment** pour ne pas perdre votre travail

---

## 10. Problèmes fréquents

### La modification n'apparaît pas sur le site
- Faites un rafraîchissement forcé du navigateur : **Ctrl+Shift+R** (Windows/Linux) ou **Cmd+Shift+R** (Mac)
- Vérifiez que vous avez bien cliqué sur **Sauvegarder les textes** (pour les textes — pour les images et galeries, la sauvegarde est automatique)
- Essayez dans un onglet navigation privée pour éliminer tout problème de cache

### Le bouton "Sauvegarder les textes" est grisé
C'est normal : il s'active uniquement quand au moins un champ texte a été modifié.

### L'upload d'image échoue
- Vérifiez la **taille du fichier** (max 5 Mo)
- Vérifiez le **format** (JPG, PNG, WebP, GIF)
- Essayez avec une autre image pour isoler le problème

### Le texte dans l'admin n'est pas le même que sur le site
Si vous voyez un texte différent dans l'admin et sur le site, c'est que la version du site n'a pas encore été rafraîchie dans votre navigateur. Faites un rafraîchissement forcé (Ctrl+Shift+R).

### "Aucun champ éditable trouvé sur cette page"
Cette page n'a pas de champs configurés pour être éditables depuis le CMS. Contactez le développeur pour en ajouter.

---

## 11. Besoin d'aide

Pour toute question ou demande d'évolution (ajouter un nouveau champ éditable, modifier le design, ajouter une page…), contactez le développeur du site.

---

*Guide mis à jour le 21 avril 2026.*
