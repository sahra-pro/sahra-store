
import { Helmet } from "react-helmet-async";

// سيتم استبداله بدومين سهرة الحقيقي عند اعتماده
const SITE_URL = "https://example.com";

const STORE_NAME = "سهرة";
const BRAND_NAME = "سهرة";

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SEO({ product }) {
  if (!product) return null;

  const title = product.seoTitle?.trim() || `${product.name} | ${STORE_NAME}`;

  const plainDescription = stripHtml(product.description || "");

  const description =
    product.seoDescription?.trim() ||
    plainDescription.slice(0, 300) ||
    `اشترِ ${product.name} من ${STORE_NAME}.`;

  const slug = product.seoSlug || product.slug;

  const url = `${SITE_URL}/product/${slug}`;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : [`${SITE_URL}/logo.png`];

  const image = images[0];

  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);

  const category = product.category || product.categories?.[0] || "";

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
          width: 1024,
          height: 1024,
        },

        image: `${SITE_URL}/logo.png`,
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${url}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: `${SITE_URL}/`,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "المنتجات",
            item: `${SITE_URL}/products`,
          },

          ...(category
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category,
                  item: `${SITE_URL}/products?category=${encodeURIComponent(
                    category,
                  )}`,
                },
              ]
            : []),

          {
            "@type": "ListItem",
            position: category ? 4 : 3,
            name: product.name,
            item: url,
          },
        ],
      },

      {
        "@type": "Product",

        "@id": url,

        name: product.name,

        image: images,

        description,

        sku: product.id,

        ...(category
          ? {
              category,
            }
          : {}),

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

          itemCondition: "https://schema.org/NewCondition",

          seller: {
            "@type": "Organization",

            "@id": `${SITE_URL}/#organization`,

            name: STORE_NAME,
          },
        },
      },
    ],
  };

  return (
    <Helmet>
      <html lang="ar" dir="rtl" />

      <title>{title}</title>

      <meta name="description" content={description} />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large"
      />

      <meta name="author" content={STORE_NAME} />

      <link rel="canonical" href={url} />

      <meta property="og:type" content="product" />

      <meta property="og:site_name" content={STORE_NAME} />

      <meta property="og:locale" content="ar_SA" />

      <meta property="og:title" content={title} />

      <meta property="og:description" content={description} />

      <meta property="og:url" content={url} />

      <meta property="og:image" content={image} />

      <meta property="og:image:secure_url" content={image} />

      <meta property="og:image:type" content="image/png" />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={image} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Helmet>
  );
}
