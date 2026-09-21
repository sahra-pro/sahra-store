import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const SITE_URL = (
  process.env.SITE_URL || "https://sahrastore.vercel.app"
).replace(/\/$/, "");

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const today = new Date().toISOString().split("T")[0];

    // الصفحات الثابتة
    const staticPages = [
      {
        url: `${SITE_URL}/`,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: `${SITE_URL}/products`,
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: `${SITE_URL}/categories`,
        changefreq: "weekly",
        priority: "0.8",
      },
      {
        url: `${SITE_URL}/about`,
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        url: `${SITE_URL}/privacy-policy`,
        changefreq: "yearly",
        priority: "0.3",
      },
      {
        url: `${SITE_URL}/terms`,
        changefreq: "yearly",
        priority: "0.3",
      },
      {
        url: `${SITE_URL}/shipping-policy`,
        changefreq: "yearly",
        priority: "0.3",
      },
      {
        url: `${SITE_URL}/return-policy`,
        changefreq: "yearly",
        priority: "0.3",
      },
    ];

    const staticUrls = staticPages
      .map(
        (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
      )
      .join("");

    // صفحات المنتجات
    const productUrls = products
      .filter((product) => product.seoSlug || product.slug)
      .map((product) => {
        const slug = encodeURIComponent(product.seoSlug || product.slug);

        let lastmod = today;

        if (product.updatedAt?.toDate) {
          lastmod = product.updatedAt.toDate().toISOString().split("T")[0];
        } else if (product.updatedAt) {
          const parsedDate = new Date(product.updatedAt);

          if (!Number.isNaN(parsedDate.getTime())) {
            lastmod = parsedDate.toISOString().split("T")[0];
          }
        }

        return `
  <url>
    <loc>${SITE_URL}/product/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${staticUrls}

${productUrls}

</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=UTF-8");

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );

    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap Error:", error);

    res.status(500).json({
      error: "Failed to generate sitemap",
      details: error.message,
    });
  }
}
