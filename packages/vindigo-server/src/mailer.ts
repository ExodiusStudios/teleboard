import { config, logger } from '.';
import nodemailer, { Transporter } from 'nodemailer';

import { IServerConfig } from 'vindigo-config';
import directTransport from 'nodemailer-direct-transport';
import { registerPartial, compile } from 'handlebars';
import { Dictionary, trimEnd } from 'lodash';
import { resolveData } from './util/helpers';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { User } from '@prisma/client';
import juice from 'juice';

/**
 * The service used to send emails optionally over SMTP
 */
export class MailingService {
	
	private transporter: Transporter;
	private fromLine!: string;

	private partials = [
		'header',
		'footer'
	]

	private templates = [
		'email_confirmation'
	]

	private templateCache: Dictionary<HandlebarsTemplateDelegate<any>> = {}

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

		// Build the "From" header
		this.fromLine = `"${config.smtp.sender_name}" <${config.smtp.email}>`;

		// Read and register partials
		for(const partial of this.partials) {
			const name = '_' + partial + '.hbs';
			const content = this.readTemplate(name);

			logger.debug('Registered partial ' + partial);

			registerPartial(partial, content);
		}

		// Read and cache email templates
		for(const template of this.templates) {
			const name = template + '.hbs';
			const content = this.readTemplate(name);

			logger.debug('Cached template ' + template);

			this.templateCache[template] = compile(content);
		}
	}

	/**
	 * Read a handlebars template from a file, while respecting
	 * user overridden templates.
	 * 
	 * @param file The template file name
	 * @returns The template content
	 */
	private readTemplate(file: string): string {
		const overridePath = resolveData('emails', file);
		
		// Look for the presence of an overriden template
		if(existsSync(overridePath)) {
			return readFileSync(overridePath, 'utf-8');
		}

		// Load the email from emails directory
		const emailPath = join(__dirname, '../emails', file);
		return readFileSync(emailPath, 'utf-8');
	}

	/**
	 * Send an email to the specified email options. The email
	 * will be sent with plaintext content.
	 * 
	 * @param options The emailing options
	 */
	public async sendPlainTextEmail(options: InlineEmailOptions) {
		await this.transporter.sendMail({
			from: this.fromLine,
			to: this.parseTarget(options),
			subject: options.subject,
			text: options.content
		});
	
		logger.debug(`Sending plaintext email to ${options.target}`);
	}
	
	/**
	 * Send an email to the specified email options. The email
	 * will be sent with HTML content.
	 * 
	 * @param options The emailing options
	 */
	public async sendHTMLEmail(options: InlineEmailOptions) {
		await this.transporter.sendMail({
			from: this.fromLine,
			to: this.parseTarget(options),
			subject: options.subject,
			html: options.content
		});
	
		logger.debug(`Sending HTML email to ${options.target}`);
	}

	/**
	 * Send an email to the specified email options. The email
	 * will contain HTML as sourced from a handlebars template.
	 * 
	 * @param options The emailing options
	 */
	public async sendTemplateEmail(options: TemplateEmailOptions) {
		const cached = this.templateCache[options.template];

		if(!cached) {
			throw new Error(`Unknown email template "${options.template}"`);
		}

		const target = this.parseTarget(options);
		const content = juice(cached({
			...this.buildContext(options.subject, target),
			...options.context
		}));

		await this.transporter.sendMail({
			from: this.fromLine,
			to: target,
			subject: options.subject,
			html: content
		});
	
		logger.debug(`Sending template email to ${target} (${options.template})`);
	}

	/**
	 * Build the default context available to all email templates
	 * 
	 * @param subject The email subject
	 * @param target The target address
	 */
	private buildContext(subject: string, target: string): any {
		const website = trimEnd(config.general.url, '/');

		// TODO Name should default to empty string
		const hasName = config.general.name.toLocaleLowerCase() != 'vindigo';
		const display = hasName ? config.general.name : website.replace(/https?:\/\//, '');

		return {
			subject: subject,
			target: target,
			website: {
				url: website,
				display: display
			}
		};
	}

	/**
	 * Parse the target email from given email options
	 * 
	 * @param options The email options
	 * @returns The target email
	 */
	private parseTarget(options: EmailOptions): string {
		const target = options.target as any;

		// Send based on user profile email
		if(target.email && typeof target.email == 'string') {
			return target.email;
		}

		// Send to direct email
		if(typeof target == 'string') {
			return target;
		}

		throw new Error('Invalid email target');
	}

}

/**
 * Required options for sending out an email
 */
export interface EmailOptions {
	target: string|User;
	subject: string;
}

/**
 * Template email specific options
 */
export interface TemplateEmailOptions extends EmailOptions {
	template: string;
	context: Dictionary<string>;
}

/**
 * Inline email specific options
 */
export interface InlineEmailOptions extends EmailOptions {
	content: string;
}