import getUrl from "@/lib/getUrl";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({
                                               params,
                                           }: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;

    const originalUrl = await getUrl(alias);

    if (!originalUrl) {
        notFound();
    }

    redirect(originalUrl);
}