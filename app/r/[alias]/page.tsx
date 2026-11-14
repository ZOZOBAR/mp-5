import getUrl from "@/lib/getUrl";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

export default async function RedirectPage({
                                               params,
                                           }: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;

    await connection();

    const originalUrl = await getUrl(alias);

    if (!originalUrl) {
        notFound();
    }

    redirect(originalUrl);
}