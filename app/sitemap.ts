import type { MetadataRoute } from "next";
import { dbServer } from "@/db/db-server";
import { product, productCategory } from "@/db/schema";
import { isNotNull } from "drizzle-orm";

function getBaseUrl(): string {
	const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
	if (fromEnv) return fromEnv.replace(/\/$/, "");
	return "https://zetutech.co.tz";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getBaseUrl();

	// Static routes that exist in the app
	const staticEntries: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: new Date() },
		{ url: `${baseUrl}/products`, lastModified: new Date() },
		{ url: `${baseUrl}/search`, lastModified: new Date() },
		{ url: `${baseUrl}/about`, lastModified: new Date() },
		{ url: `${baseUrl}/contact`, lastModified: new Date() },
		{ url: `${baseUrl}/privacy`, lastModified: new Date() },
		{ url: `${baseUrl}/terms&policy`, lastModified: new Date() },
		{ url: `${baseUrl}/support`, lastModified: new Date() },
		{ url: `${baseUrl}/wishlist`, lastModified: new Date() },
		{ url: `${baseUrl}/cart`, lastModified: new Date() },
		{ url: `${baseUrl}/shipping`, lastModified: new Date() },
		{ url: `${baseUrl}/warranty`, lastModified: new Date() },
	];

	// Products: use slug + id to match existing links (/products/[...slug])
	const products = await dbServer
		.select({ id: product.id, slug: product.slug, updatedAt: product.updatedAt })
		.from(product);

	const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
		url: `${baseUrl}/products/${p.slug}/${p.id}`,
		lastModified: p.updatedAt,
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	// Categories: include listing URLs using query param on /products
	const categories = await dbServer
		.select({ slug: productCategory.slug })
		.from(productCategory)
		.where(isNotNull(productCategory.slug));

	const uniqueCategorySlugs = Array.from(
		new Set(categories.map((c) => (c.slug || "").trim()).filter(Boolean))
	);

	const categoryEntries: MetadataRoute.Sitemap = uniqueCategorySlugs.map((slug) => ({
		url: `${baseUrl}/products?category=${encodeURIComponent(slug)}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.6,
	}));

	return [...staticEntries, ...categoryEntries, ...productEntries];
}


