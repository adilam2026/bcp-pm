import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — Light theme, style "app bancaire moderne"
// ═══════════════════════════════════════════════════════════════════════
const T = {
  // Fonds
  pageBg:    "#F0F4F8",
  cardBg:    "#FFFFFF",
  headerBg:  "#1A56DB",   // bleu bancaire BCP
  headerBg2: "#1348C5",

  // Accents
  blue:      "#1A56DB",
  blueDark:  "#1348C5",
  blueLight: "#EBF2FF",
  green:     "#0E9F6E",
  greenBg:   "#ECFDF5",
  orange:    "#D97706",
  orangeBg:  "#FFFBEB",
  red:       "#E02424",
  redBg:     "#FEF2F2",
  purple:    "#7C3AED",
  purpleBg:  "#F5F3FF",
  teal:      "#0891B2",
  tealBg:    "#ECFEFF",

  // Textes
  textPrimary:   "#111928",
  textSecondary: "#6B7280",
  textMuted:     "#9CA3AF",
  textInverse:   "#FFFFFF",

  // Bordures
  border:    "#E5E7EB",
  borderMd:  "#D1D5DB",

  // Ombres
  shadow:    "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:  "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
  shadowLg:  "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
};

// Couleurs par jour
const DAY_COLORS = [
  { main: "#1A56DB", bg: "#EBF2FF", light: "#DBEAFE" },
  { main: "#D97706", bg: "#FFFBEB", light: "#FEF3C7" },
  { main: "#0E9F6E", bg: "#ECFDF5", light: "#D1FAE5" },
  { main: "#0891B2", bg: "#ECFEFF", light: "#CFFAFE" },
  { main: "#7C3AED", bg: "#F5F3FF", light: "#EDE9FE" },
  { main: "#D97706", bg: "#FFFBEB", light: "#FEF3C7" },
];

