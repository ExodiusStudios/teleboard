import { config, logger } from '.';
import nodemailer, { Transporter } from 'nodemailer';

import { IServerConfig } from 'vindigo-config';
import directTransport from 'nodemailer-direct-transport';

/**
 * The service used to send emails optionally over SMTP
 */
export class MailingService {
	
	private transporter: Transporter;

	public constructor(config: IServerConfig) {
		const smtp = config.smtp;

		if(smtp.enabled) {
			logger.info(`Using SMTP emailer for ${smtp.domain}`);

			this.transporter = nodemailer.createTransport({
				host: smtp.domain,
				port: smtp.port,
				auth: {
					user: smtp.email,
					pass: smtp.password
				},
			});
		} else {
			logger.info(`Using fallback emailer`);

			this.transporter = nodemailer.createTransport(directTransport({}));
		}
	}

	public async sendPlainTextEmail(target: string, subject: string, body: string) {
		await this.transporter.sendMail({
			from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
			to: target,
			subject: subject,
			text: body
		});
	
		logger.info(`Dispatching a plain text email with the subject of "${subject}" to ${target}`);
	}
	
	public async sendHTMLEmail(target: string, subject: string, html: string) {
		await this.transporter.sendMail({
			from: `"${config.smtp.sender_name}" <${config.smtp.email}>`,
			to: target,
			subject: subject,
			html: html
		});
	
		logger.info(`Dispatching an HTML email with the subject of "${subject}" to ${target}`);
	}

}

