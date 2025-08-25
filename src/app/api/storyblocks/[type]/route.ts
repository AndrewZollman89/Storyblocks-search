import { NextRequest, NextResponse } from "next/server";
import { HOST, signResource } from "@/lib/server/storyblocks-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: { type: "images" | "videos" | "audio" } }
) {
    const { type } = await params;
    if (!type) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const publicKey = process.env.STORYBLOCKS_PUBLIC_KEY!.trim() || "";
    if (!publicKey) return NextResponse.json({ error: "Missing STORYBLOCKS_PUBLIC_KEY" }, { status: 500 });

    try {
        const { hmac, expires, resource } = await signResource("search", type);

        const url = new URL(`${HOST}${resource}`);

        req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

        url.searchParams.set("APIKEY", publicKey);
        url.searchParams.set("EXPIRES", String(expires));
        url.searchParams.set("HMAC", hmac);
        url.searchParams.set("project_id", process.env.STORYBLOCKS_PROJECT_ID || "");
        url.searchParams.set("user_id", process.env.STORYBLOCKS_USER_ID || "");

        console.log(url.toString())

        const sbRes = await fetch(url.toString(), { cache: "no-store" });
        const json = await sbRes.json();
        return NextResponse.json(json, { status: sbRes.status });
    } catch (err: any) {
        return NextResponse.json({ error: "Upstream error", detail: String(err?.message ?? err) }, { status: 502 });
    }
}
