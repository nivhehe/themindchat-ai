interface Env {
	GEMINI_API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const body = await request.json() as any;
			const keys = (env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);

			if (keys.length === 0) {
				return new Response(JSON.stringify({ error: { message: 'No API keys configured in Worker.' } }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			}

			let lastData: any = null;
			let lastStatus = 500;

			for (const key of keys) {
				const response = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(body),
					}
				);

				lastStatus = response.status;
				lastData = await response.json();

				// If it's not a rate-limit error (429), return it immediately
				if (response.status !== 429) {
					return new Response(JSON.stringify(lastData), {
						status: lastStatus,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}
			}

			// If we looped through all keys and all returned 429, return the last response
			return new Response(JSON.stringify(lastData), {
				status: lastStatus,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		} catch (err: any) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}
	},
};
