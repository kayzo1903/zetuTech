// app/admin/loading.tsx (Minimal Version)
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-lg font-medium">Loading Dashboard...</p>
        <p className="text-sm text-muted-foreground">
          Preparing your admin dashboard
        </p>
      </div>
    </div>
  );
}