"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service if desired
		// console.error(error);
	}, [error]);

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6 px-4">
			<div className="space-y-2">
				<h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
				<p className="text-muted-foreground max-w-md">
					An unexpected error occurred. You can try again or return to the home page.
				</p>
				{error?.digest ? (
					<p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
				) : null}
			</div>
			<div className="flex items-center gap-3">
				<Button onClick={() => reset()}>Try Again</Button>
				<Link href="/">
					<Button variant="outline">Go to Home</Button>
				</Link>
			</div>
		</div>
	);
}


