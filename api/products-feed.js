import { adminDb } from "./firebaseAdmin.js";

const SITE_URL = (process.env.SITE_URL || "https://sahracart.com").replace(
  /\/+$/,
  "",
);

// تنظيف النصوص من HTML والإيموجي والمسافات الزائدة
function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// حماية النصوص داخل XML
function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// حماية محتوى CDATA
function escapeCdata(value = "") {
  return String(value).replace(/]]>/g, "]]]]><![CDATA[>");
}

// تنظيف الروابط
function cleanUrl(value = "") {
  return String(value).trim();
}

export default async function handler(req, res) {
  try {
    const snapshot = await adminDb.collection("products").get();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">

  <channel>

    <title>سهرة - منتجات سهرة</title>

    <link>${escapeXml(SITE_URL)}</link>

    <description>منتجات سهرة المختارة بعناية</description>
`;

    snapshot.forEach((doc) => {
      const product = doc.data();

      const id = String(doc.id);

      const title = cleanText(product.name || "");

      const description = cleanText(product.description || "");

      const slug = String(product.seoSlug || product.slug || doc.id).trim();

      const productUrl = `${SITE_URL}/product/${encodeURIComponent(slug)}`;

      const images = Array.isArray(product.images)
        ? product.images.filter(Boolean).map(cleanUrl)
        : [];

      const image = images[0] || "";

      // لا نرسل المنتج إذا لم توجد صورة رئيسية
      if (!title || !image) {
        return;
      }

      const extraImages = images
        .slice(1)
        .map(
          (img) =>
            `      <g:additional_image_link>${escapeXml(
              img,
            )}</g:additional_image_link>\n`,
        )
        .join("");

      const priceNumber = Number(product.price || 0);

      const oldPriceNumber = Number(product.oldPrice || 0);

      if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
        return;
      }

      const price = priceNumber.toFixed(2);

      const hasSalePrice =
        Number.isFinite(oldPriceNumber) && oldPriceNumber > priceNumber;

      const oldPrice = oldPriceNumber.toFixed(2);

      const stock = Number(product.stock || 0);

      const availability = stock > 0 ? "in stock" : "out of stock";

      const category = cleanText(product.category || "Health & Beauty");

      xml += `
    <item>

      <g:id>${escapeXml(id)}</g:id>

      <g:title><![CDATA[${escapeCdata(title)}]]></g:title>

      <g:description><![CDATA[${escapeCdata(description)}]]></g:description>

      <g:link>${escapeXml(productUrl)}</g:link>

      <g:image_link>${escapeXml(image)}</g:image_link>

${extraImages}      <g:availability>${availability}</g:availability>

      <g:condition>new</g:condition>

${
  hasSalePrice
    ? `      <g:price>${oldPrice} SAR</g:price>
      <g:sale_price>${price} SAR</g:sale_price>
`
    : `      <g:price>${price} SAR</g:price>
`
}

      <g:brand>سهرة</g:brand>

      <g:identifier_exists>false</g:identifier_exists>

      <g:product_type><![CDATA[${escapeCdata(category)}]]></g:product_type>

      <g:google_product_category>
        Health &amp; Beauty &gt; Health Care
      </g:google_product_category>

      <g:adult>no</g:adult>

    </item>
`;
    });

    xml += `
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");

    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

    return res.status(200).send(xml);
  } catch (error) {
    console.error("Product feed error:", error);

    return res.status(500).send("Feed Error");
  }
}
