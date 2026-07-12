/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'app', port: '8000' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async redirects() {
    // Per-color product pages were merged into a single multi-color product per garment;
    // these keep old bookmarks/backlinks working instead of 404ing.
    const merges = {
      'polo-classic': ['polo-classic-navy', 'polo-classic-vert', 'polo-classic-blanc'],
      't-shirt-classic': ['t-shirt-classic-blanc', 't-shirt-classic-noir', 't-shirt-classic-gris-chine'],
      'hoodie-classic': ['hoodie-classic-noir', 'hoodie-classic-gris-chine'],
      'casquette-classic': ['casquette-classic-beige', 'casquette-classic-noire', 'casquette-classic-marine'],
    };

    return Object.entries(merges).flatMap(([canonical, oldSlugs]) =>
      oldSlugs.map((slug) => ({
        source: `/produit/${slug}`,
        destination: `/produit/${canonical}`,
        permanent: true,
      })),
    );
  },
};

module.exports = nextConfig;
