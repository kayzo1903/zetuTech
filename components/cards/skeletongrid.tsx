"use client";

import ProductSkeletonCard from "./productSkeletoncards";


export default function ProductSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeletonCard key={i} index={i} />
      ))}
    </>
  );
}
