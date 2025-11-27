import type { RateLimitData } from '../kv/types.js';

/** Rate limit window: 1 minute */
const RATE_LIMIT_WINDOW_SECONDS = 60;

/** Rate limit configurations per endpoint */
export const RATE_LIMITS = {
	callback: 10, // 10 requests per minute per IP
	poll: 30, // 30 requests per minute per IP (polling every 2s)
} as const;

export type RateLimitEndpoint = keyof typeof RATE_LIMITS;

/**
 * Check if request is within rate limit
 *
 * @param kv - KV namespace for rate limiting
 * @param ip - Client IP address
 * @param endpoint - Endpoint type (callback/poll)
 * @returns Object with allowed status and remaining requests
 */
export async function checkRateLimit(
	kv: KVNamespace,
	ip: string,
	endpoint: RateLimitEndpoint,
): Promise<{ allowed: boolean; remaining: number }> {
	const key = `ratelimit:${ip}:${endpoint}`;
	const maxRequests = RATE_LIMITS[endpoint];
	const data = await kv.get<RateLimitData>(key, 'json');

	if (!data) {
		return { allowed: true, remaining: maxRequests - 1 };
	}

	const remaining = maxRequests - data.count;
	return {
		allowed: data.count < maxRequests,
		remaining: Math.max(0, remaining - 1),
	};
}

/**
 * Increment rate limit counter
 *
 * @param kv - KV namespace for rate limiting
 * @param ip - Client IP address
 * @param endpoint - Endpoint type (callback/poll)
 */
export async function incrementRateLimit(
	kv: KVNamespace,
	ip: string,
	endpoint: RateLimitEndpoint,
): Promise<void> {
	const key = `ratelimit:${ip}:${endpoint}`;
	const data = await kv.get<RateLimitData>(key, 'json');

	const newData: RateLimitData = {
		count: (data?.count ?? 0) + 1,
		windowStart: data?.windowStart ?? new Date().toISOString(),
	};

	await kv.put(key, JSON.stringify(newData), {
		expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
	});
}

/**
 * Get client IP from request
 *
 * @param request - Incoming request
 * @returns Client IP address or 'unknown'
 */
export function getClientIp(request: Request): string {
	// Cloudflare provides the real client IP in CF-Connecting-IP header
	return (
		request.headers.get('CF-Connecting-IP') ??
		request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
		'unknown'
	);
}
