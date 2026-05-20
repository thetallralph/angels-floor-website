import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_TO } = env;

const SUBJECT_LABELS: Record<string, string> = {
	general: 'Question générale',
	order: 'Commande',
	wholesale: 'Grossiste / Partenariat',
	other: 'Autre'
};

const escapeHtml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export const POST: RequestHandler = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const name = String(body.name ?? '').trim();
	const email = String(body.email ?? '').trim();
	const phone = String(body.phone ?? '').trim();
	const subject = String(body.subject ?? 'general').trim();
	const message = String(body.message ?? '').trim();
	const website = String(body.website ?? '').trim();

	if (website) {
		return json({ ok: true });
	}

	if (!name || !email || !message) {
		throw error(400, 'Champs requis manquants');
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw error(400, 'Email invalide');
	}
	if (name.length > 200 || message.length > 5000 || phone.length > 50) {
		throw error(400, 'Contenu trop long');
	}

	if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !CONTACT_TO) {
		console.error('[contact] SMTP env vars missing');
		throw error(500, 'Configuration email manquante');
	}

	const port = Number(SMTP_PORT) || 465;
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port,
		secure: port === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
	});

	const subjectLabel = SUBJECT_LABELS[subject] ?? 'Autre';
	const mailSubject = `[Site] ${subjectLabel} — ${name}`;

	const text = [
		`Nom: ${name}`,
		`Email: ${email}`,
		phone ? `Téléphone: ${phone}` : null,
		`Sujet: ${subjectLabel}`,
		'',
		message
	]
		.filter(Boolean)
		.join('\n');

	const html = `
		<div style="font-family: system-ui, sans-serif; max-width: 600px;">
			<h2 style="color: #0a6847;">Nouveau message depuis le site</h2>
			<table style="border-collapse: collapse;">
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Nom</strong></td><td>${escapeHtml(name)}</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
				${phone ? `<tr><td style="padding: 4px 12px 4px 0;"><strong>Téléphone</strong></td><td>${escapeHtml(phone)}</td></tr>` : ''}
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Sujet</strong></td><td>${escapeHtml(subjectLabel)}</td></tr>
			</table>
			<hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;" />
			<div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
		</div>
	`;

	try {
		await transporter.sendMail({
			from: SMTP_FROM || SMTP_USER,
			to: CONTACT_TO,
			replyTo: `${name} <${email}>`,
			subject: mailSubject,
			text,
			html
		});
	} catch (err) {
		console.error('[contact] sendMail failed', err);
		throw error(502, "Impossible d'envoyer le message");
	}

	return json({ ok: true });
};
