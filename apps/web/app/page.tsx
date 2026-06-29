"use client";

import axios from "axios";
import copy from "copy-text-to-clipboard";
import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [longUrlLink, setLongUrl] = useState("");
  const [short, setShortUrl] = useState("");

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
    if (!longUrlLink.trim()) {
      toast.error("Please enter a URL.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/url`,
        {
          longUrl: longUrlLink,
        }
      );

      setShortUrl(response.data.shortUrl);
      toast.success("Short URL generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate short URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 sm:p-8">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-gray-900">
          URL Shortener
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-600">
          Convert long URLs into short, shareable links.
        </p>

        <div className="space-y-4">
          <input
            type="url"
            value={longUrlLink}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={handleUrl}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Generate Short URL
          </button>
        </div>

        {short && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="mb-3 text-lg font-semibold text-gray-700">
              Your Short URL
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                readOnly
                value={short}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-indigo-600 font-medium"
              />

              <button
                type="button"
                onClick={copyButton}
                className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
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
          theme="colored"
          transition={Bounce}
        />
      </div>
    </div>
  );
}
