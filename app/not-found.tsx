import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6 px-4">
			<div className="space-y-2">
				<h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
				<p className="text-muted-foreground max-w-md">
					The page you are looking for doesn&apos;t exist or has been moved.
				</p>
			</div>
			<div className="flex items-center gap-3">
				<Button asChild>
					<Link href="/">Go to Home</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/search">Browse Products</Link>
				</Button>
			</div>
		</div>
	);
}


