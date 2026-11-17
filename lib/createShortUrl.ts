"use server";

import getCollection, { URLS_COLLECTION } from "@/db";
import { MongoServerError } from "mongodb";

// Shape of the result sent back to the form component
type CreateShortUrlResult = {
    success: boolean;
    message: string;
    shortPath?: string;
};

// Server Action: validates the input and saves the alias + URL to MongoDB.
// Runs on the server, so the database secret is never exposed to the client.
export default async function createShortUrl(
    originalUrl: string,
    alias: string
): Promise<CreateShortUrlResult> {

    // Remove spaces at the start and end of the input
    originalUrl = originalUrl.trim();
    alias = alias.trim();

    // Both fields are required
    if (!originalUrl || !alias) {
        return {
            success: false,
            message: "Please enter a URL and an alias."
        };
    }

    // Backend URL validation: new URL() throws an error if the text is not a valid URL
    let parsedUrl: URL;

    try {
        parsedUrl = new URL(originalUrl);
    } catch {
        return {
            success: false,
            message: "Please enter a valid URL."
        };
    }

    // Only allow web links (blocks things like "javascript:" or "ftp:")
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return {
            success: false,
            message: "Only HTTP and HTTPS URLs are supported."
        };
    }
    // the condition below was learned from AI suggestion! here this explanation of the work !
    // Alias check with a regular expression:
    //   ^ and $        -> check the whole string, from start to end
    //   [a-zA-Z0-9_-]  -> only letters, numbers, underscore, hyphen
    //   {1,40}         -> length between 1 and 40
    // This keeps characters like spaces, "/" or "?" out of the short link,
    // because they would break the /r/alias path.
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(alias)) {
        return {
            success: false,
            message: "Alias must be 1–40 letters, numbers, hyphens, or underscores."
        };
    }

    // Check that the URL really exists by sending a request to it.
    // A correctly formatted URL like "https://asdf" can still point nowhere,
    // so if the site cannot be reached within 5 seconds, the URL is rejected.
    // Any response (even 404 or 405) means the site exists, so only network errors fail.
    try {
        await fetch(parsedUrl, {
            method: "HEAD",
            signal: AbortSignal.timeout(5000)
        });
    } catch {
        return {
            success: false,
            message: "Could not verify URL. Please check the link and try again."
        };
    }

    try {
        const collection = await getCollection(URLS_COLLECTION);

        // Unique index: MongoDB itself will reject a second document with the same alias.
        // (If the index already exists, this call does nothing.)
        await collection.createIndex(
            { alias: 1 },
            { unique: true }
        );

        // Save the new short link
        const result = await collection.insertOne({
            alias,
            originalUrl: parsedUrl.toString()
        });

        if (!result.acknowledged) {
            throw new Error("Database insert failed");
        }

        // Send back the path; the form adds the site's domain in front of it
        return {
            success: true,
            message: "Short URL created successfully!",
            shortPath: `/r/${alias}`
        };

    } catch (error) {

        // Error code 11000 = "duplicate key": the alias is already taken
        if (error instanceof MongoServerError && error.code === 11000) {
            return {
                success: false,
                message: "This alias is already taken."
            };
        }

        // Any other database error
        console.error(error);

        return {
            success: false,
            message: "Failed to create short URL."
        };
    }
}
