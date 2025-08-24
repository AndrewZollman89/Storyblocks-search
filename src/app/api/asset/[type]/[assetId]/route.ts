import { HOST, signResource } from '@/lib/server/storyblocks-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
    { params }: { params: { type: "image" | "video" | "audio", assetId: string } }
) {
	const publicKey = process.env.STORYBLOCKS_PUBLIC_KEY!.trim() || "";
    if (!publicKey) return NextResponse.json({ error: "Missing STORYBLOCKS_PUBLIC_KEY" }, { status: 500 });

	const { type, assetId } = await params;

	if (!assetId) {
		return NextResponse.json({ error: 'Missing assetId parameter' }, { status: 400 });
	}

	if (type !== 'image' && type !== 'video' && type !== 'audio') {
		return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
	}

	const sbType = type === 'audio' ? 'audio' : type === 'video' ? 'videos' : 'images';

	try {
		const { hmac, expires, resource } = await signResource(`stock-item/details/${assetId}`, sbType);
		
		const url = new URL(`${HOST}${resource}`);
		req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

		url.searchParams.set("APIKEY", publicKey);
        url.searchParams.set("EXPIRES", String(expires));
        url.searchParams.set("HMAC", hmac);
        url.searchParams.set("project_id", process.env.STORYBLOCKS_PROJECT_ID || "");
        url.searchParams.set("user_id", process.env.STORYBLOCKS_USER_ID || "");

		const sbRes = await fetch(url.toString(), { cache: "no-store" });
        const json = await sbRes.json();
        return NextResponse.json(json, { status: sbRes.status });
	} catch (e: any) {
		return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
	}
}
