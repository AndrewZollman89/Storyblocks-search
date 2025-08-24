"use client";

import Link from "next/link";
import { ImageAsset } from "@/types/storyblocks";

type Props = {
	a: ImageAsset;
	type: "grid" | "list";
};

export default function AssetCard({ a, type }: Props) {
	if (type === "grid") {
		return (
			<div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm transition hover:shadow-md">
				<Link
					href={{ pathname: `/assets/${a.contentClass}/${a.id}` }}
					className="block"
				>
					<div className="absolute inset-0 hidden items-end bg-black/0 p-3 transition group-hover:flex group-hover:bg-black/40">
						<div className="line-clamp-3 w-full rounded-md bg-gray-900/90 px-2 py-1 text-left text-xs font-medium text-gray-100">
							<p className="truncate text-ellipsis text-nowrap">{a.title}</p>
							<p className="text-gray-400">ID: {a.id}, TYPE: {a.type}</p>
						</div>
					</div>
					{a.thumbnail_url && (
						<img
							src={a.thumbnail_url}
							alt={a.title}
							className="h-40 w-full object-cover sm:h-44 md:h-48"
						/>
					)}
				</Link>
			</div>
		);
	}

	return (
		<li className="rounded-xl border border-gray-700 bg-gray-800 p-3 shadow-sm">
			<Link
				href={{ pathname: `/assets/${a.contentClass}/${a.id}` }}
				className="flex gap-3 items-center"
			>
				{a.thumbnail_url && (
					<div className="relative">
						<img src={a.thumbnail_url} alt={a.title} className="h-24 w-36 rounded-md object-cover" />
					</div>
				)}

				<div className="min-w-0 flex-1">
					<div className="truncate text-md font-medium text-gray-200 text-ellipsis text-nowrap text-left">{a.title}</div>
					<div className="truncate mt-1 text-xs text-gray-400 text-ellipsis text-nowrap text-left">ID: {a.id}, TYPE: {a.type}</div>
					<div className="truncate mt-1 text-xs text-gray-400 text-ellipsis text-nowrap text-left">{a.preview_url}</div>
				</div>
			</Link>
		</li>
	);
}
