import 'server-only';
import crypto from 'crypto';
type SbType = 'images' | 'videos' | 'audio';

export const HOST = 'https://api.storyblocks.com';

export async function signResource(url: string, type: SbType) {
	const privateKey = process.env.STORYBLOCKS_PRIVATE_KEY!.trim();
	if (!privateKey) throw new Error('Missing STORYBLOCKS_PRIVATE_KEY');

	const expires = Math.floor(Date.now() / 1000) + 3600 * 24; // 24 hours
	const resource = `/api/v2/${type}/${url}`;

	const hmac = crypto
		.createHmac('sha256', privateKey + String(expires))
		.update(resource)
		.digest('hex');

	return { hmac, expires, resource };
}