// ═══════════════════════════════════════════════════════════════════════
// DATA — 6 jours BCP Maroc (contenu identique)
// ═══════════════════════════════════════════════════════════════════════
const DAYS = [
  {
    id: 1,
    title: "L'écosystème bancaire marocain",
    subtitle: "BAM, SIMT, CMI et la BCP",
    icon: "🇲🇦",
    concept: {
      title: "Comprendre le paysage avant d'opérer",
      body:
`Avant de parler produits, tu dois comprendre qui fait quoi au Maroc.

**Bank Al-Maghrib (BAM)** est la banque centrale. Elle édicte les règles (circulaires, ratios prudentiels), supervise toutes les banques et gère les réserves obligatoires. Chaque virement interbancaire passe par son infrastructure.

**Le SIMT** (Système Interbancaire Marocain de Télécompensation) est l'équivalent marocain du STEP2 européen. C'est la chambre de compensation qui règle les paiements de masse entre banques : virements, prélèvements, chèques. Géré par le GSIMT.

**Le CMI** (Centre Monétique Interbancaire) gère les paiements par carte et les flux monétiques interbancaires.

**La BCP** (Banque Centrale Populaire) est la tête de réseau du Groupe Banque Populaire, 1ère banque de détail au Maroc. Son portail cash management s'appelle **Chaabi Net Entreprises**.

**Le dirham (MAD)** est non-convertible hors Maroc. Les paiements internationaux passent obligatoirement par l'Office des Changes.`,
      keyPoints: [
        "BAM = banque centrale, régulateur, dépositaire des règles de paiement",
        "SIMT = chambre de compensation marocaine (virements, prélèvements, chèques)",
        "CMI = centre monétique interbancaire (cartes, TPE, e-paiement)",
        "Chaabi Net Entreprises = portail cash management de la BCP",
        "MAD non-convertible → paiements internationaux soumis à l'Office des Changes",
        "Le Groupe BP regroupe 11 Banques Populaires Régionales + la BCP tête de réseau",
      ],
    },
    casePratique: {
      title: "Cas terrain : Cosumar veut virer à l'étranger",
      context:
`Cosumar (groupe sucrier marocain, grand compte BCP) veut transférer 2 millions de dirhams à un fournisseur brésilien. Le trésorier appelle : "Je veux faire le virement aujourd'hui".

Tu es PM sur Chaabi Net Entreprises. Le trésorier se plaint que l'interface ne lui indique pas clairement ce qu'il faut faire pour les virements internationaux.`,
      question: "Quelle est la bonne réponse produit ?",
      options: [
        { id: "a", text: "Ajouter un bouton 'Virement international' identique au bouton 'Virement national'", isGood: false, feedback: "Erreur : le virement international au Maroc n'est PAS le même produit. Il nécessite des justificatifs de l'Office des Changes. Une interface identique induit le client en erreur." },
        { id: "b", text: "Intégrer un parcours dédié avec checklist des documents Office des Changes requis selon le motif (importation, services, dividendes...)", isGood: true, feedback: "✓ Exactement. Le PM doit contextualiser la réglementation Office des Changes dans l'UX. Chaque type de virement international a ses propres justificatifs. Un parcours guidé évite les rejets et les appels au support." },
        { id: "c", text: "Rediriger le client vers l'agence pour les virements internationaux", isGood: false, feedback: "C'est le statu quo que le digital doit remplacer. Renvoyer en agence = échec du canal digital." },
        { id: "d", text: "Bloquer les virements internationaux sur le portail pour des raisons de conformité", isGood: false, feedback: "Non — les banques marocaines ont l'obligation d'offrir ce service. Le bloquer, c'est perdre le client." },
      ],
    },
    quiz: [
      { q: "Quelle institution gère la chambre de compensation des virements interbancaires au Maroc ?", options: ["BAM (Bank Al-Maghrib)", "CMI", "SIMT / GSIMT", "Office des Changes"], correct: 2, explanation: "Le SIMT (Système Interbancaire Marocain de Télécompensation) est géré par le GSIMT. C'est lui qui règle les échanges de paiements de masse entre toutes les banques marocaines." },
      { q: "Le dirham marocain est non-convertible. Quelle conséquence pour un virement international ?", options: ["Le virement est impossible depuis le Maroc", "Il faut passer par l'Office des Changes avec des justificatifs", "La BCP facture des frais supplémentaires", "Le délai est automatiquement de J+5"], correct: 1, explanation: "La non-convertibilité du MAD signifie que tout transfert de devises à l'étranger est réglementé par l'Office des Changes. Des documents justificatifs doivent obligatoirement accompagner la demande." },
      { q: "Quel est le nom du portail cash management entreprise de la BCP ?", options: ["BCP Corporate", "Chaabi Net Entreprises", "BAM Pro", "Attijari Business"], correct: 1, explanation: "Chaabi Net Entreprises est le portail digital de la BCP dédié aux entreprises : virements, prélèvements, consultation de comptes, gestion multi-comptes." },
    ],
  },
  {
    id: 2,
    title: "Virements au Maroc",
    subtitle: "Unitaires, masse, cut-off BAM",
    icon: "⇄",
    concept: {
      title: "Les virements en contexte BCP / SIMT",
      body:
`Au Maroc, le virement bancaire (appelé **ordre de virement** ou **OV**) existe sous plusieurs formes.

**Le virement unitaire** : saisie manuelle d'un seul bénéficiaire. Utilisé par les TPE/PME pour payer un fournisseur ponctuel. Sur Chaabi Net Entreprises, c'est le formulaire classique avec RIB, montant, libellé.

**Le virement de masse (fichier)** : une entreprise prépare un fichier (CSV ou format GSIMT) et le dépose sur le portail. La BCP le valide et l'envoie au SIMT. Utilisé pour les salaires, les règlements fournisseurs multiples.

**Les cut-off au Maroc (BCP)** :
- Virements intrabancaires (BCP → BCP) : cut-off ~16h, crédit quasi-immédiat
- Virements interbancaires (BCP → autre banque) : cut-off ~14h, crédit J+1 via SIMT
- Virements urgents (RTGS BAM) : cut-off ~15h30, règlement le jour même

**Le RIB marocain** : 24 chiffres (banque + ville + agence + numéro de compte + clé RIB). Pas d'IBAN au Maroc pour les comptes locaux.

**SWIFT pour l'international** : les virements vers l'étranger passent par le réseau SWIFT (MT103) avec intervention obligatoire du département Change de la BCP.`,
      keyPoints: [
        "RIB marocain = 24 chiffres (pas d'IBAN pour les paiements locaux)",
        "SIMT = chambre de compensation nationale, délai standard J+1",
        "Cut-off interbancaire BCP ≈ 14h pour crédit J+1",
        "Virements urgents RTGS via BAM : même jour, montants élevés",
        "Virement international = MT103 SWIFT + dossier Office des Changes",
        "Fichier de masse : format GSIMT ou CSV structuré selon specs BCP",
      ],
    },
    casePratique: {
      title: "Cas terrain : OCP veut payer 1 200 sous-traitants",
      context:
`OCP SA (Office Chérifien des Phosphates, Casablanca) est un grand compte stratégique de la BCP. Chaque fin de mois, OCP doit régler 1 200 sous-traitants, dont 900 ont des comptes dans d'autres banques.

Le trésorier d'OCP : "On génère notre fichier depuis SAP, mais la semaine dernière 47 virements ont été rejetés par le SIMT. On ne comprend pas pourquoi."`,
      question: "Quelle est ta démarche en tant que PM ?",
      options: [
        { id: "a", text: "Dire au client de vérifier ses fichiers SAP — le problème vient de leur côté", isGood: false, feedback: "Erreur de posture. Un PM bancaire ne rejette pas la responsabilité sur le client sans diagnostic. Les rejets SIMT viennent souvent d'un problème de format ou de données." },
        { id: "b", text: "Analyser les codes rejets SIMT des 47 transactions, identifier les patterns, puis proposer des alertes préventives dans le portail", isGood: true, feedback: "✓ Bonne démarche PM. Les codes rejets SIMT sont standardisés (R01 = RIB inconnu, R02 = compte clôturé, R03 = provision insuffisante). Analyser ces codes révèle le vrai problème et oriente la feature." },
        { id: "c", text: "Proposer immédiatement une API SAP-BCP pour éliminer les erreurs de fichier", isGood: false, feedback: "Pas faux long terme, mais c'est un chantier de 6 à 12 mois. Le client a besoin d'une solution maintenant." },
        { id: "d", text: "Retraiter manuellement les 47 virements rejetés en urgence", isGood: false, feedback: "Solution one-shot qui ne résout rien sur le fond. Le mois prochain, les mêmes erreurs se reproduiront." },
      ],
    },
    quiz: [
      { q: "Combien de chiffres contient un RIB marocain ?", options: ["16", "20", "24", "27"], correct: 2, explanation: "Le RIB marocain : code banque (3) + code ville (3) + code agence (5) + numéro de compte (11) + clé RIB (2) = 24 chiffres. Pas d'IBAN pour les paiements locaux au Maroc." },
      { q: "Un virement BCP vers Attijariwafa Bank envoyé à 15h sera crédité quand ?", options: ["Le jour même", "J+1 ouvré via SIMT", "J+2", "Dépend du montant"], correct: 1, explanation: "Le cut-off interbancaire BCP est environ 14h. Un ordre envoyé à 15h passe le lendemain via le SIMT. Crédit J+1 ouvré." },
      { q: "Quel format de message SWIFT est utilisé pour un virement international client ?", options: ["MT940", "MT103", "MT202", "pain.001"], correct: 1, explanation: "MT103 = Customer Credit Transfer. C'est le message SWIFT standard pour les virements de client à client à l'international." },
    ],
  },
  {
    id: 3,
    title: "Prélèvements & encaissements",
    subtitle: "SPI, domiciliation, collecte",
    icon: "↙",
    concept: {
      title: "Le prélèvement marocain : le SPI",
      body:
`En Europe on parle de SDD (SEPA Direct Debit). Au Maroc, le mécanisme équivalent s'appelle **le Système de Prélèvement Interbancaire (SPI)**.

**Fonctionnement** : l'entreprise créancière (ex: Maroc Telecom, Lydec, CNSS) envoie un fichier de prélèvements à sa banque domiciliataire. La banque envoie au SIMT. Le SIMT débite les comptes des clients dans toutes les banques du Maroc.

**La domiciliation bancaire** : le client doit avoir signé une **autorisation de prélèvement** auprès de sa banque. Sans domiciliation active, le prélèvement est rejeté.

**Cas d'usage typiques BCP** :
- Factures télécoms (IAM, Orange, Inwi)
- Cotisations CNSS / CIMR
- Remboursements de crédits
- Primes d'assurances (Wafa Assurance, RMA)

**Le virement en retour** : si le compte est insuffisant ou la domiciliation invalide, le prélèvement revient avec un code rejet. L'entreprise créancière doit gérer ces retours.

**Tendance digitale** : la BCP pousse la domiciliation en ligne depuis Chaabi Net — c'est un chantier PM actif.`,
      keyPoints: [
        "SPI = Système de Prélèvement Interbancaire (équivalent marocain du SEPA Direct Debit)",
        "La domiciliation bancaire signée est obligatoire avant tout prélèvement",
        "Cut-off prélèvements ≈ J-2 avant la date d'échéance",
        "Codes rejets SPI : R01 (compte inconnu), R07 (opposition client), R09 (provision insuffisante)",
        "Tendance : dématérialisation des mandats de prélèvement via portails digitaux",
        "Grand défi UX : le client ne comprend pas pourquoi son prélèvement est rejeté",
      ],
    },
    casePratique: {
      title: "Cas terrain : Lydec veut encaisser 80 000 abonnés",
      context:
`Lydec (distribution eau/électricité Casablanca) est client grand compte BCP. Chaque mois, elle prélève ses 80 000 abonnés ayant souscrit au prélèvement automatique.

Problème remonté : "Le mois dernier, 4 200 prélèvements ont été rejetés (5,25% de taux de rejet). Les causes sont floues. On perd du temps à relancer manuellement."`,
      question: "Quelle feature produit proposes-tu pour Lydec ?",
      options: [
        { id: "a", text: "Un export Excel des prélèvements rejetés avec les codes retour bruts du SIMT", isGood: false, feedback: "C'est le minimum syndical. Lydec obtient des codes 'R09' sans savoir quoi en faire. Ce n'est pas de la valeur produit, c'est du dump de données." },
        { id: "b", text: "Un dashboard de suivi des rejets avec motifs en langage clair, segmentation par cause et actions proposées (relance SMS, mise à jour domiciliation...)", isGood: true, feedback: "✓ Vision PM complète. Tu transformes les codes SIMT en insights actionnables. R09 = 'Provision insuffisante → Proposer un étalement'. R07 = 'Opposition client → Contacter le client'." },
        { id: "c", text: "Réduire le délai de prélèvement de J-2 à J-1 pour limiter les impayés", isGood: false, feedback: "Ce délai dépend du SIMT, pas de la BCP seule. Ce n'est pas quelque chose qu'un PM peut changer unilatéralement." },
        { id: "d", text: "Mettre en place une re-présentation automatique des rejets sous 48h", isGood: false, feedback: "Utile pour les rejets R09 (provision temporaire), mais contre-productif pour les R07 (opposition). Une re-présentation aveugle peut aggraver la relation client." },
      ],
    },
    quiz: [
      { q: "Qu'est-ce que la domiciliation bancaire en contexte de prélèvement au Maroc ?", options: ["Le numéro de compte du créancier", "L'autorisation signée par le client autorisant les débits sur son compte", "Le code agence BCP du client", "Le contrat entre la BCP et le SIMT"], correct: 1, explanation: "La domiciliation est l'autorisation écrite du client donnant au créancier le droit de débiter son compte. Sans domiciliation valide, le prélèvement est rejeté automatiquement." },
      { q: "Combien de jours avant l'échéance faut-il envoyer un fichier de prélèvements au SIMT ?", options: ["Le jour même", "J-1", "J-2", "J-5"], correct: 2, explanation: "Le cut-off pour les prélèvements au SIMT est généralement J-2. L'entreprise doit anticiper pour que les fonds soient débités à la date prévue." },
      { q: "Un prélèvement revient avec le code R07. Que signifie-t-il ?", options: ["Provision insuffisante", "RIB incorrect", "Opposition du client (révocation de la domiciliation)", "Compte clôturé"], correct: 2, explanation: "R07 = opposition / révocation. Le client a demandé à sa banque de bloquer les prélèvements de ce créancier. Relancer le prélèvement serait inutile et pourrait créer un litige." },
    ],
  },
  {
    id: 4,
    title: "Cash Pooling & multi-comptes",
    subtitle: "Gestion de trésorerie groupe au Maroc",
    icon: "◎",
    concept: {
      title: "Le cash pooling dans le contexte marocain",
      body:
`Le cash pooling est moins répandu au Maroc qu'en Europe, mais les grands groupes marocains le pratiquent avec des spécificités locales importantes.

**Le cash pooling notionnel** : la BCP calcule un solde fictif consolidé de tous les comptes du groupe pour optimiser les intérêts. Les comptes restent juridiquement distincts. Solution privilégiée au Maroc car elle contourne les contraintes sur les transferts de fonds entre entités.

**Le cash pooling réel (ZBA)** : chaque soir, les soldes des filiales sont physiquement remontés vers le compte master du groupe. Plus complexe au Maroc car les mouvements inter-entités peuvent être soumis à des obligations déclaratives Office des Changes.

**Cas des groupes pan-africains** : des groupes comme OCP, Maroc Telecom ou CDG ont des filiales en Afrique subsaharienne. Le cash pooling entre la maison mère marocaine et une filiale au Sénégal nécessite des autorisations Office des Changes. La BCP, avec Bank Al-Wava, est positionnée sur ce marché.

**Gestion multi-comptes BCP** : sur Chaabi Net Entreprises, une entreprise peut gérer N comptes (siège + agences + filiales) avec vision consolidée des soldes.`,
      keyPoints: [
        "Cash pooling notionnel préféré au Maroc : pas de transfert physique inter-entités",
        "ZBA possible mais contraintes Office des Changes pour les groupes multi-pays",
        "Chaabi Net Entreprises permet la vision multi-comptes consolidée",
        "La BCP accompagne les groupes pan-africains via Bank Al-Wava",
        "Le compte master est géré par la Direction Trésorerie du groupe",
        "Défi produit : afficher les positions de trésorerie en temps réel (vs relevés J-1)",
      ],
    },
    casePratique: {
      title: "Cas terrain : Groupe Akwa, 12 filiales au Maroc",
      context:
`Groupe Akwa (énergie, distribution, immobilier) est client BCP avec 12 filiales. Le DAF du groupe arrive à votre réunion de revue commerciale :

"Certaines filiales sont à découvert et paient des agios, pendant que d'autres ont des soldes dormants à 0,5%. Je perds de l'argent inutilement. Votre concurrent Attijariwafa nous a proposé un cash pool."`,
      question: "Comment réponds-tu en tant que PM BCP ?",
      options: [
        { id: "a", text: "Proposer un cash pooling notionnel BCP : consolidation virtuelle des 12 comptes, calcul d'intérêts sur solde net, aucun transfert physique", isGood: true, feedback: "✓ Réponse complète et contextualisée. Le notionnel est la solution adaptée : pas de transfert inter-entités (pas de complexité juridique/fiscale), optimisation immédiate des intérêts. C'est le produit que la BCP peut déployer rapidement." },
        { id: "b", text: "Proposer un Zero Balancing Account avec remontée quotidienne sur le compte master", isGood: false, feedback: "Pas optimal pour 12 entités juridiques distinctes. Les transferts physiques créent des flux comptables et fiscaux entre filiales. Le notionnel est plus simple à mettre en place." },
        { id: "c", text: "Recommander au DAF de fermer les comptes en déficit et de regrouper la trésorerie manuellement", isGood: false, feedback: "Régression opérationnelle. Le groupe a besoin de ses comptes par filiale pour des raisons comptables et légales." },
        { id: "d", text: "Expliquer que ce n'est pas possible réglementairement au Maroc", isGood: false, feedback: "Faux. Le cash pooling est pratiqué par plusieurs banques marocaines pour leurs clients grands comptes. Dire que ce n'est pas possible, c'est perdre le client." },
      ],
    },
    quiz: [
      { q: "Dans un cash pooling notionnel, qu'est-ce qui est consolidé ?", options: ["Les fonds physiquement transférés sur un compte central", "Le calcul des intérêts sur un solde fictif consolidé", "Les lignes de crédit de chaque filiale", "Les fichiers de virements de chaque entité"], correct: 1, explanation: "Dans le notionnel, aucun fonds ne bouge. La banque calcule un solde net (somme de tous les comptes du pool) et applique les intérêts sur ce solde consolidé. Les comptes restent intacts." },
      { q: "Pourquoi le ZBA est-il plus complexe pour un groupe marocain avec des filiales en Afrique subsaharienne ?", options: ["Le SIMT ne traite pas les virements internationaux", "Les transferts de fonds entre pays nécessitent des autorisations Office des Changes", "La technologie BAM ne supporte pas le ZBA", "Les filiales africaines n'ont pas de RIB"], correct: 1, explanation: "Le MAD étant non-convertible, tout flux financier entre le Maroc et une filiale à l'étranger est soumis à la réglementation des changes. Cela complexifie les sweeps automatiques du ZBA inter-pays." },
      { q: "Qu'est-ce que le 'compte master' dans une structure de cash pooling ?", options: ["Le compte principal de la banque auprès de BAM", "Le compte centralisateur du groupe sur lequel convergent les fonds", "Le compte de la filiale la plus profitable", "Le compte dédié aux virements internationaux"], correct: 1, explanation: "Le compte master appartient à la holding ou à la trésorerie centrale du groupe. C'est le hub financier qui centralise les fonds (ZBA) ou sert de référence pour le calcul (notionnel)." },
    ],
  },
  {
    id: 5,
    title: "Flux opérationnels & incidents",
    subtitle: "De la saisie client à la comptabilité",
    icon: "⬡",
    concept: {
      title: "Ce qui se passe réellement quand un client soumet un virement",
      body:
`En tant que PM, tu dois comprendre le parcours complet d'un virement — pas seulement l'interface client.

**1. Front-end (Chaabi Net Entreprises)**
Le trésorier saisit ou importe son fichier. Le portail effectue des contrôles de premier niveau : format RIB, montant > 0, solde indicatif, date valeur. Si OK → statut "En attente de validation".

**2. Workflow de validation (4 yeux)**
Si montant > seuil (ex: 500 000 MAD), un second utilisateur habilité doit approuver. Exigence BAM et conformité interne. Sans approbation → virement bloqué.

**3. Transmission au Système d'Information BCP**
Les ordres validés sont intégrés dans le core banking (T24/Temenos ou système propriétaire). Contrôle de provision réel effectué à ce stade.

**4. Screening conformité (AML/KYC)**
Contrôle automatique des bénéficiaires contre les listes de sanctions (OFAC, ONU, gel des avoirs BAM). Un match déclenche une alerte manuelle.

**5. Envoi au SIMT**
Le SI BCP agrège les ordres du batch et envoie au SIMT avant le cut-off. Le SIMT règle et notifie la banque bénéficiaire.

**6. Comptabilisation**
Les mouvements sont enregistrés dans le système comptable. Le relevé client est mis à jour (parfois avec un délai de quelques heures).`,
      keyPoints: [
        "Portail Chaabi Net → validation 4 yeux → SI BCP → SIMT → banque bénéficiaire",
        "Deux niveaux de contrôle provision : indicatif (portail) et réel (SI BCP)",
        "Screening AML obligatoire avant tout envoi au SIMT",
        "Le relevé client peut être mis à jour avec un décalage par rapport au règlement réel",
        "Incidents fréquents : rejet SIMT pour RIB inconnu, provision insuffisante, erreur de format",
        "Le statut 'En traitement' ≠ 'Exécuté' — source de confusion majeure pour les clients",
      ],
    },
    casePratique: {
      title: "Cas terrain : virement bloqué chez Centrale Danone Maroc",
      context:
`Il est 11h du matin. L'équipe support BCP reçoit un appel urgent : Centrale Danone Maroc a soumis un virement de 3,2 millions MAD à son fournisseur d'emballage. Le statut sur Chaabi Net Entreprises est "En attente de validation" depuis hier 16h.

Après vérification interne : le virement est en attente de la double validation (4 yeux), mais le second valideur est absent depuis hier après-midi.`,
      question: "En tant que PM, que proposes-tu sur le produit pour éviter cette situation ?",
      options: [
        { id: "a", text: "Supprimer la double validation pour les clients grands comptes", isGood: false, feedback: "Impossible — la double validation (4 yeux) est une exigence BAM/conformité. Un PM ne peut pas la supprimer, quelles que soient les pressions commerciales." },
        { id: "b", text: "Ajouter une alerte automatique au titulaire et à un suppléant désigné quand un virement > seuil attend une approbation depuis plus de 2h", isGood: true, feedback: "✓ Solution PM adaptée. Tu respectes la contrainte conformité (4 yeux maintenu) tout en résolvant le vrai problème : personne ne savait que le virement était bloqué. Feature : alertes push/SMS + possibilité de désigner des suppléants." },
        { id: "c", text: "Permettre à l'opérateur BCP support d'approuver à la place du client en cas d'urgence", isGood: false, feedback: "Non — cela violerait la séparation des tâches et l'autonomie du client. Un collaborateur BCP ne peut pas approuver un ordre de paiement à la place d'un client." },
        { id: "d", text: "Afficher un message d'erreur clair indiquant que le virement est en attente d'approbation", isGood: false, feedback: "C'est le minimum, mais insuffisant. Le trésorier voit déjà 'En attente'. Le problème c'est qu'aucune notification n'a été envoyée au valideur. L'amélioration doit être proactive." },
      ],
    },
    quiz: [
      { q: "Après validation sur Chaabi Net Entreprises, quelle est l'étape suivante pour un virement interbancaire ?", options: ["Envoi direct à la banque bénéficiaire", "Transmission au SI BCP puis au SIMT", "Validation par Bank Al-Maghrib", "Signature digitale du client"], correct: 1, explanation: "Après le portail, l'ordre passe dans le SI BCP (contrôle provision, screening AML), puis est groupé dans un batch et transmis au SIMT qui assure le règlement interbancaire." },
      { q: "Pourquoi le relevé bancaire peut-il afficher une opération 'en cours' alors que le SIMT l'a déjà réglée ?", options: ["Erreur technique du SIMT", "Décalage entre le règlement interbancaire et la mise à jour du relevé dans le SI BCP", "Obligation BAM de délai de confirmation", "Erreur de format du RIB bénéficiaire"], correct: 1, explanation: "Le règlement SIMT et la mise à jour du relevé client dans le SI BCP ne sont pas instantanément synchronisés. Ce décalage (quelques heures) est une source de confusion et un sujet d'amélioration produit récurrent." },
      { q: "Le screening AML dans le traitement d'un virement, c'est quoi ?", options: ["Vérification que le montant est correct", "Contrôle du bénéficiaire contre des listes de sanctions internationales et nationales", "Validation de la provision du compte émetteur", "Contrôle du format du fichier"], correct: 1, explanation: "L'AML screening consiste à vérifier le bénéficiaire contre les listes de personnes/entités sanctionnées (OFAC, ONU, gel des avoirs BAM). Un match gèle le virement pour traitement manuel." },
    ],
  },
  {
    id: 6,
    title: "Vision PM : Chaabi Net & roadmap",
    subtitle: "Penser produit dans une banque marocaine",
    icon: "◈",
    concept: {
      title: "Ce que fait un bon PM cash management à la BCP",
      body:
`Tu arrives à la BCP. Voici comment te positionner rapidement.

**Les trois personas de tes utilisateurs réels :**
- **Le trésorier groupe** (OCP, Maroc Telecom, Akwa) : vision stratégique, veut des dashboards temps réel, du cash pooling, des APIs
- **La comptable TPE/PME** : utilise Chaabi Net 30 min/jour pour les virements courants, veut de la simplicité et zéro erreur
- **L'opérateur de saisie** : upload de fichiers quotidien, gère les rejets, veut des notifications claires

**Les vrais pain points Chaabi Net Entreprises (remontés terrain) :**
- Les notifications d'erreur sont des codes techniques incompréhensibles
- Pas de vision temps réel des soldes (décalage J-1 encore présent)
- La gestion des droits utilisateurs est rigide
- Pas d'API publique pour connecter les ERP clients (SAP, Sage, Odoo)
- Le parcours virement international est long et peu guidé
- Aucune fonctionnalité de forecasting / prévision de trésorerie

**Les opportunités PM à saisir :**
- Notifications intelligentes (push/SMS/email selon criticité)
- Open banking : exposer des APIs (tendance BAM)
- Intégration ERP (connecteurs SAP/Odoo pour les PME)
- Réconciliation automatique (matching relevé ↔ factures)`,
      keyPoints: [
        "3 personas distincts : trésorier groupe / comptable PME / opérateur saisie",
        "Pain point #1 terrain : codes rejets incompréhensibles → notifications enrichies",
        "Pain point #2 : soldes J-1 → investir dans la donnée temps réel",
        "Opportunité #1 : API open banking (BAM travaille sur sa réglementation)",
        "Opportunité #2 : connecteurs ERP pour les PME (SAP, Odoo, Sage, Cegid)",
        "Benchmark : Attijariwafa Business, BMCE Business Direct, CIH Business",
      ],
    },
    casePratique: {
      title: "Cas terrain : tes 2 premières semaines à la BCP",
      context:
`Tu viens d'arriver à la BCP. Tu as fait 8 entretiens utilisateurs. Voici ce que tu as collecté :

• 6/8 trésoriers : "Je ne comprends pas les messages d'erreur quand un virement est rejeté"
• 5/8 : "Les soldes affichés ne sont pas en temps réel, ça me force à appeler l'agence"
• 3/8 : "Je ne peux pas connecter mon ERP (SAP / Odoo) directement à votre portail"
• 2/8 : "Je veux une prévision de ma trésorerie à 30 jours"
• 1/8 : "Je veux gérer les droits de mes collaborateurs plus finement"`,
      question: "Quelle feature priorises-tu pour ton premier sprint ?",
      options: [
        { id: "a", text: "Connecteur ERP (SAP / Odoo) — demande de 3/8", isGood: false, feedback: "Signal modéré + complexité technique maximale (intégration ERP = 3 à 6 mois minimum). Mauvais premier sprint." },
        { id: "b", text: "Notifications de rejet enrichies : code SIMT traduit en langage clair + action suggérée + correction inline", isGood: true, feedback: "✓ Signal fort (6/8 = 75%), impact immédiat mesurable (baisse des tickets support), faisabilité rapide. Victoire rapide qui crée de la confiance en équipe et montre de la valeur dès les premières semaines." },
        { id: "c", text: "Prévision de trésorerie à 30 jours — fonctionnalité IA", isGood: false, feedback: "Signal très faible (2/8), complexité algorithmique élevée, nécessite des données historiques propres. C'est une vision 12-18 mois, pas un sprint." },
        { id: "d", text: "Soldes en temps réel — demande de 5/8", isGood: false, feedback: "Signal fort mais c'est un chantier d'infrastructure (core banking). Important mais pas faisable en 2 semaines. À mettre dans le backlog prioritaire après les quick wins." },
      ],
    },
    quiz: [
      { q: "Quel est le benchmark concurrent direct de Chaabi Net Entreprises au Maroc ?", options: ["Société Générale Business", "Attijariwafa Business et BMCE Business Direct", "BNP Paribas Cash Management", "CIB Egypt Corporate"], correct: 1, explanation: "Les concurrents directs sur le segment corporate cash management au Maroc sont Attijariwafa Business et BMCE Business Direct (Bank Of Africa). CIH Business est un concurrent sur le segment PME." },
      { q: "En matière d'open banking au Maroc, qui travaille sur le cadre réglementaire ?", options: ["Le CMI", "Bank Al-Maghrib (BAM)", "L'Office des Changes", "Le GSIMT"], correct: 1, explanation: "Bank Al-Maghrib travaille sur l'évolution du cadre réglementaire pour encadrer l'open banking au Maroc. La BCP doit anticiper cette évolution dans sa roadmap API." },
      { q: "Pourquoi la réconciliation bancaire est-elle un pain point majeur pour les PME marocaines ?", options: ["Le SIMT ne fournit pas de relevés", "Les références dans les relevés BCP ne correspondent souvent pas aux numéros de factures dans les ERP", "La BCP ne propose pas de relevés électroniques", "BAM interdit les relevés numériques"], correct: 1, explanation: "Le matching entre un mouvement sur le relevé bancaire et la facture correspondante dans le système comptable est souvent manuel. C'est un chantier de valeur ajoutée majeur pour un PM cash management." },
    ],
  },
];

