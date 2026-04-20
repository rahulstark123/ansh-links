"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContinueToHomeButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push("/home");
    }, 1700);
  };

  return (
    <button
      type="button"
      onClick={handleContinue}
      disabled={isLoading}
      className="mt-9 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#b78bff] to-[#23dcff] py-3.5 text-center text-[1rem] font-semibold tracking-[0.01em] text-[#0f1220] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_12px_36px_rgba(32,222,255,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-95 sm:text-[1.1rem]"
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1220]/30 border-t-[#0f1220]" />
          Creating your digital identity...
        </>
      ) : (
        "Create Digital Identity"
      )}
    </button>
  );
}
