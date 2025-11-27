import { handleOptions, jsonResponse } from '@cc-wf-studio-connectors/shared';
import {
	handleSlackCallback,
	handleSlackExchange,
	handleSlackPoll,
} from '@cc-wf-studio-connectors/slack';
import type { Env } from './env.js';

/**
 * Route configuration
 */
interface Route {
	pattern: RegExp;
	handler: (request: Request, env: Env, match: RegExpMatchArray) => Promise<Response>;
	methods: string[];
}

/**
 * Route definitions
 */
const routes: Route[] = [
	// Health check
	{
		pattern: /^\/health\/?$/,
		methods: ['GET'],
		handler: async () => {
			return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
		},
	},
	// Slack OAuth callback
	{
		pattern: /^\/slack\/callback\/?$/,
		methods: ['GET'],
		handler: async (request, env) => {
			return handleSlackCallback(request, env);
		},
	},
	// Slack poll
	{
		pattern: /^\/slack\/poll\/?$/,
		methods: ['GET', 'OPTIONS'],
		handler: async (request, env) => {
			if (request.method === 'OPTIONS') {
				return handleOptions();
			}
			return handleSlackPoll(request, env);
		},
	},
	// Slack token exchange
	{
		pattern: /^\/slack\/exchange\/?$/,
		methods: ['POST', 'OPTIONS'],
		handler: async (request, env) => {
			if (request.method === 'OPTIONS') {
				return handleOptions();
			}
			return handleSlackExchange(request, env);
		},
	},
	// Discord OAuth callback (future)
	{
		pattern: /^\/discord\/callback\/?$/,
		methods: ['GET'],
		handler: async () => {
			return jsonResponse({ error: 'Discord OAuth not implemented yet' }, 501);
		},
	},
	// Discord poll (future)
	{
		pattern: /^\/discord\/poll\/?$/,
		methods: ['GET', 'OPTIONS'],
		handler: async (request) => {
			if (request.method === 'OPTIONS') {
				return handleOptions();
			}
			return jsonResponse({ error: 'Discord OAuth not implemented yet' }, 501);
		},
	},
];

/**
 * Route incoming requests to appropriate handlers
 *
 * @param request - Incoming request
 * @param env - Environment bindings
 * @returns Response from matched handler or 404
 */
export async function route(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname;
	const method = request.method;

	// Find matching route
	for (const routeDef of routes) {
		const match = path.match(routeDef.pattern);
		if (match && routeDef.methods.includes(method)) {
			return routeDef.handler(request, env, match);
		}
	}

	// Method not allowed
	for (const routeDef of routes) {
		const match = path.match(routeDef.pattern);
		if (match) {
			return jsonResponse(
				{
					error: 'Method not allowed',
					allowedMethods: routeDef.methods,
				},
				405,
			);
		}
	}

	// Not found
	return jsonResponse({ error: 'Not found', path }, 404);
}
