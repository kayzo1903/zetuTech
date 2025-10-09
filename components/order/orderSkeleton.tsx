import React from "react";
import { Card, CardContent } from "../ui/card";

export default function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-9 bg-gray-200 rounded w-28"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
