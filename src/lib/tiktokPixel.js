
export const TIKTOK_PIXEL_ID =
  import.meta.env.VITE_TIKTOK_PIXEL_ID || "";

let isInitialized = false;

export const initTikTokPixel = () => {
  if (typeof window === "undefined") return;

  if (!TIKTOK_PIXEL_ID) {
    console.warn("TikTok Pixel ID is not configured.");
    return;
  }

  if (isInitialized || window.ttq) {
    isInitialized = true;
    return;
  }

  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;

    const ttq = (w[t] = w[t] || []);

    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
      "holdConsent",
      "revokeConsent",
      "grantConsent",
    ];

    ttq.setAndDefer = function (target, method) {
      target[method] = function () {
        target.push([method].concat(Array.prototype.slice.call(arguments)));
      };
    };

    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }

    ttq.load = function (pixelId) {
      const script = d.createElement("script");
      script.async = true;
      script.src = "https://analytics.tiktok.com/i18n/pixel/events.js";
      script.onload = function () {
        ttq._i = ttq._i || {};
      };

      const firstScript = d.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      ttq._i = ttq._i || {};
      ttq._i[pixelId] = [];
      ttq._t = ttq._t || {};
      ttq._t[pixelId] = Date.now();
      ttq._o = ttq._o || {};
      ttq._o[pixelId] = {};
    };

    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  })(window, document, "ttq");

  isInitialized = true;
};

export const trackTikTok = (event, data = {}) => {
  if (typeof window === "undefined") return;

  if (!window.ttq || !TIKTOK_PIXEL_ID) return;

  window.ttq.track(event, data);
};

export const trackTikTokPageView = () => {
  if (typeof window === "undefined") return;

  if (!window.ttq || !TIKTOK_PIXEL_ID) return;

  window.ttq.page();
};
