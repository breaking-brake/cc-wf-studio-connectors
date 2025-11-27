/**
 * OAuth session data stored in KV
 */
export interface OAuthSessionData {
	/** Authorization code from OAuth provider */
	code: string;
	/** Original state parameter (should match session_id) */
	state: string;
	/** OAuth provider identifier */
	provider: 'slack' | 'discord';
	/** ISO 8601 timestamp when session was created */
	createdAt: string;
	/** Client IP for security logging (optional) */
	clientIp?: string;
}

/**
 * Rate limiting data stored in KV
 */
export interface RateLimitData {
	/** Number of requests in current window */
	count: number;
	/** ISO 8601 timestamp when window started */
	windowStart: string;
}

/**
 * Poll response status
 */
export type PollStatus = 'success' | 'pending' | 'expired';

/**
 * Poll endpoint response
 */
export interface PollResponse {
	status: PollStatus;
	code?: string;
	message?: string;
}
