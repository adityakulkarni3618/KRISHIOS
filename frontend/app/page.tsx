// Skeleton only: shows live backend health. UNTESTED — run `npm install && npm run build` and report output.
async function getHealth() {
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/health`, { cache: "no-store" });
    return await r.json();
  } catch { return null; }
}
export default async function Home() {
  const h = await getHealth();
  return (<main style={{ padding: 24 }}><h1>AGRINEXUS</h1>
    <p>Backend: {h ? `${h.status} (${h.environment})` : "UNAVAILABLE"}</p></main>);
}
