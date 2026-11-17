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
        <form onSubmit={handleSubmit} className="form">
            <input
                type="url"
                placeholder="Enter original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="input"
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

                className="input"
                required
            />

            <button type="submit" className="button">
                Shorten URL
            </button>

            {message && <p className="message">{message}</p>}

            {shortUrl && (
                <a href={shortUrl} className="short-link">
                    {shortUrl}
                </a>
            )}
        </form>
    );
}