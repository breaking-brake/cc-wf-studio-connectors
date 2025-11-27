import {
	checkRateLimit,
	getClientIp,
	incrementRateLimit,
	jsonResponse,
	withCors,
} from '@cc-wf-studio-connectors/shared';

/**
 * Environment bindings for the exchange handler
 */
export interface ExchangeEnv {
	RATE_LIMIT: KVNamespace;
	SLACK_CLIENT_ID: string;
	SLACK_CLIENT_SECRET: string;
}

/**
 * Request body for token exchange
 */
interface ExchangeRequest {
	code: string;
	redirect_uri: string;
}

/**
 * Slack oauth.v2.access response
 */
interface SlackOAuthResponse {
	ok: boolean;
	error?: string;
	access_token?: string;
	token_type?: string;
	scope?: string;
	bot_user_id?: string;
	app_id?: string;
	team?: {
		id: string;
		name: string;
	};
	authed_user?: {
		id: string;
		scope?: string;
		access_token?: string;
		token_type?: string;
	};
}

/**
 * Response for exchange endpoint
 */
interface ExchangeResponse {
	ok: boolean;
	error?: string;
	access_token?: string;
	token_type?: string;
	scope?: string;
	bot_user_id?: string;
	team?: {
		id: string;
		name: string;
	};
}

/**
 * Handle token exchange request
 *
 * This endpoint receives the authorization code from the VSCode extension
 * and exchanges it for an access token using Slack's oauth.v2.access API.
 *
 * @param request - Incoming request with JSON body
 * @param env - Environment bindings including Slack credentials
 * @returns JSON response with access token or error
 */
export async function handleSlackExchange(request: Request, env: ExchangeEnv): Promise<Response> {
	// Only accept POST requests
	if (request.method !== 'POST') {
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Method not allowed',
				},
				405,
			),
		);
	}

	// Rate limiting
	const clientIp = getClientIp(request);
	const rateLimitResult = await checkRateLimit(env.RATE_LIMIT, clientIp, 'exchange');

	if (!rateLimitResult.allowed) {
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Too many requests. Please try again later.',
				},
				429,
			),
		);
	}

	await incrementRateLimit(env.RATE_LIMIT, clientIp, 'exchange');

	// Parse request body
	let body: ExchangeRequest;
	try {
		body = await request.json();
	} catch {
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Invalid JSON body',
				},
				400,
			),
		);
	}

	// Validate required fields
	if (!body.code || typeof body.code !== 'string') {
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Missing or invalid code',
				},
				400,
			),
		);
	}

	if (!body.redirect_uri || typeof body.redirect_uri !== 'string') {
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Missing or invalid redirect_uri',
				},
				400,
			),
		);
	}

	// Check if Slack credentials are configured
	if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
		console.error('Slack credentials not configured');
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Server configuration error',
				},
				500,
			),
		);
	}

	// Exchange code for token with Slack
	try {
		const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: env.SLACK_CLIENT_ID,
				client_secret: env.SLACK_CLIENT_SECRET,
				code: body.code,
				redirect_uri: body.redirect_uri,
			}),
		});

		const slackResponse: SlackOAuthResponse = await tokenResponse.json();

		if (!slackResponse.ok) {
			console.error('Slack OAuth error:', slackResponse.error);
			return withCors(
				jsonResponse(
					{
						ok: false,
						error: slackResponse.error ?? 'Token exchange failed',
					},
					400,
				),
			);
		}

		// Return successful response
		const response: ExchangeResponse = {
			ok: true,
			access_token: slackResponse.access_token,
			token_type: slackResponse.token_type,
			scope: slackResponse.scope,
			bot_user_id: slackResponse.bot_user_id,
			team: slackResponse.team,
		};

		return withCors(jsonResponse(response, 200));
	} catch (err) {
		console.error('Failed to exchange token:', err);
		return withCors(
			jsonResponse(
				{
					ok: false,
					error: 'Failed to communicate with Slack',
				},
				500,
			),
		);
	}
}
