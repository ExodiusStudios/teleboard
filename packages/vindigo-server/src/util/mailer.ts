import { config, logger } from '..';

import nodemailer from 'nodemailer';

export async function sendPlainTextEmail(target: string, subject: string, body: string) {
	const transpoter =  nodemailer.createTransport({
		host: config.smtp.domain,
		port: config.smtp.port,
		auth: {
			user: config.smtp.email,
			pass: config.smtp.password
		},
	});

	await transpoter.sendMail({
		from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
		to: target,
		subject: subject,
		text: body
	});

	logger.info(`[Mailer] Sent an email with the subject ${subject}, and the body of ${body} to ${target}`);
}

export async function sendHTMLEmail(target: string, subject: string, html: string) {
	const transpoter =  nodemailer.createTransport({
		host: config.smtp.domain,
		port: config.smtp.port,
		auth: {
			user: config.smtp.email,
			pass: config.smtp.password
		},
	});

	await transpoter.sendMail({
		from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
		to: target,
		subject: subject,
		html: html
	});

	logger.info(`[Mailer] Sent an email with the subject ${subject}, and the html of ${html} to ${target}`);
}