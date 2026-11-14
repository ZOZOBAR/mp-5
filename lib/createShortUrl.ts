"use server";

import getCollection, { URLS_COLLECTION } from "@/db";
import { MongoServerError } from "mongodb";

type CreateShortUrlResult = {
    success: boolean;
    message: string;
    shortPath?: string;
};

export default async function createShortUrl(
    originalUrl: string,
    alias: string
): Promise<CreateShortUrlResult> {

    originalUrl = originalUrl.trim();
    alias = alias.trim();

    if (!originalUrl || !alias) {
        return {
            success: false,
            message: "Please enter a URL and an alias."
        };
    }

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(originalUrl);
    } catch {
        return {
            success: false,
            message: "Please enter a valid URL."
        };
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return {
            success: false,
            message: "Only HTTP and HTTPS URLs are supported."
        };
    }

    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(alias)) {
        return {
            success: false,
            message: "Alias must be 1–40 letters, numbers, hyphens, or underscores."
        };
    }

    try {
        const collection = await getCollection(URLS_COLLECTION);

        await collection.createIndex(
            { alias: 1 },
            { unique: true }
        );

        const result = await collection.insertOne({
            alias,
            originalUrl: parsedUrl.toString()
        });

        if (!result.acknowledged) {
            throw new Error("Database insert failed");
        }

        return {
            success: true,
            message: "Short URL created successfully!",
            shortPath: `/r/${alias}`
        };

    } catch (error) {

        if (error instanceof MongoServerError && error.code === 11000) {
            return {
                success: false,
                message: "This alias is already taken."
            };
        }

        console.error(error);

        return {
            success: false,
            message: "Failed to create short URL."
        };
    }
}