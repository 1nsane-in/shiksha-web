import { Logger } from '@n8n/backend-common';
import { UserRepository } from '@n8n/db';
import { Post, RestController } from '@n8n/decorators';
import { Response } from 'express';
import { verify } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

import { AuthService } from '@/auth/auth.service';
import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { InternalServerError } from '@/errors/response-errors/internal-server.error';
import { AuthlessRequest } from '@/requests';
import { PasswordUtility } from '@/services/password.utility';
import { UserService } from '@/services/user.service';

interface EsiSsoPayload {
	sub: string;
	email: string;
	firstName: string;
	lastName: string;
	userId: string;
	role: string;
	purpose: string;
}

/**
 * External authentication controller for ESI platform SSO.
 *
 * Allows the ESI frontend to provision and authenticate n8n users
 * in a single call using a short-lived JWT signed by the ESI backend.
 */
@RestController('/external-auth')
export class ExternalAuthController {
	constructor(
		private readonly logger: Logger,
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
		private readonly passwordUtility: PasswordUtility,
		private readonly userService: UserService,
	) {}

	/**
	 * Provision and authenticate an ESI user.
	 *
	 * - Validates the ESI SSO token
	 * - Creates the n8n user + personal project if they don't exist
	 * - Sets the n8n auth cookie on the response
	 * - Returns basic user info
	 */
	@Post('/provision', {
		skipAuth: true,
		cors: true,
		ipRateLimit: { limit: 100 },
	})
	async provision(req: AuthlessRequest, res: Response) {
		const { token } = req.body as { token?: string };

		if (!token) {
			throw new BadRequestError('SSO token is required');
		}

		const secret = process.env.ESI_SSO_SECRET;
		if (!secret) {
			this.logger.error('ESI_SSO_SECRET environment variable is not configured');
			throw new InternalServerError('SSO is not configured on this instance');
		}

		// Verify the ESI-signed JWT
		let payload: EsiSsoPayload;
		try {
			payload = verify(token, secret) as EsiSsoPayload;
		} catch {
			throw new BadRequestError('Invalid or expired SSO token');
		}

		if (payload.purpose !== 'n8n-sso') {
			throw new BadRequestError('Invalid token purpose');
		}

		if (!payload.email) {
			throw new BadRequestError('Token must contain an email');
		}

		const email = payload.email.toLowerCase().trim();

		// Find existing user
		let user = await this.userRepository.findOne({
			where: { email },
			relations: ['role'],
		});

		if (!user) {
			// Create new user with password set (non-pending)
			this.logger.info('Creating new n8n user via ESI SSO', { email });

			const randomPassword = randomUUID();
			const hashedPassword = await this.passwordUtility.hash(randomPassword);

			const { user: createdUser } = await this.userRepository.createUserWithProject({
				email,
				firstName: payload.firstName || '',
				lastName: payload.lastName || '',
				password: hashedPassword,
				role: { slug: 'global:member' },
			});

			user = await this.userRepository.findOne({
				where: { id: createdUser.id },
				relations: ['role'],
			});

			if (!user) {
				throw new InternalServerError('Failed to create user');
			}

			// Mark user as onboarded to skip the personalization survey
			await this.userService.updateSettings(user.id, {
				isOnboarded: true,
				userActivated: true,
				userActivatedAt: Date.now(),
			});
		} else if (!user.password) {
			// User exists but is pending (no password) — activate them
			this.logger.info('Activating pending n8n user via ESI SSO', { email });

			const randomPassword = randomUUID();
			user.password = await this.passwordUtility.hash(randomPassword);
			user.firstName = payload.firstName || user.firstName;
			user.lastName = payload.lastName || user.lastName;
			await this.userRepository.save(user);

			// Re-fetch with role relation
			user = await this.userRepository.findOne({
				where: { id: user.id },
				relations: ['role'],
			});

			if (!user) {
				throw new InternalServerError('Failed to activate user');
			}

			// Mark user as onboarded to skip the personalization survey
			await this.userService.updateSettings(user.id, {
				isOnboarded: true,
				userActivated: true,
				userActivatedAt: Date.now(),
			});
		}

		// Issue n8n auth cookie
		this.authService.issueCookie(res, user, false, req.browserId);

		this.logger.info('ESI SSO provision successful', { email, userId: user.id });

		return {
			success: true,
			userId: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		};
	}
}
