export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: https://immodelo.fr/sitemap.xml`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
