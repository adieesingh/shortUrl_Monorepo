"use client"
import axios from "axios"
import { useState } from "react";
export default function Home() {
  const [longUrlLink,setLongUrl]=useState("")
  const[short,setShortUrl]=useState("")
  const handleUrl=async()=>{
    try {
      const response=await axios.post("http://localhost:3002/url",{
    longUrl:longUrlLink
    })
    if(response){
       setShortUrl(response.data.shortUrl)
    }
    } catch (error) {
      console.log(error)
    }
   
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
        
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          URL Shortener
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Convert long URLs into short, shareable links.
        </p>

        <form className="space-y-4">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            className="w-full px-5 py-4 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
           onChange={(e)=>setLongUrl(e.target.value)} />

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200"
           onClick={handleUrl}>
            Generate Short URL
          </button>
        </form>

        {/* Response Section */}
        <div className="mt-8 p-5 rounded-xl bg-black/20 border border-white/10">
          <h2 className="text-gray-300 mb-2">Your Short URL</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              readOnly
              value={short}
              placeholder="https://short.ly/abc123"
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-green-400 border border-slate-700"
            />

            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              Copy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}