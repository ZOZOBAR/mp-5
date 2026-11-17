import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
      <main className="main">

        <div className="card">

          <h1 className="title">
            URL Shortener
          </h1>

          <p className="subtitle">
            Create a short URL with your custom alias.
          </p>

          <UrlForm />

        </div>

      </main>
  );
}