const GLOSSAIRE = [
  { term: "SIMT", def: "Système Interbancaire Marocain de Télécompensation. Chambre de compensation nationale qui règle les paiements de masse entre toutes les banques marocaines. Géré par le GSIMT." },
  { term: "BAM", def: "Bank Al-Maghrib. Banque centrale du Maroc. Régule les banques, édicte les circulaires de paiement, gère le système RTGS pour les gros montants interbancaires." },
  { term: "CMI", def: "Centre Monétique Interbancaire. Gère les flux monétiques (cartes bancaires, TPE, paiement en ligne) entre les banques marocaines." },
  { term: "Chaabi Net Entreprises", def: "Portail digital cash management de la BCP dédié aux entreprises et collectivités. Permet : virements, prélèvements, consultation de comptes, gestion multi-comptes." },
  { term: "RIB marocain", def: "Relevé d'Identité Bancaire marocain. 24 chiffres : code banque (3) + code ville (3) + code agence (5) + numéro de compte (11) + clé (2). Pas d'IBAN pour les paiements locaux." },
  { term: "Office des Changes", def: "Institution marocaine qui réglemente les transferts de devises. Toute opération financière entre le Maroc et l'étranger nécessite une justification (facture, contrat) et parfois une autorisation préalable." },
  { term: "SPI", def: "Système de Prélèvement Interbancaire. Mécanisme marocain de prélèvement automatique : le créancier initie le débit sur le compte du débiteur après signature d'une domiciliation bancaire." },
  { term: "Domiciliation bancaire", def: "Autorisation signée par le client (débiteur) permettant à un créancier (Lydec, IAM, CNSS...) de débiter son compte. Équivalent du mandat SEPA en Europe." },
  { term: "Cut-off", def: "Heure limite de traitement d'un ordre de paiement pour la journée. BCP : ~14h pour virements interbancaires (J+1 via SIMT), ~16h pour virements intrabancaires." },
  { term: "RTGS BAM", def: "Real Time Gross Settlement de Bank Al-Maghrib. Système de règlement brut en temps réel pour les gros montants et les règlements interbancaires urgents." },
  { term: "4 yeux (4 eyes)", def: "Principe de contrôle interne exigeant qu'un paiement soit créé par une personne et approuvé par une autre. Obligatoire à la BCP au-delà d'un certain seuil (ex: 500 000 MAD)." },
  { term: "MT103", def: "Message SWIFT pour les virements internationaux client-à-client. Utilisé par la BCP pour les transferts vers l'étranger. Contient : IBAN bénéficiaire, BIC, montant, devise, motif." },
  { term: "MT940", def: "Message SWIFT de relevé de compte (Customer Statement Message). Encore utilisé pour les échanges entre entreprises et banques marocaines dans certains contextes." },
  { term: "Virement de masse", def: "Ordre de paiement groupé : une entreprise dépose un fichier (CSV ou format GSIMT) contenant N virements. La BCP traite l'ensemble en un seul batch." },
  { term: "Cash pooling notionnel", def: "Technique de centralisation de trésorerie virtuelle : la banque consolide les soldes de tous les comptes du groupe pour calculer les intérêts. Aucun transfert physique de fonds." },
  { term: "ZBA (Zero Balancing)", def: "Zero Balance Account. Technique de cash pooling réel : les soldes des filiales sont physiquement remontés chaque soir sur un compte master. Complexifié au Maroc par la réglementation change pour les groupes multi-pays." },
  { term: "AML / LBC", def: "Anti-Money Laundering / Lutte contre le Blanchiment de Capitaux. Obligation légale de vérifier que les paiements ne sont pas liés à des activités illicites. Screening automatique des bénéficiaires." },
  { term: "KYC", def: "Know Your Customer. Processus de vérification d'identité et de profil des clients. La BCP doit maintenir des dossiers KYC à jour pour tous ses clients entreprises." },
  { term: "Core banking", def: "Système d'information central d'une banque (ex: Temenos T24). Gère tous les comptes, transactions et positions. Chaabi Net Entreprises est un front-end connecté au core banking BCP." },
  { term: "BFR", def: "Besoin en Fonds de Roulement. Décalage financier entre les décaissements (paiement fournisseurs) et les encaissements (règlements clients)." },
  { term: "GSIMT", def: "Groupement pour un Système Interbancaire Marocain de Télécompensation. Organisation inter-bancaire qui opère le SIMT. Toutes les banques marocaines en sont membres." },
  { term: "Facilité de caisse", def: "Autorisation de découvert à court terme accordée par la BCP à une entreprise. Permet de couvrir les décalages de trésorerie ponctuels. Soumise à des intérêts débiteurs." },
  { term: "Scoring entreprise", def: "Évaluation de la solvabilité d'une entreprise cliente par la BCP. Influe sur les plafonds de paiement autorisés et les lignes de crédit court terme." },
  { term: "Virement urgent RTGS", def: "Virement de gros montant traité en temps réel via le système RTGS de BAM. Cut-off ~15h30. Utilisé pour les règlements critiques (immobilier, marché de capitaux)." },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
function Bold({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) =>
    p.startsWith("**")
      ? <strong key={i} style={{ color: T.textPrimary, fontWeight: "600" }}>{p.slice(2, -2)}</strong>
      : p
  )}</>;
}

