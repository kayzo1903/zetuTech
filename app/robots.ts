import type { MetadataRoute } from "next";

function getBaseUrl(): string {
	const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
	if (fromEnv) return fromEnv.replace(/\/$/, "");
	return "https://zetutech.co.tz";
}

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getBaseUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/about", "/services", "/contact"],
				disallow: [
					"/admin-dashboard",
					"/api/",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}


