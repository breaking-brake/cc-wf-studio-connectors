import {
	checkRateLimit,
	getClientIp,
	incrementRateLimit,
	jsonResponse,
	withCors,
} from '@cc-wf-studio-connectors/shared';

/**
 * Environment bindings for the init handler
 */
export interface InitEnv {
	OAUTH_SESSIONS: KVNamespace;
	RATE_LIMIT: KVNamespace;
}

/**
 * Request body for session initialization
 */
interface InitRequest {
	session_id: string;
}

/**
 * Response for init endpoint
 */
interface InitResponse {
	ok: boolean;
	session_id?: string;
	error?: string;
}

/**
 * Session data stored in KV for pending sessions
 */
interface PendingSessionData {
	status: 'pending';
	created_at: number;
}

/** Session TTL: 5 minutes */
const SESSION_TTL_SECONDS = 300;

/** Regex for validating session_id (64 character hex string) */
const SESSION_ID_REGEX = /^[a-f0-9]{64}$/;

/**
 * Validate session_id format
 *
 * @param sessionId - Session ID to validate
 * @returns true if valid 64-character hex string
 */
function isValidSessionId(sessionId: unknown): sessionId is string {
	return typeof sessionId === 'string' && SESSION_ID_REGEX.test(sessionId);
}

/**
 * Handle session initialization request
 *
 * This endpoint registers a new session_id before the OAuth flow begins.
 * The VSCode extension calls this to pre-register the session, then
 * the callback endpoint will only accept codes for registered sessions.
 *
 * @param request - Incoming request with JSON body
 * @param env - Environment bindings
 * @returns JSON response with session_id or error
 */
export async function handleSlackInit(request: Request, env: InitEnv): Promise<Response> {
	// Only accept POST requests
	if (request.method !== 'POST') {
		const response: InitResponse = {
			ok: false,
			error: 'method_not_allowed',
		};
		return withCors(jsonResponse(response, 405));
	}

	// Rate limiting
	const clientIp = getClientIp(request);
	const rateLimitResult = await checkRateLimit(env.RATE_LIMIT, clientIp, 'init');

	if (!rateLimitResult.allowed) {
		const response: InitResponse = {
			ok: false,
			error: 'rate_limited',
		};
		return withCors(jsonResponse(response, 429));
	}

	await incrementRateLimit(env.RATE_LIMIT, clientIp, 'init');

	// Parse request body
	let body: InitRequest;
	try {
		body = await request.json();
	} catch {
		const response: InitResponse = {
			ok: false,
			error: 'invalid_json',
		};
		return withCors(jsonResponse(response, 400));
	}

	// Validate session_id
	if (!isValidSessionId(body.session_id)) {
		const response: InitResponse = {
			ok: false,
			error: 'invalid_session_id',
		};
		return withCors(jsonResponse(response, 400));
	}

	const sessionId = body.session_id;
	const kvKey = `slack_session:${sessionId}`;

	// Check if session already exists
	const existingSession = await env.OAUTH_SESSIONS.get(kvKey);
	if (existingSession) {
		const response: InitResponse = {
			ok: false,
			error: 'session_already_exists',
		};
		return withCors(jsonResponse(response, 409));
	}

	// Store pending session in KV
	const sessionData: PendingSessionData = {
		status: 'pending',
		created_at: Date.now(),
	};

	try {
		await env.OAUTH_SESSIONS.put(kvKey, JSON.stringify(sessionData), {
			expirationTtl: SESSION_TTL_SECONDS,
		});
	} catch (err) {
		console.error('Failed to store session:', err);
		const response: InitResponse = {
			ok: false,
			error: 'storage_error',
		};
		return withCors(jsonResponse(response, 500));
	}

	// Return success
	const response: InitResponse = {
		ok: true,
		session_id: sessionId,
	};
	return withCors(jsonResponse(response, 200));
}
