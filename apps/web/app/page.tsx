"use client";

import axios from "axios";
import copy from "copy-text-to-clipboard";
import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [longUrlLink, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [short, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const copyButton = () => {
    if (!short) {
      toast.error("No URL to copy!");
      return;
    }

    const copied = copy(short);

    if (copied) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy.");
    }
  };

  const handleUrl = async () => {
    const trimmedAlias = customAlias.trim();

    if (!longUrlLink.trim()) {
      toast.error("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/url`,
        {
          longUrl: longUrlLink,
          ...(trimmedAlias && { shortUrl: trimmedAlias }),
        },
      );

      setShortUrl(response.data.shortUrl);
      toast.success("Short URL generated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to generate short URL.";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const charsSaved = short ? Math.max(longUrlLink.length - short.length, 0) : 0;
  const reduction =
    short && longUrlLink.length > 0
      ? Math.round((charsSaved / longUrlLink.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#131826] shadow-2xl p-6 sm:p-10">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-400 tracking-wide">
            $ shrink --url
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Turn long links short.
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-mono">
            paste a url, get something you can actually paste in a tweet.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-slate-500">
              Long URL
            </label>
            <input
              type="url"
              value={longUrlLink}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/a/very/long/path?with=params"
              className="w-full rounded-lg border border-white/10 bg-[#0B0F1A] px-4 py-3 font-mono text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-slate-500">
              Custom alias (optional)
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F1A] pl-4 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30">
              <span className="font-mono text-sm text-slate-600">/</span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-launch"
                className="w-full rounded-lg bg-transparent px-2 py-3 font-mono text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleUrl}
            disabled={loading}
            className={`w-full rounded-lg py-3 font-semibold text-[#0B0F1A] transition ${
              loading
                ? "bg-amber-500/40 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-300 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Generating...
              </div>
            ) : (
              "Generate short URL"
            )}
          </button>
        </div>

        {short && (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#0B0F1A] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Result
              </h2>
              {charsSaved > 0 && (
                <span className="rounded-full bg-teal-400/10 px-2.5 py-1 text-xs font-mono text-teal-400">
                  −{charsSaved} chars · {reduction}% shorter
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                readOnly
                value={short}
                type="url"
                className="flex-1 rounded-lg border border-white/10 bg-[#131826] px-4 py-3 font-mono text-sm text-amber-300"
              />

              <button
                type="button"
                onClick={copyButton}
                className="rounded-lg bg-teal-400 px-6 py-3 text-sm font-semibold text-[#0B0F1A] transition hover:bg-teal-300 active:scale-[0.98]"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          transition={Bounce}
        />
      </div>
    </div>
  );
}
