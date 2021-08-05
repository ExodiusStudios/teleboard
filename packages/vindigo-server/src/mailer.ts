import { config, logger } from '.';
import nodemailer, { Transporter } from 'nodemailer';

import { IServerConfig } from './util/config';

/**
 * The service used to send emails optionally over SMTP
 */
export class MailingService {
	
	private transporter: Transporter;

	public constructor(config: IServerConfig) {
		this.transporter = nodemailer.createTransport({
			host: config.smtp.domain,
			port: config.smtp.port,
			auth: {
				user: config.smtp.email,
				pass: config.smtp.password
			},
		});

		logger.info(`Setup transporter`);
	}

	public async sendPlainTextEmail(target: string, subject: string, body: string) {
		await this.transporter.sendMail({
			from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
			to: target,
			subject: subject,
			text: body
		});
	
		logger.info(`Sent an email with the subject ${subject}, and the body of ${body} to ${target}`);
	}
	
	public async sendHTMLEmail(target: string, subject: string, html: string) {
		await this.transporter.sendMail({
			from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
			to: target,
			subject: subject,
			html: html
		});
	
		logger.info(`Sent an email with the subject ${subject}, and the html of ${html} to ${target}`);
	}

}

