
const BOT_UA_REGEX =
  /googlebot|google-inspectiontool|storebot-google|bingbot|yandex|baiduspider|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|applebot/i;

export const config = {
  matcher: ["/product/:slug*", "/products"],
};

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

function parseFirestoreValue(v) {
  if (!v) return null;

  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return Number(v.doubleValue);
  if (v.booleanValue !== undefined) return v.booleanValue;

  if (v.arrayValue !== undefined) {
    return (v.arrayValue.values || []).map(parseFirestoreValue);
  }

  if (v.mapValue !== undefined) {
    const result = {};
    const fields = v.mapValue.fields || {};

    for (const key in fields) {
      result[key] = parseFirestoreValue(fields[key]);
    }

    return result;
  }

  return null;
}

function docToProduct(doc) {
  const fields = doc.fields || {};
  const product = {};

  for (const key in fields) {
    product[key] = parseFirestoreValue(fields[key]);
  }

  product.id = doc.name?.split("/").pop();

  return product;
}

async function getProductBySlug(slug) {
  if (!FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is not configured");
  }

  const url =
    `https://firestore.googleapis.com/v1/projects/` +
    `${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;

  const tryQuery = async (field) => {
    const body = {
      structuredQuery: {
        from: [{ collectionId: "products" }],
        where: {
          fieldFilter: {
            field: {
              fieldPath: field,
            },
            op: "EQUAL",
            value: {
              stringValue: slug,
            },
          },
        },
        limit: 1,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Firestore request failed: ${response.status}`);
    }

    const data = await response.json();
    const doc = data?.[0]?.document;

    if (!doc) return null;

    return docToProduct(doc);
  };

  return (await tryQuery("seoSlug")) || (await tryQuery("slug"));
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderProductHtml(product, requestedSlug) {
  const SITE_URL = "https://sahrastore.vercel.app";
  const STORE_NAME = "سهرة";
  const BRAND_NAME = "سهرة";

  const title =
    product.seoTitle?.trim() || `${product.name} | ${STORE_NAME}`;

  const description =
    product.seoDescription?.trim() ||
    stripHtml(product.description || "").slice(0, 300) ||
    `اشترِ ${product.name} من ${STORE_NAME}.`;

  const finalSlug =
    product.seoSlug || product.slug || requestedSlug;

  const url =
    `${SITE_URL}/product/${encodeURIComponent(finalSlug)}`;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : [`${SITE_URL}/logo.png`];

  const image = images[0];

  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);

  const category =
    product.category || product.categories?.[0] || "";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: STORE_NAME,
        alternateName: "SAHRA",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      },

      {
        "@type": "Product",
        "@id": url,
        name: product.name,
        image: images,
        description,
        sku: product.id,

        ...(category ? { category } : {}),

        brand: {
          "@type": "Brand",
          name: BRAND_NAME,
        },

        offers: {
          "@type": "Offer",
          "@id": `${url}#offer`,
          url,
          priceCurrency: "SAR",
          price: price.toFixed(2),

          availability:
            stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

          itemCondition:
            "https://schema.org/NewCondition",

          seller: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: STORE_NAME,
          },
        },
      },
    ],
  };

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${escapeHtml(title)}</title>

  <meta
    name="description"
    content="${escapeHtml(description)}"
  />

  <meta
    name="robots"
    content="index, follow, max-image-preview:large"
  />

  <link
    rel="canonical"
    href="${escapeHtml(url)}"
  />

  <meta
    property="og:type"
    content="product"
  />

  <meta
    property="og:site_name"
    content="${escapeHtml(STORE_NAME)}"
  />

  <meta
    property="og:locale"
    content="ar_SA"
  />

  <meta
    property="og:title"
    content="${escapeHtml(title)}"
  />

  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  />

  <meta
    property="og:url"
    content="${escapeHtml(url)}"
  />

  <meta
    property="og:image"
    content="${escapeHtml(image)}"
  />

  <meta
    property="og:image:secure_url"
    content="${escapeHtml(image)}"
  />

  <meta
    property="og:image:type"
    content="image/jpeg"
  />

  <meta
    property="og:image:alt"
    content="${escapeHtml(product.name || STORE_NAME)}"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="${escapeHtml(title)}"
  />

  <meta
    name="twitter:description"
    content="${escapeHtml(description)}"
  />

  <meta
    name="twitter:image"
    content="${escapeHtml(image)}"
  />

  <script type="application/ld+json">
    ${JSON.stringify(schema)}
  </script>
</head>

<body>
  <main>
    <h1>${escapeHtml(product.name)}</h1>

    <p>${escapeHtml(description)}</p>

    <img
      src="${escapeHtml(image)}"
      alt="${escapeHtml(product.name)}"
    />

    <p>
      السعر:
      ${escapeHtml(String(product.price || ""))}
      ر.س
    </p>

    <a href="${escapeHtml(url)}">
      عرض المنتج في المتجر
    </a>
  </main>
</body>
</html>`;
}

export default async function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";

  // الزائر العادي يكمل إلى React
  if (!BOT_UA_REGEX.test(userAgent)) {
    return;
  }

  const url = new URL(request.url);

  try {
    // صفحة المنتج
    if (url.pathname.startsWith("/product/")) {
      const slug = decodeURIComponent(
        url.pathname.replace("/product/", ""),
      );

      if (!slug) return;

      const product = await getProductBySlug(slug);

      if (!product) {
        return;
      }

      const html = renderProductHtml(product, slug);

      return new Response(html, {
        status: 200,

        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    return;
  } catch (error) {
    console.error("Sahra middleware error:", error);
    return;
  }
}