function Badge({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px",
      background: bg || T.blueLight, color: color || T.blue,
      fontSize: "11px", fontWeight: "600",
    }}>{label}</span>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════
function HomeScreen({ progress, setScreen, setDay }) {
  const done = Object.values(progress).filter(d => d.quizDone).length;
  const pct = Math.round((done / 6) * 100);
  const caseDone = Object.values(progress).filter(d => d.caseDone).length;
  const conceptDone = Object.values(progress).filter(d => d.conceptDone).length;

  return (
    <div style={{ padding: "0 16px 90px" }}>

      {/* Progress card */}
      <div style={{
        background: T.cardBg, borderRadius: "16px", padding: "20px",
        boxShadow: T.shadowMd, marginBottom: "16px",
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "13px", color: T.textSecondary, marginBottom: "4px" }}>Ma progression</div>
            <div style={{ fontSize: "36px", fontWeight: "700", color: T.blue, lineHeight: 1 }}>
              {pct}<span style={{ fontSize: "16px", color: T.textMuted, fontWeight: "400" }}>%</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", color: T.textSecondary, marginBottom: "4px" }}>Jours terminés</div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: T.textPrimary, lineHeight: 1 }}>
              {done}<span style={{ fontSize: "14px", color: T.textMuted, fontWeight: "400" }}>/6</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: "8px", background: T.blueLight, borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.blue} 0%, #3B82F6 100%)`,
            borderRadius: "4px", transition: "width .6s ease",
          }} />
        </div>
        {/* Mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "16px" }}>
          {[
            { label: "Concepts lus", value: conceptDone, total: 6, color: T.blue, bg: T.blueLight },
            { label: "Cas terrain", value: caseDone, total: 6, color: T.green, bg: T.greenBg },
            { label: "Quiz réussis", value: done, total: 6, color: T.orange, bg: T.orangeBg },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, borderRadius: "10px", padding: "10px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: s.color }}>
                {s.value}<span style={{ fontSize: "10px", color: T.textMuted, fontWeight: "400" }}>/{s.total}</span>
              </div>
              <div style={{ fontSize: "10px", color: T.textSecondary, marginTop: "2px", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BCP context banner */}
      <div style={{
        background: "linear-gradient(135deg, #1A56DB 0%, #1E40AF 100%)",
        borderRadius: "12px", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "20px",
      }}>
        <div style={{ fontSize: "28px" }}>🏦</div>
        <div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", marginBottom: "2px" }}>Contenu 100% contextualisé</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#FFFFFF" }}>BCP Maroc · Chaabi Net Entreprises</div>
        </div>
      </div>

      {/* Section titre */}
      <div style={{ fontSize: "11px", fontWeight: "600", color: T.textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
        Programme — 6 jours
      </div>

      {/* Day cards */}
      {DAYS.map((day, idx) => {
        const dp = progress[day.id] || {};
        const isDone = dp.quizDone;
        const inProg = dp.conceptDone && !isDone;
        const col = DAY_COLORS[idx];

        return (
          <div
            key={day.id}
            onClick={() => { setDay(day.id); setScreen("module"); }}
            style={{
              background: T.cardBg,
              border: `1px solid ${isDone ? "#D1FAE5" : T.border}`,
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: T.shadow,
              transition: "box-shadow .15s, transform .15s",
            }}
          >
            {/* Icon */}
            <div style={{
              width: "46px", height: "46px", borderRadius: "12px",
              background: isDone ? T.greenBg : col.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
            }}>
              {isDone ? "✅" : day.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{ fontSize: "10px", color: T.textMuted, fontWeight: "500" }}>Jour {day.id}</span>
                {isDone && <Badge label="Terminé" color="#065F46" bg="#D1FAE5" />}
                {inProg && <Badge label="En cours" color={col.main} bg={col.bg} />}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: T.textPrimary, marginBottom: "2px" }}>{day.title}</div>
              <div style={{ fontSize: "12px", color: T.textSecondary }}>{day.subtitle}</div>
            </div>

            {/* Arrow */}
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: T.pageBg, display: "flex", alignItems: "center",
              justifyContent: "center", color: T.textMuted, fontSize: "14px", flexShrink: 0,
            }}>›</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE SCREEN
// ═══════════════════════════════════════════════════════════════════════
function ModuleScreen({ day, dayIdx, progress, updateProgress, setScreen }) {
  const [tab, setTab] = useState("concept");
  const [caseAns, setCaseAns] = useState(null);
  const [qAnswers, setQAnswers] = useState({});
  const [qDone, setQDone] = useState(false);
  const col = DAY_COLORS[dayIdx];
  const score = Object.entries(qAnswers).filter(([qi, ai]) => day.quiz[+qi].correct === +ai).length;

  function pickCase(id) { setCaseAns(id); updateProgress(day.id, "caseDone", true); }
  function pickQuiz(qi, ai) {
    if (qAnswers[qi] !== undefined) return;
    const n = { ...qAnswers, [qi]: ai };
    setQAnswers(n);
    if (Object.keys(n).length === day.quiz.length) { setQDone(true); updateProgress(day.id, "quizDone", true); }
  }

  const TABS = [
    { id: "concept", label: "📖 Concept" },
    { id: "cas", label: "🏗 Cas terrain" },
    { id: "quiz", label: "✏️ Quiz" },
  ];

  return (
    <div style={{ padding: "0 16px 90px" }}>

      {/* Day info card */}
      <div style={{
        background: col.bg, borderRadius: "14px", padding: "16px",
        display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px",
        border: `1px solid ${col.light}`,
      }}>
        <div style={{
          width: "50px", height: "50px", borderRadius: "14px",
          background: "#FFFFFF", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "22px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>{day.icon}</div>
        <div>
          <div style={{ fontSize: "11px", color: col.main, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Jour {day.id}</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: T.textPrimary }}>{day.title}</div>
          <div style={{ fontSize: "12px", color: T.textSecondary }}>{day.subtitle}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: T.cardBg, borderRadius: "12px", padding: "4px",
        display: "flex", gap: "2px", marginBottom: "16px",
        boxShadow: T.shadow, border: `1px solid ${T.border}`,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 6px",
            background: tab === t.id ? col.main : "transparent",
            border: "none", borderRadius: "9px",
            color: tab === t.id ? "#FFFFFF" : T.textSecondary,
            fontFamily: "inherit", fontSize: "11px", fontWeight: "600",
            cursor: "pointer", transition: "all .15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ─── CONCEPT ─── */}
      {tab === "concept" && (
        <div>
          <div style={{
            background: T.cardBg, borderRadius: "14px", padding: "18px",
            boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: "12px",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px",
              paddingBottom: "12px", borderBottom: `1px solid ${T.border}`,
            }}>
              <div style={{ width: "4px", height: "20px", background: col.main, borderRadius: "2px" }} />
              <div style={{ fontSize: "13px", fontWeight: "600", color: T.textPrimary }}>{day.concept.title}</div>
            </div>
            <div style={{ fontSize: "13.5px", lineHeight: "1.85", color: "#374151", whiteSpace: "pre-wrap" }}>
              <Bold text={day.concept.body} />
            </div>
          </div>

          {/* Key points */}
          <div style={{
            background: T.cardBg, borderRadius: "14px", padding: "16px",
            boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: "14px",
          }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Points clés à retenir
            </div>
            {day.concept.keyPoints.map((k, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: col.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, marginTop: "1px",
                }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: col.main }} />
                </div>
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.55 }}>{k}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { updateProgress(day.id, "conceptDone", true); setTab("cas"); }}
            style={{
              width: "100%", padding: "14px",
              background: `linear-gradient(135deg, ${col.main} 0%, ${col.main}DD 100%)`,
              border: "none", borderRadius: "12px",
              color: "#FFFFFF", fontFamily: "inherit",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              boxShadow: `0 4px 12px ${col.main}40`,
            }}
          >
            Passer au cas terrain →
          </button>
        </div>
      )}

      {/* ─── CAS TERRAIN ─── */}
      {tab === "cas" && (
        <div>
          <div style={{
            background: T.cardBg, borderRadius: "14px", padding: "18px",
            boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: "14px",
          }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "18px" }}>🏗</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: T.textPrimary }}>{day.casePratique.title}</span>
            </div>
            <div style={{
              background: T.pageBg, borderRadius: "10px", padding: "14px",
              fontSize: "13px", color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap",
            }}>
              {day.casePratique.context}
            </div>
          </div>

          <div style={{
            fontSize: "14px", fontWeight: "600", color: T.textPrimary,
            marginBottom: "12px", padding: "0 2px",
          }}>
            {day.casePratique.question}
          </div>

          {day.casePratique.options.map(opt => {
            const selected = caseAns === opt.id;
            const revealed = caseAns !== null;
            const state = revealed ? (opt.isGood ? "correct" : selected ? "wrong" : "neutral") : "idle";

            return (
              <div key={opt.id} style={{ marginBottom: "8px" }}>
                <button
                  onClick={() => !caseAns && pickCase(opt.id)}
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: state === "correct" ? T.greenBg : state === "wrong" ? T.redBg : T.cardBg,
                    border: `1.5px solid ${state === "correct" ? "#6EE7B7" : state === "wrong" ? "#FCA5A5" : selected && revealed ? "#FCA5A5" : T.border}`,
                    borderRadius: "12px",
                    color: state === "correct" ? "#065F46" : state === "wrong" ? T.red : T.textPrimary,
                    fontFamily: "inherit", fontSize: "13px", textAlign: "left",
                    cursor: caseAns ? "default" : "pointer",
                    lineHeight: 1.5, boxShadow: T.shadow,
                  }}
                >
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: state === "correct" ? "#10B981" : state === "wrong" ? T.red : col.bg,
                    color: (state === "correct" || state === "wrong") ? "#FFFFFF" : col.main,
                    fontSize: "11px", fontWeight: "700", marginRight: "10px", flexShrink: 0,
                  }}>{opt.id.toUpperCase()}</span>
                  {opt.text}
                </button>
                {revealed && selected && (
                  <div style={{
                    background: opt.isGood ? T.greenBg : T.redBg,
                    border: `1px solid ${opt.isGood ? "#A7F3D0" : "#FCA5A5"}`,
                    borderRadius: "0 0 10px 10px", padding: "10px 14px",
                    fontSize: "12.5px", color: opt.isGood ? "#065F46" : "#991B1B",
                    lineHeight: 1.65, marginTop: "-4px",
                  }}>
                    {opt.feedback}
                  </div>
                )}
              </div>
            );
          })}

          {caseAns && (
            <button
              onClick={() => setTab("quiz")}
              style={{
                width: "100%", padding: "14px", marginTop: "8px",
                background: `linear-gradient(135deg, ${col.main} 0%, ${col.main}DD 100%)`,
                border: "none", borderRadius: "12px",
                color: "#FFFFFF", fontFamily: "inherit",
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                boxShadow: `0 4px 12px ${col.main}40`,
              }}
            >Passer au quiz →</button>
          )}
        </div>
      )}

      {/* ─── QUIZ ─── */}
      {tab === "quiz" && (
        <div>
          {!qDone ? (
            <div>
              <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "16px" }}>
                Question {Math.min(Object.keys(qAnswers).length + 1, day.quiz.length)} / {day.quiz.length}
              </div>
              {day.quiz.map((q, qi) => {
                const ans = qAnswers[qi];
                return (
                  <div key={qi} style={{
                    background: T.cardBg, borderRadius: "14px", padding: "16px",
                    boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: "14px",
                  }}>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: T.textPrimary, marginBottom: "12px", lineHeight: 1.5 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "22px", height: "22px", borderRadius: "50%",
                        background: col.bg, color: col.main, fontSize: "11px",
                        fontWeight: "700", marginRight: "8px",
                      }}>Q{qi + 1}</span>
                      {q.q}
                    </div>
                    {q.options.map((opt, ai) => {
                      let bg = T.pageBg, borderCol = T.border, textCol = T.textPrimary;
                      if (ans !== undefined) {
                        if (ai === q.correct) { bg = T.greenBg; borderCol = "#6EE7B7"; textCol = "#065F46"; }
                        else if (ans === ai) { bg = T.redBg; borderCol = "#FCA5A5"; textCol = T.red; }
                      }
                      return (
                        <button key={ai}
                          onClick={() => pickQuiz(qi, ai)}
                          style={{
                            width: "100%", padding: "11px 14px", marginBottom: "6px",
                            background: bg, border: `1.5px solid ${borderCol}`,
                            borderRadius: "10px", color: textCol,
                            fontFamily: "inherit", fontSize: "13px", textAlign: "left",
                            cursor: ans !== undefined ? "default" : "pointer", lineHeight: 1.4,
                          }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "20px", height: "20px", borderRadius: "50%",
                            background: ans !== undefined ? "transparent" : col.bg,
                            border: ans !== undefined ? "none" : `1px solid ${col.main}`,
                            color: col.main, fontSize: "10px", fontWeight: "700",
                            marginRight: "10px", flexShrink: 0,
                          }}>{["A","B","C","D"][ai]}</span>
                          {opt}
                        </button>
                      );
                    })}
                    {ans !== undefined && (
                      <div style={{
                        background: "#F8FAFC", border: `1px solid ${T.border}`,
                        borderRadius: "8px", padding: "10px 12px", marginTop: "6px",
                        fontSize: "12px", color: T.textSecondary, lineHeight: 1.7,
                      }}>
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {/* Score card */}
              <div style={{
                background: score === day.quiz.length ? T.greenBg : score >= 2 ? T.blueLight : T.orangeBg,
                border: `1px solid ${score === day.quiz.length ? "#A7F3D0" : score >= 2 ? "#BFDBFE" : "#FDE68A"}`,
                borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "16px",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                  {score === day.quiz.length ? "🏆" : score >= 2 ? "✅" : "📚"}
                </div>
                <div style={{
                  fontSize: "42px", fontWeight: "700", lineHeight: 1,
                  color: score === day.quiz.length ? "#065F46" : score >= 2 ? T.blue : T.orange,
                }}>
                  {score}/{day.quiz.length}
                </div>
                <div style={{ fontSize: "14px", color: T.textSecondary, marginTop: "8px" }}>
                  {score === day.quiz.length ? "Parfait ! Module maîtrisé." : score >= 2 ? "Bonne base. Revois les points manquants." : "Relis le concept et retente."}
                </div>
              </div>

              {/* Key takeaways */}
              <div style={{
                background: T.cardBg, borderRadius: "14px", padding: "16px",
                boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: "14px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                  À retenir — Jour {day.id}
                </div>
                {day.concept.keyPoints.slice(0, 3).map((k, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: col.bg, display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0, marginTop: "1px",
                    }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: col.main }} />
                    </div>
                    <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.55 }}>{k}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setScreen("home")}
                style={{
                  width: "100%", padding: "14px",
                  background: T.cardBg,
                  border: `1.5px solid ${T.borderMd}`,
                  borderRadius: "12px", color: T.textPrimary,
                  fontFamily: "inherit", fontSize: "14px",
                  fontWeight: "600", cursor: "pointer",
                }}
              >← Retour au programme</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// GLOSSAIRE SCREEN
// ═══════════════════════════════════════════════════════════════════════
function GlossaireScreen() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const filtered = GLOSSAIRE.filter(g =>
    g.term.toLowerCase().includes(q.toLowerCase()) ||
    g.def.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ padding: "0 16px 90px" }}>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</div>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Chercher un terme..."
          style={{
            width: "100%", padding: "13px 14px 13px 42px",
            background: T.cardBg,
            border: `1px solid ${T.border}`, borderRadius: "12px",
            color: T.textPrimary, fontFamily: "inherit", fontSize: "14px",
            boxSizing: "border-box", outline: "none",
            boxShadow: T.shadow,
          }}
        />
      </div>

      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "12px", fontWeight: "500" }}>
        {filtered.length} terme{filtered.length > 1 ? "s" : ""} — Contexte BCP / Maroc
      </div>

      {filtered.map((g, i) => (
        <div
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
          style={{
            background: T.cardBg,
            border: `1px solid ${open === i ? T.blue + "33" : T.border}`,
            borderRadius: "12px", padding: "14px 16px",
            marginBottom: "8px", cursor: "pointer",
            boxShadow: open === i ? `0 0 0 2px ${T.blue}15` : T.shadow,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: "700", color: T.blue, fontSize: "14px" }}>{g.term}</span>
            </div>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: open === i ? T.blueLight : T.pageBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: open === i ? T.blue : T.textMuted, fontWeight: "700", fontSize: "16px",
              flexShrink: 0,
            }}>{open === i ? "−" : "+"}</div>
          </div>
          {open === i && (
            <div style={{
              fontSize: "13px", color: T.textSecondary, marginTop: "10px",
              lineHeight: 1.75, borderTop: `1px solid ${T.border}`, paddingTop: "10px",
            }}>
              {g.def}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selDay, setSelDay] = useState(1);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bcp_pm_v2") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem("bcp_pm_v2", JSON.stringify(progress)); } catch {}
  }, [progress]);

  function updateProgress(id, key, val) {
    setProgress(p => ({ ...p, [id]: { ...(p[id] || {}), [key]: val } }));
  }

  const day = DAYS.find(d => d.id === selDay);
  const dayIdx = DAYS.findIndex(d => d.id === selDay);
  const done = Object.values(progress).filter(d => d.quizDone).length;
  const pct = Math.round((done / 6) * 100);

  // Header config per screen
  const headerConfig = {
    home:      { title: "Cash Management PM", sub: "BCP Maroc · 6 jours de formation terrain", back: false },
    module:    { title: day ? `Jour ${selDay} — ${day.title}` : "", sub: day?.subtitle || "", back: true },
    glossaire: { title: "Glossaire", sub: `${GLOSSAIRE.length} termes contextualisés Maroc`, back: false },
  };
  const hc = headerConfig[screen] || headerConfig.home;

  return (
    <div style={{
      background: T.pageBg,
      minHeight: "100vh",
      maxWidth: "430px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      color: T.textPrimary,
      position: "relative",
    }}>

      {/* ── HEADER (style Auto Carnet / app bancaire) ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.headerBg} 0%, ${T.headerBg2} 100%)`,
        padding: "16px 16px 20px",
        boxShadow: "0 2px 8px rgba(26,86,219,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {hc.back && (
            <button
              onClick={() => setScreen("home")}
              style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)", border: "none",
                color: "#FFFFFF", cursor: "pointer", fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >‹</button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "2px", fontWeight: "500" }}>
              BCP Maroc · PM Bootcamp
            </div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#FFFFFF", lineHeight: 1.2 }}>
              {hc.title}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
              {hc.sub}
            </div>
          </div>
          {/* Progress badge */}
          <div style={{
            background: "rgba(255,255,255,0.2)", borderRadius: "20px",
            padding: "4px 12px", flexShrink: 0,
          }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF" }}>{pct}%</span>
          </div>
        </div>

        {/* Progress bar in header */}
        <div style={{ height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginTop: "14px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "#FFFFFF", borderRadius: "2px",
            transition: "width .6s ease",
          }} />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ paddingTop: "16px" }}>
        {screen === "home" && (
          <HomeScreen progress={progress} setScreen={setScreen} setDay={setSelDay} />
        )}
        {screen === "module" && day && (
          <ModuleScreen day={day} dayIdx={dayIdx} progress={progress} updateProgress={updateProgress} setScreen={setScreen} />
        )}
        {screen === "glossaire" && <GlossaireScreen />}
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "430px",
        background: T.cardBg,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
        zIndex: 100,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Programme", screens: ["home", "module"] },
          { id: "glossaire", icon: "📖", label: "Glossaire", screens: ["glossaire"] },
        ].map(n => {
          const active = n.screens.includes(screen);
          return (
            <button
              key={n.id}
              onClick={() => setScreen(n.id)}
              style={{
                flex: 1, padding: "12px 0 14px",
                background: "none", border: "none",
                cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                borderTop: active ? `2px solid ${T.blue}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "20px" }}>{n.icon}</span>
              <span style={{
                fontSize: "10px", fontWeight: "600",
                color: active ? T.blue : T.textMuted,
              }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
