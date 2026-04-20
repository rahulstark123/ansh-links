"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContinueToHomeButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [handle, setHandle] = useState("");
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleContinue = async () => {
    if (isLoading) return;
    const normalizedHandle = handle.trim().toLowerCase();
    if (!normalizedHandle) {
      setStatusText("Please choose a handle first.");
      return;
    }

    setIsLoading(true);
    setStatusText("Checking availability...");

    try {
      const response = await fetch("/api/users/claim-handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: normalizedHandle }),
      });

      const responseBody = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setStatusText(responseBody.message ?? "Could not save handle right now.");
        return;
      }

      setStatusText("Handle secured. Launching your dashboard...");
      router.push("/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-9">
      <label className="block">
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#11dafd]">Claim your handle</span>
        <div className="mt-3 flex items-center rounded-md border border-white/[0.08] bg-[#090c14]/96 px-4 py-3.5">
          <span className="text-[1rem] text-white/45 sm:text-[1.2rem]">links.anshapps.in/</span>
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
            className="ml-1 w-full bg-transparent text-[1.7rem] tracking-[-0.03em] text-white/92 outline-none placeholder:text-white/22 sm:text-[2rem]"
            placeholder="yourname"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </label>

      <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/45">
        Availability: <span className="text-[#11dafd]">{statusText ?? "Waiting for your handle"}</span>
      </p>

      <button
        type="button"
        onClick={handleContinue}
        disabled={isLoading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#b78bff] to-[#23dcff] py-3.5 text-center text-[1rem] font-semibold tracking-[0.01em] text-[#0f1220] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_12px_36px_rgba(32,222,255,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-95 sm:text-[1.1rem]"
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
    </div>
  );
}
