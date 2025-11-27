/**
 * cc-wf-studio-connectors
 *
 * OAuth authentication server for cc-wf-studio (Slack/Discord integration)
 *
 * This Cloudflare Worker handles OAuth callbacks from Slack (and Discord in the future),
 * storing authorization codes in KV for VSCode extension to poll and retrieve.
 */

import { jsonResponse } from '@cc-wf-studio-connectors/shared';
import type { Env } from './env.js';
import { route } from './router.js';

export default {
	/**
	 * Main fetch handler for the Worker
	 */
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		try {
			return await route(request, env);
		} catch (error) {
			// Log error for debugging
			console.error('Unhandled error:', error);

			// Return generic error response
			return jsonResponse(
				{
					error: 'Internal server error',
					message: error instanceof Error ? error.message : 'Unknown error',
				},
				500,
			);
		}
	},
};
