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
	/** Slack OAuth Client ID */
	SLACK_CLIENT_ID: string;
	/** Slack OAuth Client Secret */
	SLACK_CLIENT_SECRET: string;
}
