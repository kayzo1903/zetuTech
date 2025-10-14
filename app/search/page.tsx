// app/search/page.tsx
import { Suspense } from "react";
import SearchResults from "@/components/search/search-results";
import SearchLoading from "@/components/search/search-loading";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<SearchLoading />}>
        <SearchResults searchQuery={q} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';
  
  return {
    title: query ? `Search: "${query}" | Your Store` : 'Search Products',
    description: query 
      ? `Search results for "${query}" - Find products matching your search.`
      : 'Search our product catalog to find exactly what you need.',
  };
}