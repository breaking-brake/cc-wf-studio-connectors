/**
 * Environment bindings for Cloudflare Worker
 */
export interface Env {
	/** KV namespace for OAuth sessions */
	OAUTH_SESSIONS: KVNamespace;
	/** KV namespace for rate limiting */
	RATE_LIMIT: KVNamespace;
	/** Environment identifier */
	ENVIRONMENT: string;
}
