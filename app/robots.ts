import type { MetadataRoute } from "next";

function getBaseUrl(): string {
	const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";
	if (fromEnv) return fromEnv.replace(/\/$/, "");
	return "https://example.com";
}

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getBaseUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/products", "/products/", "/search", "/wishlist"],
				disallow: [
					"/admin-dashboard",
					"/api/",
					"/checkout",
					"/account",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}


