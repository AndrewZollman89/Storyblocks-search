import type { ImageAsset } from '@/types/storyblocks';

export async function searchAssets(
	type: 'images' | 'videos' | 'audio',
	params: URLSearchParams
): Promise<{ assets: ImageAsset[]; total: number }> {
	const res = await fetch(`/api/storyblocks/${type}?${params.toString()}`, { cache: 'no-store' });
	if (res.status !== 200) {
		const errorText = await res.json();
		throw new Error(`Failed: ${errorText.errors || 'Cannot fetch assets'}`);
	};

	const data = await res.json();
	const assets: ImageAsset[] = data?.results;
	const total = Number(data?.total_results) || assets.length;

	return { assets, total };
}
