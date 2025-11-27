import type { OAuthSessionData } from './types.js';

/** TTL for OAuth sessions: 5 minutes */
const SESSION_TTL_SECONDS = 300;

/**
 * Store OAuth session data in KV
 *
 * @param kv - KV namespace binding
 * @param provider - OAuth provider (slack/discord)
 * @param sessionId - Unique session identifier
 * @param code - Authorization code from OAuth provider
 * @param state - State parameter for CSRF protection
 * @param clientIp - Optional client IP for logging
 */
export async function storeOAuthSession(
	kv: KVNamespace,
	provider: 'slack' | 'discord',
	sessionId: string,
	code: string,
	state: string,
	clientIp?: string,
): Promise<void> {
	const key = `${provider}:${sessionId}`;
	const data: OAuthSessionData = {
		code,
		state,
		provider,
		createdAt: new Date().toISOString(),
		clientIp,
	};

	await kv.put(key, JSON.stringify(data), {
		expirationTtl: SESSION_TTL_SECONDS,
	});
}

/**
 * Retrieve and delete OAuth session from KV (one-time use)
 *
 * @param kv - KV namespace binding
 * @param provider - OAuth provider (slack/discord)
 * @param sessionId - Unique session identifier
 * @returns Session data if found, null otherwise
 */
export async function retrieveAndDeleteOAuthSession(
	kv: KVNamespace,
	provider: 'slack' | 'discord',
	sessionId: string,
): Promise<OAuthSessionData | null> {
	const key = `${provider}:${sessionId}`;
	const data = await kv.get<OAuthSessionData>(key, 'json');

	if (data) {
		// Delete after retrieval (one-time use)
		await kv.delete(key);
	}

	return data;
}

/**
 * Check if session exists without consuming it
 *
 * @param kv - KV namespace binding
 * @param provider - OAuth provider (slack/discord)
 * @param sessionId - Unique session identifier
 * @returns true if session exists
 */
export async function sessionExists(
	kv: KVNamespace,
	provider: 'slack' | 'discord',
	sessionId: string,
): Promise<boolean> {
	const key = `${provider}:${sessionId}`;
	const data = await kv.get(key);
	return data !== null;
}
