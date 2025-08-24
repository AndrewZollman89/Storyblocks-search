"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { AudioAsset, ImageAsset, VideoAsset } from "@/types/storyblocks";
import { CgChevronLeft } from "react-icons/cg";
import Loading from "@/components/Loading";

type Asset = ImageAsset | VideoAsset | AudioAsset;

export default function AssetDetailPage() {
	const router = useRouter();

	const params = useParams<{ type: string, assetId: string }>();

	const id = Number(params?.assetId ?? "0");
	const type = params?.type ?? "image";

	const [asset, setAssets] = useState<Asset>({
		id,
		title: "",
		thumbnail_url: "",
		preview_url: "",
		contentClass: type,
		type: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		handleLoadDetailInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleLoadDetailInfo = async () => {
		try {
			setLoading(true);
			const res = await fetch(`/api/asset/${type}/${id}`, { cache: "no-store" });
			// if (!res.ok) throw new Error(res.);
			if (!res.ok) {
				const errorText = await res.json();
				throw new Error(errorText.errors || "Failed to load asset details");
			}

			const data: Asset = await res.json();
			setAssets(data);
		} catch (err: any) {
			setError(err.message || "Failed to load asset details");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			<header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
					<div>
						<h1 className="text-lg font-semibold">Asset Detail</h1>
						<p className="text-xs text-gray-400">ID: {asset.id}</p>
					</div>
					<Button variant="outlined" className="flex items-center" onClick={() => router.back()}>
						<CgChevronLeft /> Back
					</Button>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-6">
				{error && <p className="mb-4 text-sm text-red-400">{error}</p>}
				{loading ? (
					<Loading className="mt-2" label="Loading Detail Info..." />
				) : (
					<div className="grid gap-6">
						<div className="rounded-xl border border-gray-800 bg-gray-800 p-3">
							{
								type === 'image' && (
									(asset as ImageAsset)?.preview_url 
									? <img
										src={(asset as ImageAsset)?.preview_url}
										alt={asset.title}
										className={`mx-auto w-auto aspect-[${(asset as ImageAsset)?.aspect_ratio}] rounded-lg object-contain`}
									/>
									: <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
										No image preview available
									</div>
								)
							}
							{
								type === 'video' && (
									(asset as VideoAsset)?.preview_urls 
									? <video controls className="mx-auto w-full rounded-lg object-contain">
										{
											window.innerWidth >= 720 && <source src={(asset as VideoAsset)?.preview_urls._720p} type="audio/mp4" />
										}
										{
											window.innerWidth >= 480 && window.innerWidth < 720 && <source src={(asset as VideoAsset)?.preview_urls._480p} type="audio/mp4" />
										}
										{
											window.innerWidth >= 360 && window.innerWidth < 480 && <source src={(asset as VideoAsset)?.preview_urls._360p} type="audio/mp4" />
										}
										{
											window.innerWidth < 360 && <source src={(asset as VideoAsset)?.preview_urls._180p} type="audio/mp4" />
										}
										Your browser does not support the audio element.
									</video>
									: <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
										No video preview available
									</div>
								)
							}
							{
								type === 'audio' && (
									(asset as AudioAsset)?.preview_url
									? <audio controls className="mt-2 w-full">
										<source src={(asset as AudioAsset)?.preview_url} type="audio/mp3" />
										Your browser does not support the audio element.
									</audio>
									: <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
										No audio preview available
									</div>
								)
							}
						</div>

						<div className="space-y-4">
							<div>
								<h2 className="text-xl font-semibold">{asset.title}</h2>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
								<div className="text-right"><span className="text-gray-500">ID:</span></div><div className="text-left">{asset.id}</div>
								<div className="text-right"><span className="text-gray-500">Asset ID:</span></div><div className="text-left">{asset.asset_id}</div>
								<div className="text-right"><span className="text-gray-500">Url ID:</span></div><div className="text-left">{asset.url_id}</div>
								<div className="text-right"><span className="text-gray-500">Class:</span></div><div className="text-left">{asset.contentClass}</div>
								<div className="text-right"><span className="text-gray-500">Type:</span></div><div className="text-left">{asset.type}</div>
								<div className="text-right"><span className="text-gray-500">Description:</span></div><div className="text-left">{asset.description}</div>
								<div className="text-right"><span className="text-gray-500">Categories:</span></div><div className="text-left">{asset.categories?.join(', ')}</div>
								<div className="text-right"><span className="text-gray-500">Keywords:</span></div><div className="text-left">{asset.keywords?.join(', ')}</div>
								
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
