"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/auth/sign-in",
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "Login failed", {
            description: "Please try again.",
          });
        },
      },
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* ================= Header ================= */}
        <CardHeader className="text-center space-y-4">
          {/* ZetuTech Logo */}
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20 text-blue-700 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 7l-10 5 10 5 10-5-10-5zm0 7l-10 5 10 5 10-5-10-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome to zetu <span className="bg-blue-700">Tech</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Sign in to continue to your account
          </p>
        </CardHeader>

        {/* ================= Google Sign-In ================= */}
        <CardContent className="mt-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full h-12 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <div className="flex items-center justify-center gap-3">
              {/* Inline Google SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 488 512"
              >
                <path
                  fill="#EA4335"
                  d="M488 261.8c0-17.4-1.4-34-4-50.2H249v95.1h135.7c-5.8 31-23.3 57.2-49.6 74.6v61.9h80.3c46.9-43.2 73.6-107 73.6-181.4z"
                />
                <path
                  fill="#34A853"
                  d="M249 492c66.7 0 122.7-22 163.6-59.8l-80.3-61.9c-22.3 15-50.9 24.1-83.3 24.1-64 0-118.2-43.2-137.7-101.1H28.2v63.5C68.9 429.4 152.8 492 249 492z"
                />
                <path
                  fill="#4A90E2"
                  d="M111.3 293.2c-4.6-13.9-7.2-28.8-7.2-44.2s2.6-30.3 7.2-44.2V141.3H28.2C10.2 180.3 0 218.8 0 249c0 30.2 10.2 68.7 28.2 107.7l83.1-63.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M249 98.4c36.3 0 68.7 12.5 94.2 36.7l70.3-70.3C371.7 27.4 315.7 5 249 5 152.8 5 68.9 67.6 28.2 141.3l83.1 63.5c19.5-57.9 73.7-101.1 137.7-101.1z"
                />
              </svg>
              {loading ? "Signing in..." : "Sign in with Google"}
            </div>
          </Button>
        </CardContent>

        {/* ================= Footer ================= */}
        <CardFooter className="mt-6 text-center text-gray-500 dark:text-gray-400 text-xs">
          By signing in, you agree to our{" "}
          <a
            href="/terms"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </CardFooter>
      </Card>
    </div>
  );
}
