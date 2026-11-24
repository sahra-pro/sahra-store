
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { initFacebookPixel, trackPageView } from "../../lib/metaPixel";
import { trackTikTokPageView } from "../../lib/tiktokPixel";

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    initFacebookPixel();
    trackPageView();
    trackTikTokPageView();
  }, [location.pathname]);

  return null;
}
