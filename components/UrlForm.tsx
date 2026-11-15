"use client";

import { useState } from "react";
import createShortUrl from "@/lib/createShortUrl";

export default function UrlForm() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [message, setMessage] = useState("");
    const [shortUrl, setShortUrl] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!originalUrl.trim() || !alias.trim()) {
            setMessage("Please enter a URL and an alias.");
            return;
        }

        setMessage("");
        setShortUrl("");

        try {
            const result = await createShortUrl(originalUrl, alias);

            if (result.success && result.shortPath) {
                setShortUrl(window.location.origin + result.shortPath);
                setMessage("Short URL created successfully!");
            } else {
                setMessage(result.message);
            }
        } catch {
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="url"
                placeholder="Enter original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="border border-gray-300 p-3 rounded text-gray-900 placeholder:text-gray-400"
                required
            />

            <input
                type="text"
                placeholder="Custom alias"
                value={alias}
                onChange={(e) => {
                    setAlias(e.target.value);
                    setMessage("");
                    setShortUrl("");

                }}

                className="border border-gray-300 p-3 rounded text-gray-900"
                required
            />

            <button type="submit" className="bg-blue-600 text-white p-3 rounded">
                Shorten URL
            </button>

            {message && <p>{message}</p>}

            {shortUrl && (
                <a href={shortUrl} className="text-blue-600 underline">
                    {shortUrl}
                </a>
            )}
        </form>
    );
}