"use server";

import getCollection, { URLS_COLLECTION } from "@/db";

export default async function getUrl(alias: string): Promise<string | null> {
    const collection = await getCollection(URLS_COLLECTION);

    const result = await collection.findOne({ alias });

    if (!result) {
        return null;
    }

    return result.originalUrl as string;
}