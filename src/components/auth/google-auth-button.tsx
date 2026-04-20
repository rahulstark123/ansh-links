"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleAuthButtonProps = {
  nextPath: string;
  className: string;
  label: string;
};

export default function GoogleAuthButton({ nextPath, className, label }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleGoogleSignIn} className={className} disabled={isLoading}>
      <span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/5 text-sm font-bold text-[#22deff]">
        G
      </span>
      {isLoading ? "Redirecting..." : label}
    </button>
  );
}
