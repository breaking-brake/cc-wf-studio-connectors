/**
 * HTTP response helper functions
 */

/**
 * Create a JSON response
 */
export function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
		},
	});
}

/**
 * Create an HTML response
 */
export function htmlResponse(html: string, status = 200): Response {
	return new Response(html, {
		status,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
		},
	});
}

/**
 * Create a JSON error response
 */
export function errorResponse(message: string, status = 400): Response {
	return jsonResponse({ error: message }, status);
}

/**
 * Create CORS headers for preflight and regular responses
 */
export function corsHeaders(): HeadersInit {
	return {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
	};
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptions(): Response {
	return new Response(null, {
		status: 204,
		headers: corsHeaders(),
	});
}

/**
 * Add CORS headers to an existing response
 */
export function withCors(response: Response): Response {
	const newHeaders = new Headers(response.headers);
	for (const [key, value] of Object.entries(corsHeaders())) {
		newHeaders.set(key, value);
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders,
	});
}
