"use client";

import AssetCard from "@/components/AssetCard";
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import { searchAssets } from "@/lib/storyblocks-client";
import { ImageAsset } from "@/types/storyblocks";
import React, { useState, useEffect, useRef } from "react";

type Category = "videos" | "audio" | "images";

const VIDEO_ITEMS = ["All Video", "Footage", "Backgrounds", "Templates"];
const AUDIO_ITEMS = ["All Audio", "Music", "Sound Effects"];
const IMAGE_ITEMS = ["All Images", "Photos", "Snapshots", "Vectors", "Illustrations"];

function getCategoryFor(label: string): Category {
	if (label.includes("Video") || VIDEO_ITEMS.includes(label)) return "videos";
	if (label.includes("Audio") || AUDIO_ITEMS.includes(label)) return "audio";
	return "images";
}

function itemsFor(cat: Category) {
	if (cat === "videos") return VIDEO_ITEMS;
	if (cat === "audio") return AUDIO_ITEMS;
	return IMAGE_ITEMS;
}

export default function StoryblocksSearchUI() {
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useState("");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [page, setPage] = useState(1);
	const [resultsPerPage] = useState(12);
	const [assets, setAssets] = useState<ImageAsset[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [category, setCategory] = useState<Category>("images");
	const [mediaType, setMediaType] = useState<string>("All Images");
	const [orientation, setOrientation] = useState<string>("All");
	const [color, setColor] = useState<string>("#000000");
	const [details, setDetails] = useState<string[]>([]);
	const [sort, setSort] = useState("Most Downloaded");
	const [total, setTotal] = useState(0);
	const [menuOpen, setMenuOpen] = useState(false);
	const [showFilters, setShowFilters] = useState(true);

	const totalPages = Math.max(1, Math.ceil(total / resultsPerPage));

	useEffect(() => {
		function onDocClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setMenuOpen(false);
		}
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, []);

	useEffect(() => {
		setPage(1);
		fetchAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, mediaType, orientation, color, details, sort]);

	useEffect(() => {
		fetchAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const fetchAssets = async () => {
		setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({
				keywords: query,
				page: String(page),
				results_per_page: String(resultsPerPage),
			});

			params.set("content_type", mediaType.includes("All") ? "all" : mediaType.toLowerCase().replace(" ", "_"));

			if (category !== "audio" && orientation !== "All") {
				params.set("orientation", orientation.toLowerCase());
			}

			if (color && color !== "#000000") params.set("color", color.replace("#", ""));

			if (details.includes("Model Released")) params.set("has_talent_released", "true");
			if (details.includes("Property Released")) params.set("has_property_released", "true");

			const sortMap: Record<string, string> = {
				"Relevance": "most_relevant",
				"Most Downloaded": "most_downloaded",
				"Most Recent": "most_recent",
			};
			params.set("sort_by", sortMap[sort] ?? "most_relevant");

			const { assets: mappedAssets, total: mappedTotal } = await searchAssets(category, params);

			setAssets(mappedAssets);
			setTotal(mappedTotal);
		} catch (e: any) {
			setError(e?.message || "Failed to load");
		} finally {
			setLoading(false);
		}
	};

	const onResetFilters = () => {
		setCategory("images");
		setMediaType("All Images");
		setOrientation("All");
		setColor("#000000");
		setDetails([]);
		setQuery("");
		setPage(1);
	}

	const onPick = (label: string) => {
		const cat = getCategoryFor(label);
		setCategory(cat);
		setMediaType(label);
		setMenuOpen(false);
	};

	const mediaTypeOptions = itemsFor(category);

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			<header className="sticky top-0 z-20 border-b border-gray-700 bg-gray-800/80 backdrop-blur">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<h1 className="text-center text-xl font-semibold">Search Media via Storyblocks API</h1>
					<p className="mt-1 text-center text-xs text-gray-400">This is for an assessment.</p>

					<div className="mt-5">
						<div className="flex items-center justify-center gap-2">
							<div className="flex w-full max-w-2xl items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 p-1 shadow-sm">
								<Dropdown
									ref={dropdownRef}
									value={mediaType}
									opended={menuOpen}
									onOpen={() => setMenuOpen(!menuOpen)}
									disabled={loading}
								>
									{
										VIDEO_ITEMS.map((item, index) => <DropdownItem key={item} index={index} item={item} mediaType={mediaType} onClick={onPick} />)
									}
									{
										AUDIO_ITEMS.map((item, index) => <DropdownItem key={item} index={index} item={item} mediaType={mediaType} onClick={onPick} />)
									}
									{
										IMAGE_ITEMS.map((item, index) => <DropdownItem key={item} index={index} item={item} mediaType={mediaType} onClick={onPick} />)
									}
								</Dropdown>

								<input
									className="flex-1 bg-transparent px-2 py-2 text-sm text-gray-100 outline-none placeholder-gray-400"
									placeholder="Search"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
								/>

								{query && 
									<button className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-700" onClick={() => setQuery("")}>×</button>
								}

								<Button
									onClick={fetchAssets}
									className="bg-blue-600 text-sm text-white hover:bg-blue-500"
									disabled={loading}
								>
									Search
								</Button>
							</div>
						</div>

						<div className="mx-auto mt-3 flex w-full max-w-2xl items-center justify-between gap-2">
							<Button
								onClick={() => setShowFilters((s) => !s)}
								variant="outlined"
								disabled={loading}
							>
								{showFilters ? "Hide Filters" : "Show Filters"}
							</Button>

							<div className="flex items-center gap-2">
								<label className="text-xs text-gray-400">Sort</label>
								<select className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm hover:bg-gray-700" value={sort} onChange={(e) => setSort(e.target.value)}>
									<option>Most Downloaded</option>
									<option>Most Recent</option>
									<option>Relevance</option>
								</select>
								<Button
									onClick={() => setView(view === "grid" ? "list" : "grid")}
									variant="outlined"
									disabled={loading}
								>
									{view === "grid" ? "List View" : "Grid View"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
				{showFilters && 
					<aside className="col-span-12 h-fit rounded-xl border border-gray-700 bg-gray-800 p-4 lg:sticky lg:top-24 lg:col-span-3">
						<div className="flex items-center justify-end">
							<Button
								onClick={onResetFilters}
								variant="outlined"
								disabled={loading}
							>
								Clear Filters
							</Button>
						</div>

						<section className="mt-4">
							<h3 className="text-xs font-medium uppercase tracking-wide text-gray-400">Media Type</h3>
							<div className="mt-2 space-y-2">
								{
									mediaTypeOptions.map((m) => <label key={m} className="flex items-center gap-2 text-sm">
											<input type="radio" name="mediaType" className="accent-blue-500" checked={mediaType === m} onChange={() => setMediaType(m)} />
											<span className={m.startsWith("All ") ? "font-medium text-blue-300" : ""}>{m}</span>
										</label>
									)
								}
							</div>
						</section>

						{category !== "audio" && 
							<section className="mt-6">
								<h3 className="text-xs font-medium uppercase tracking-wide text-gray-400">Orientation</h3>
								<div className="mt-2 space-y-2">
									{
										["All", "Landscape", "Portrait", "Square"].map((o) => <label key={o} className="flex items-center gap-2 text-sm">
												<input type="radio" name="orientation" className="accent-blue-500" checked={orientation === o} onChange={() => setOrientation(o)} />
												{o}
											</label>
										)
									}
								</div>
							</section>
						}

						<section className="mt-6">
							<div className="flex items-center justify-between">
								<h3 className="text-xs font-medium uppercase tracking-wide text-gray-400">Color</h3>
								<button className="text-xs text-gray-400 hover:underline" onClick={() => setColor("#000000")}>Reset Color</button>
							</div>
							<div className="mt-2 flex items-center gap-3">
								<input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900" />
								<span className="text-xs text-gray-400">{color}</span>
							</div>
						</section>

						<section className="mt-6">
							<h3 className="text-xs font-medium uppercase tracking-wide text-gray-400">Media Details</h3>
							<div className="mt-2 space-y-2">
								{
									["Model Released", "Property Released"].map((d) => <label key={d} className="flex items-center gap-2 text-sm">
											<input type="checkbox" className="accent-blue-500" checked={details.includes(d)} onChange={() => setDetails((prev) => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} />
											{d}
										</label>
									)
								}
							</div>
						</section>
					</aside>
				}

				<section className={`${showFilters ? "lg:col-span-9" : "lg:col-span-12"} col-span-12`}>
					{loading && 
						<Loading
							label="Fetching Data..."
							className="mt-4"
						/>
					}
					{error && <p className="text-sm text-red-400">{error}</p>}
					{!loading && !error && assets.length === 0 && <p className="text-sm text-gray-400">No results found.</p>}

					{ !loading && (view === "grid" 
						? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
							{assets.map((a) => <AssetCard key={a.id} a={a} type="grid" />)}
						</div>
						: <ul className="space-y-3">
							{assets.map((a) => <AssetCard key={a.id} a={a} type="list" />)}
						</ul>)
					}

					{assets.length > 0 && (
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={(p) => setPage(p)}
						/>
					)}
				</section>
			</main>
		</div>
	);
}
