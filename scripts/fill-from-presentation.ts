/**
 * Fill product content from .claude/PJ1_PRESENTATION DES PRODUITS.docx
 *
 * Updates each known product with:
 *   - description (composition / valeurs nutritives)
 *   - packaging (list of available sizes)
 *   - price (entry-level / smallest size)
 *   - conservation (durée + standard storage line)
 *   - usage (conseils de consommation)         ← only if empty (preserve BPV)
 *   - benefits[]                                 ← only if empty (preserve BPV)
 *
 * Safe to re-run. Strict scope: only the 30 mappings below are touched.
 *
 * Usage: npm run catalog:fill-from-doc
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;
if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const STANDARD_CONSERVATION =
	'À conserver loin de l’humidité, dans un endroit sec et frais. À consommer avant la date de péremption.';

type DocProduct = {
	slug: string;
	packaging: string;
	price: number;
	conservation: string;
	description: string;
	usage?: string;
	benefits?: string[];
};

// Composition partagée pour les 9 produits Bisbab — même base nere.
const BISBAB_DESCRIPTION =
	'Confiserie à base de néré, alliant goût sucré, richesse en protéines, fibres et minéraux. Une collation saine et énergétique.';

const BISBAB_USAGE = 'Accompagnement pour les bouillies, en apéritif ou en collation.';

const PRODUCTS: DocProduct[] = [
	// === FONIO ===
	{
		slug: 'fonio-grain',
		packaging: '500G / 900G / 1800G',
		price: 1545,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Le fonio est une céréale d’environ 1,3 mm de long et 0,8 mm de large, sans gluten, riche en énergie, glucides, protéines, fibres, minéraux (fer, magnésium, zinc, calcium) et vitamines du groupe B. Léger et digeste, environ 360 kcal pour 100 g.',
		usage:
			'Sert à préparer la bouillie de fonio, le couscous, la salade, le fonio cuit à la vapeur ou au gras.'
	},
	{
		slug: 'farine-de-fonio',
		packaging: '600G / 1000G',
		price: 2500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Farine obtenue par mouture des grains de fonio. Sans gluten, légère et digeste, riche en glucides, protéines, fibres, minéraux et vitamines B. Environ 360 kcal pour 100 g.',
		usage: 'Bouillie, pâte, beignets, farine pâtissière. Idéale pour galette, pain et gâteau.'
	},
	{
		slug: 'farine-enrichie-de-fonio',
		packaging: '300G / 1000G',
		price: 1500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Farine enrichie composée de céréales, fonio, sorgho, mangue, datte et petits poissons. Mélange nutritif spécialement formulé pour les bouillies.',
		usage: 'Sert principalement à préparer la bouillie enrichie.'
	},
	{
		slug: 'couscous-de-fonio',
		packaging: '350G / 1000G',
		price: 2000,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Plat sans gluten, digeste et riche en nutriments (vitamines B, fer, zinc, magnésium, fibres). Offre une énergie durable tout en valorisant la consommation locale.',
		usage: 'Salade de couscous de fonio au poisson, aux légumes ou à la viande.'
	},
	{
		slug: 'fonio-biscuit',
		packaging: '22G',
		price: 200,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: 'Biscuit fait à base de farine de fonio.',
		usage: 'Idéal pour accompagner le petit déjeuner.'
	},

	// === BAOBAB ===
	{
		slug: 'baobab-pulpe',
		packaging: '250G / 500G / 1000G / 1500G',
		price: 1350,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Poudre naturelle issue de la pulpe du fruit du baobab. Riche en fibres, vitamine C, calcium et potassium. Idéale pour renforcer le système immunitaire, favoriser la digestion et apporter énergie et bien-être.',
		usage:
			'Préparation de bouillies et de jus instantanés (à diluer dans de l’eau tiède). Recommandé en cas de constipation.'
	},
	// Bisbab — 9 produits, base commune avec prix différenciés
	{
		slug: 'bisbab-dragee',
		packaging: '3G / 5G',
		price: 25,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: BISBAB_DESCRIPTION,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-nature',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: BISBAB_DESCRIPTION,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-bissap',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Parfumé au bissap (hibiscus).`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-nere',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Enrichi à la pulpe de néré.`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-gingembre',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Parfumé au gingembre.`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-curcuma',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Parfumé au curcuma.`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-artemisia',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Parfumé à l’artemisia.`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-fagara',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Parfumé au fagara (poivre africain).`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'bisbab-grand-format',
		packaging: '250G / 500G / 1000G',
		price: 4500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: BISBAB_DESCRIPTION,
		usage: BISBAB_USAGE
	},

	// === NÉRÉ ===
	{
		slug: 'nere-pulpe',
		packaging: '100G / 200G / 500G / 1KG',
		price: 1000,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Poudre naturelle riche en protéines, lipides, vitamines A et C, fer, calcium et potassium. Propriétés antinévralgiques, diurétiques, toniques et antiseptiques. Source nutritive de qualité particulièrement recommandée pour les enfants.',
		usage:
			'En boisson nutritive (mélangée à de l’eau, du sucre, du miel, du lait ou du baobab). En pâtisserie (biscuits, galettes, dragées). En complément alimentaire dans les bouillies pour enfants ou convalescents.'
	},
	{
		slug: 'biscuit-de-nere-petit-format',
		packaging: '3G / 5G',
		price: 25,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: BISBAB_DESCRIPTION,
		usage: BISBAB_USAGE
	},
	{
		slug: 'super-biscuit-de-nere',
		packaging: '50G',
		price: 500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: `${BISBAB_DESCRIPTION} Format Super biscuit.`,
		usage: BISBAB_USAGE
	},
	{
		slug: 'biscuit-de-nere-grand-format',
		packaging: '500G / 1000G',
		price: 4500,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description: BISBAB_DESCRIPTION,
		usage: BISBAB_USAGE
	},

	// === MANGUE / PAPAYE ===
	{
		slug: 'marmelade-de-mangue',
		packaging: '90 ML / 370 ML',
		price: 1800,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Composée essentiellement de purée de mangues mûres, d’un soupçon de sucre et de citron vert. Riche en fibres, vitamines A et C, ainsi qu’en bêta-carotène. Contient glucides, lipides, potassium et fibres alimentaires.',
		usage:
			'À tartiner et à manger avec du pain. Peut remplacer la mayonnaise ou le beurre dans certaines préparations.'
	},
	{
		slug: 'mangue-sechee',
		packaging: '100G',
		price: 1000,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Mangue séchée riche en fibres, vitamines A et C, bêta-carotène. Contient glucides, lipides, potassium et fibres alimentaires. Source d’énergie naturelle.',
		usage: 'Se déguste en collation saine, à tout moment et en tout lieu.'
	},
	{
		slug: 'papaye-sechee',
		packaging: '85G',
		price: 1000,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Fruit 100% naturel, source d’énergie grâce aux glucides, riche en fibres, vitamines A et C, potassium et antioxydants. Bonne pour l’immunité et la vue.',
		usage: 'Se déguste comme collation saine ou ajoutée aux céréales et desserts.'
	},
	{
		slug: 'tchakpalo-mangue',
		packaging: '1L / 1,5L / 3L / 5L (formats individuels : 1/4, 1/3, 1/2)',
		price: 400,
		conservation: `3 mois. ${STANDARD_CONSERVATION}`,
		description:
			'Boisson traditionnelle fermentée à base de pulpe de mangues mûres. Légèrement pétillante et sucrée-acidulée, appréciée comme boisson rafraîchissante et conviviale. Apporte une énergie rapide grâce aux sucres naturels, ainsi que des antioxydants (vitamine C, bêta-carotène).',
		usage: 'À consommer fraîche en boisson.'
	},

	// === AUTRES ===
	{
		slug: 'couscous-igname',
		packaging: '500G / 700G',
		price: 2196,
		conservation: `2 ans. ${STANDARD_CONSERVATION}`,
		description:
			'Couscous à base de farine de cossette d’igname. Plat traditionnel nourrissant à préparer avec piment, légumes et eau.',
		usage: 'À préparer avec piment, légumes et eau.'
	},
	{
		slug: 'chips-manioc',
		packaging: 'Sachet (vendu par douzaine)',
		price: 3000,
		conservation: `3 mois. ${STANDARD_CONSERVATION}`,
		description:
			'Chips à base de manioc, déclinées en versions nature, sucré, salé ou épicé. Croustillantes et savoureuses.',
		usage: 'À déguster en apéritif ou en collation.'
	},
	{
		slug: 'chips-riz',
		packaging: 'Sachet (vendu par douzaine)',
		price: 3000,
		conservation: `3 mois. ${STANDARD_CONSERVATION}`,
		description:
			'Chips à base de farine de riz, déclinées en versions nature, sucré, salé ou épicé. Croustillantes et savoureuses.',
		usage: 'À déguster en apéritif ou en collation.'
	},
	{
		slug: 'fonio-chips',
		packaging: 'Sachet (vendu par douzaine)',
		price: 3000,
		conservation: `3 mois. ${STANDARD_CONSERVATION}`,
		description:
			'Chips à base de farine de fonio, déclinées en versions nature, sucré, salé ou épicé. Croustillantes et sans gluten.',
		usage: 'À déguster en apéritif ou en collation.'
	}
];

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	let updated = 0;
	let skipped = 0;

	for (const p of PRODUCTS) {
		let rec;
		try {
			rec = await pb.collection('products').getFirstListItem(`slug = "${p.slug}"`);
		} catch {
			console.log(`  skipped ${p.slug} (not found)`);
			skipped++;
			continue;
		}

		const patch: Record<string, unknown> = {
			packaging: p.packaging,
			price: p.price,
			conservation: p.conservation
		};

		// Description : overwrite if current is empty or shorter (doc is canonical for composition).
		const curDesc = String(rec.description ?? '');
		if (!curDesc.trim() || curDesc.length < p.description.length / 2) {
			patch.description = p.description;
		}

		// Usage : only if empty (preserve BPV recipes).
		if (p.usage && !String(rec.usage ?? '').trim()) {
			patch.usage = p.usage;
		}

		// Benefits : only if empty.
		if (p.benefits && p.benefits.length > 0) {
			const cur = Array.isArray(rec.benefits) ? rec.benefits : [];
			if (cur.length === 0) patch.benefits = p.benefits;
		}

		await pb.collection('products').update(rec.id, patch);
		console.log(`✓ ${p.slug}: ${p.packaging} @ ${p.price} FCFA`);
		updated++;
	}

	console.log(`\nDone. Updated: ${updated}, skipped: ${skipped}.`);
}

main().catch((err) => {
	console.error(err);
	if ((err as { response?: unknown })?.response) {
		console.error('Response:', JSON.stringify((err as { response: unknown }).response, null, 2));
	}
	process.exit(1);
});
