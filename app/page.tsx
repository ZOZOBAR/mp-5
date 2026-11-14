import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-6">

        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow">

          <h1 className="text-3xl font-bold mb-3">
            URL Shortener
          </h1>

          <p className="text-gray-600 mb-6">
            Create a short URL with your custom alias.
          </p>

          <UrlForm />

        </div>

      </main>
  );
}