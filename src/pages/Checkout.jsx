import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Loader2,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSettings } from "../hooks/useSettings";

import { trackEvent } from "../lib/metaPixel";
import { trackTikTok } from "../lib/tiktokPixel";

const DEFAULT_MAP_CENTER = [24.7136, 46.6753];

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { settings, loading: settingsLoading } = useSettings();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "",
    neighborhood: "",
    shortAddress: "",
    notes: "",
    latitude: null,
    longitude: null,
  });

  const [selectedShippingId, setSelectedShippingId] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [activeSection, setActiveSection] = useState("customer");

  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [mapSearch, setMapSearch] = useState("");
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchResults, setMapSearchResults] = useState([]);

  const activeShippingMethods = Array.isArray(settings?.shipping?.methods)
    ? settings.shipping.methods.filter((method) => method?.active !== false)
    : [];

  const defaultShippingMethod =
    activeShippingMethods.find((method) => method?.isDefault) ||
    activeShippingMethods[0] ||
    null;

  const selectedShippingMethod =
    activeShippingMethods.find((method) => method?.id === selectedShippingId) ||
    defaultShippingMethod;

  const baseShippingFee = Number(settings?.shipping?.shippingFee || 0);

  const freeShippingThreshold = Number(
    settings?.shipping?.freeShippingThreshold || 0,
  );

  const isFreeShipping =
    freeShippingThreshold > 0 &&
    Number(cartTotal || 0) >= freeShippingThreshold;

  const baseShippingCost = isFreeShipping ? 0 : baseShippingFee;

  const shippingCost = selectedShippingMethod
    ? baseShippingCost + Number(selectedShippingMethod.extraFee || 0)
    : baseShippingCost;

  const finalTotal = Number(cartTotal || 0) + Number(shippingCost || 0);

  useEffect(() => {
    if (cartItems.length === 0 || orderCompleted) return;

    trackEvent("InitiateCheckout", {
      content_ids: cartItems.map((item) => item.id),
      content_type: "product",
      num_items: cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      ),
      value: Number(finalTotal),
      currency: "SAR",
    });
  }, [cartItems, finalTotal, orderCompleted]);

  const updateMapMarker = useCallback((lat, lng) => {
    if (!mapRef.current) return;

    const position = [lat, lng];

    if (!markerRef.current) {
      markerRef.current = L.circleMarker(position, {
        radius: 9,
        color: "#641F2B",
        weight: 3,
        fillColor: "#A83F55",
        fillOpacity: 1,
      }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(position);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
      if (!apiKey) {
        throw new Error("MapTiler API key is missing");
      }
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(lng)},${encodeURIComponent(lat)}.json?language=ar&key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `MapTiler reverse geocoding failed: ${response.status}`,
        );
      }
      const data = await response.json();
      const features = Array.isArray(data?.features) ? data.features : [];
      const getName = (item) => {
        if (!item) return "";
        return (
          item?.text ||
          item?.properties?.name ||
          item?.properties?.name_ar ||
          item?.place_name ||
          ""
        );
      };
      const getPlaceTypes = (item) => {
        if (!item) return [];
        return Array.isArray(item?.place_type) ? item.place_type : [];
      };
      const allItems = [];
      for (const feature of features) {
        allItems.push(feature);
        if (Array.isArray(feature?.context)) {
          allItems.push(...feature.context);
        }
      }
      const findByType = (types) => {
        for (const item of allItems) {
          const placeTypes = getPlaceTypes(item);
          if (types.some((type) => placeTypes.includes(type))) {
            const name = getName(item);
            if (name) {
              return name;
            }
          }
        }
        return "";
      };
      const city = findByType(["municipality", "locality", "place"]);
      const neighborhood = findByType([
        "neighbourhood",
        "neighborhood",
        "suburb",
        "quarter",
        "district",
        "municipal_district",
        "residential",
      ]);

      return { city, neighborhood };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return { city: "", neighborhood: "" };
    }
  }, []);

  const handleMapLocation = useCallback(
    async (lat, lng, fromMapClick = false) => {
      const latitude = Number(lat);
      const longitude = Number(lng);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      updateMapMarker(latitude, longitude);

      if (mapRef.current) {
        mapRef.current.flyTo(
          [latitude, longitude],
          Math.max(mapRef.current.getZoom(), 16),
          {
            animate: true,
            duration: 1.2,
          },
        );
      }

      setCustomer((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      setErrors((prev) => ({
        ...prev,
        location: "",
      }));

      setLocationLoading(true);

      setLocationMessage(
        fromMapClick ? "جارٍ تحديد المدينة والحي..." : "جارٍ تحديد موقعك...",
      );

      try {
        const result = await reverseGeocode(latitude, longitude);

        setCustomer((prev) => ({
          ...prev,
          latitude,
          longitude,
          city: result.city || prev.city,
          neighborhood: result.neighborhood || prev.neighborhood,
        }));

        if (result.city || result.neighborhood) {
          setLocationMessage("تم تحديد المدينة والحي تلقائيًا");
        } else {
          setLocationMessage(
            "تم تحديد موقعك، ويمكنك إدخال المدينة والحي يدويًا",
          );
        }
      } catch (error) {
        console.error("Location handling error:", error);

        setLocationMessage(
          "تم تحديد الموقع، ويمكنك إدخال المدينة والحي يدويًا",
        );
      } finally {
        setLocationLoading(false);
      }
    },
    [reverseGeocode, updateMapMarker],
  );

  const searchMapLocation = async () => {
    const query = mapSearch.trim();

    if (!query) {
      setMapSearchResults([]);
      return;
    }

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    if (!apiKey) {
      setLocationMessage("لم يتم إعداد مفتاح الخرائط");
      return;
    }

    setMapSearchLoading(true);
    setMapSearchResults([]);

    try {
      const url =
        `https://api.maptiler.com/geocoding/` +
        `${encodeURIComponent(query)}.json` +
        `?language=ar&limit=5&key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`MapTiler search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "MAPTILER FEATURES DETAILS:",
        data.features?.map((feature) => ({
          text: feature.text,
          place_name: feature.place_name,
          place_type: feature.place_type,
          properties: feature.properties,
          context: feature.context,
        })),
      );

      const results = Array.isArray(data?.features) ? data.features : [];

      setMapSearchResults(results);
    } catch (error) {
      console.error("Map search error:", error);

      setLocationMessage("تعذر البحث عن الموقع، حاول مرة أخرى");
    } finally {
      setMapSearchLoading(false);
    }
  };

  const handleMapSearchResult = async (result) => {
    const coordinates = result?.geometry?.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return;
    }

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    setMapSearchResults([]);

    setMapSearch(result?.place_name || result?.text || mapSearch);

    await handleMapLocation(latitude, longitude, false);
  };

  useEffect(() => {
    if (
      activeSection !== "delivery" ||
      !mapContainerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    if (!apiKey) {
      console.error("MapTiler API key is missing");
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_MAP_CENTER,
      zoom: 5,
      zoomControl: false,
      attributionControl: true,
    });

    L.control
      .zoom({
        position: "bottomleft",
      })
      .addTo(map);

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${encodeURIComponent(
        apiKey,
      )}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        crossOrigin: true,
      },
    ).addTo(map);

    map.on("click", (event) => {
      handleMapLocation(event.latlng.lat, event.latlng.lng, true);
    });

    mapRef.current = map;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [activeSection, handleMapLocation]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("المتصفح لا يدعم تحديد الموقع الجغرافي");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("جارٍ تحديد موقعك...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        handleMapLocation(latitude, longitude, false);
      },
      (error) => {
        console.error("Geolocation error:", error);

        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage("يرجى السماح للمتصفح بالوصول إلى موقعك");
        } else {
          setLocationMessage("تعذر تحديد موقعك، حاول مرة أخرى");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "city" || name === "neighborhood") {
      setDeliveryConfirmed(false);
    }
  };

  const handleShippingChange = (methodId) => {
    setSelectedShippingId(methodId);

    setShippingConfirmed(false);

    setErrors((prev) => ({
      ...prev,
      shipping: "",
    }));
  };

  const validateCustomer = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "يرجى إدخال الاسم الكامل";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "يرجى إدخال رقم الجوال";
    } else {
      const cleanPhone = customer.phone.replace(/\s/g, "");

      if (!/^05\d{8}$/.test(cleanPhone)) {
        newErrors.phone = "يرجى إدخال رقم جوال سعودي صحيح";
      }
    }

    return newErrors;
  };

  const validateDelivery = () => {
    const newErrors = {};

    if (!customer.city.trim()) {
      newErrors.city = "يرجى إدخال المدينة";
    }

    if (!customer.neighborhood.trim()) {
      newErrors.neighborhood = "يرجى إدخال الحي";
    }

    if (customer.latitude == null || customer.longitude == null) {
      newErrors.location = "يرجى تحديد موقعك على الخريطة";
    }

    return newErrors;
  };

  const validateShipping = () => {
    const newErrors = {};

    if (!selectedShippingMethod) {
      newErrors.shipping = "يرجى اختيار شركة الشحن";
    }

    return newErrors;
  };

  const confirmCustomer = () => {
    const newErrors = validateCustomer();

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setCustomerConfirmed(true);
    setActiveSection("delivery");
  };

  const confirmDelivery = () => {
    const newErrors = validateDelivery();

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setDeliveryConfirmed(true);
    setActiveSection("shipping");
  };

  const confirmShipping = () => {
    const newErrors = validateShipping();

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setShippingConfirmed(true);
    setActiveSection("payment");
  };

  const confirmPayment = () => {
    setPaymentConfirmed(true);
    setActiveSection("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerErrors = validateCustomer();

    const deliveryErrors = validateDelivery();

    const shippingErrors = validateShipping();

    const newErrors = {
      ...customerErrors,
      ...deliveryErrors,
      ...shippingErrors,
    };

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (Object.keys(customerErrors).length > 0) {
        setActiveSection("customer");
      } else if (Object.keys(deliveryErrors).length > 0) {
        setActiveSection("delivery");
      } else if (Object.keys(shippingErrors).length > 0) {
        setActiveSection("shipping");
      }

      return;
    }

    if (
      !customerConfirmed ||
      !deliveryConfirmed ||
      !shippingConfirmed ||
      !paymentConfirmed
    ) {
      if (!customerConfirmed) {
        setActiveSection("customer");
      } else if (!deliveryConfirmed) {
        setActiveSection("delivery");
      } else if (!shippingConfirmed) {
        setActiveSection("shipping");
      } else {
        setActiveSection("payment");
      }

      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          ...customer,
          phone: customer.phone.replace(/\s/g, ""),
          address: customer.shortAddress,
        },

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),

        subtotal: cartTotal,
        shipping: shippingCost,
        total: finalTotal,

        shippingCompany: selectedShippingMethod
          ? {
              id: selectedShippingMethod.id,
              name: selectedShippingMethod.name,
              extraFee: Number(selectedShippingMethod.extraFee || 0),
              totalFee: Number(shippingCost || 0),
            }
          : null,

        paymentMethod: "الدفع عند الاستلام",
      });

      console.log("ORDER:", order);

      /*
       * إنشاء الطلب هو العملية الأساسية.
       * فشل البريد لا يعني فشل الطلب ولا يجب أن يؤدي
       * إلى إعادة إنشاء الطلب.
       */
      try {
        const response = await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order,
          }),
        });

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (response.ok && data?.success) {
          console.log("EMAIL SENT:", data);
        } else {
          console.error("EMAIL FAILED:", {
            status: response.status,
            data,
          });
        }
      } catch (emailError) {
        console.error("EMAIL REQUEST ERROR:", emailError);
      }

      trackEvent("Purchase", {
        content_ids: order.items.map((item) => item.id),
        content_type: "product",
        num_items: order.items.reduce(
          (total, item) => total + Number(item.quantity || 0),
          0,
        ),
        value: Number(order.total),
        currency: "SAR",
      });

      trackTikTok("CompletePayment", {
        contents: order.items.map((item) => ({
          content_id: item.id,
          content_name: item.name,
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
        })),
        value: Number(order.total),
        currency: "SAR",
      });

      setOrderCompleted(true);

      clearCart();

      navigate(`/order-confirmation/${order.orderNumber}`, {
        replace: true,
        state: {
          order,
        },
      });
    } catch (error) {
      console.error("Create Order Error:", error);

      alert("حدث خطأ أثناء تأكيد الطلب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  if (settingsLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#FBF6F1]"
      >
        <div className="flex items-center gap-3 text-sm text-[#806D70]">
          <Loader2 className="h-5 w-5 animate-spin text-[#641F2B]" />
          <span>جارٍ تحميل بيانات المتجر...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return <Navigate to="/cart" replace />;
  }

  const sectionButtonClass = "w-full text-right transition";

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF6F1] py-5 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* HEADER */}
        <div className="mb-5 sm:mb-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold text-[#A83F55]">سهرة</p>

              <h1 className="text-2xl font-black tracking-tight text-[#4A1821] sm:text-3xl">
                إتمام الطلب
              </h1>

              <p className="mt-1 text-xs text-[#806D70] sm:text-sm">
                أكمل الخطوات التالية لتأكيد طلبك.
              </p>
            </div>

            <Link
              to="/cart"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F7EEE9]"
              aria-label="العودة إلى السلة"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          {/* MAIN */}
          <div className="space-y-4">
            {/* ORDER SUMMARY */}
            <section className="overflow-hidden rounded-2xl border border-[#E8D9D6] bg-white shadow-[0_8px_30px_rgba(100,31,43,0.04)]">
              <div className="flex items-center justify-between border-b border-[#F0E6E3] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <ShoppingBag className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-[#4A1821]">
                      ملخص الطلب
                    </h2>

                    <p className="mt-0.5 text-[11px] text-[#806D70]">
                      {cartItems.length} منتج
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-[11px] text-[#806D70]">المنتجات</p>

                  <p className="text-lg font-black text-[#641F2B]">
                    {Number(cartTotal).toFixed(2)}{" "}
                    <span className="text-xs">ر.س</span>
                  </p>
                </div>
              </div>

              <div className="max-h-48 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1]">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#A99A9D]">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}

                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#641F2B] px-1 text-[9px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-bold text-[#4A1821]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[11px] text-[#806D70]">
                        {Number(item.price || 0).toFixed(2)} ر.س
                      </p>
                    </div>

                    <p className="text-xs font-black text-[#641F2B]">
                      {(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      ).toFixed(2)}{" "}
                      ر.س
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CUSTOMER SECTION */}
            <section className="overflow-hidden rounded-2xl border border-[#E8D9D6] bg-white shadow-[0_8px_30px_rgba(100,31,43,0.04)]">
              <button
                type="button"
                onClick={() =>
                  setActiveSection(
                    activeSection === "customer" ? "" : "customer",
                  )
                }
                className={`${sectionButtonClass} flex items-center justify-between gap-4 px-4 py-4 sm:px-5`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      customerConfirmed
                        ? "bg-[#7A8B43] text-white"
                        : "bg-[#F2E4E1] text-[#641F2B]"
                    }`}
                  >
                    {customerConfirmed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-[#4A1821]">
                      بيانات العميل
                    </h2>

                    {customerConfirmed ? (
                      <p className="mt-1 truncate text-[11px] text-[#806D70]">
                        {customer.name} — {customer.phone}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#806D70]">
                        الاسم ورقم الجوال
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#806D70] transition ${
                    activeSection === "customer" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeSection === "customer" && (
                <div className="border-t border-[#F0E6E3] p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                      >
                        الاسم الكامل
                      </label>

                      <div className="relative">
                        <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99A9D]" />

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={customer.name}
                          onChange={handleChange}
                          placeholder="الاسم الكامل"
                          autoComplete="name"
                          className={`h-12 w-full rounded-xl border bg-[#FBF6F1] py-2 pr-10 pl-3 text-sm text-[#4A1821] outline-none transition ${
                            errors.name
                              ? "border-red-400"
                              : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white"
                          }`}
                        />
                      </div>

                      {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                      >
                        رقم الجوال
                      </label>

                      <div className="relative">
                        <Phone className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99A9D]" />

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          value={customer.phone}
                          onChange={handleChange}
                          placeholder="05xxxxxxxx"
                          autoComplete="tel"
                          dir="ltr"
                          className={`h-12 w-full rounded-xl border bg-[#FBF6F1] py-2 pr-10 pl-3 text-left text-sm text-[#4A1821] outline-none transition ${
                            errors.phone
                              ? "border-red-400"
                              : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white"
                          }`}
                        />
                      </div>

                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={confirmCustomer}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    تأكيد بيانات العميل
                  </button>
                </div>
              )}
            </section>

            {/* DELIVERY SECTION */}
            <section
              className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(100,31,43,0.04)] ${
                customerConfirmed
                  ? "border-[#E8D9D6]"
                  : "border-[#E8D9D6] opacity-70"
              }`}
            >
              <button
                type="button"
                disabled={!customerConfirmed}
                onClick={() =>
                  customerConfirmed &&
                  setActiveSection(
                    activeSection === "delivery" ? "" : "delivery",
                  )
                }
                className={`${sectionButtonClass} flex items-center justify-between gap-4 px-4 py-4 disabled:cursor-not-allowed sm:px-5`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      deliveryConfirmed
                        ? "bg-[#7A8B43] text-white"
                        : "bg-[#F2E4E1] text-[#641F2B]"
                    }`}
                  >
                    {deliveryConfirmed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-[#4A1821]">
                      بيانات التوصيل
                    </h2>

                    {deliveryConfirmed ? (
                      <p className="mt-1 truncate text-[11px] text-[#806D70]">
                        {customer.city} — {customer.neighborhood} —{" "}
                        {customer.shortAddress}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#806D70]">
                        الموقع والعنوان
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#806D70] transition ${
                    activeSection === "delivery" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeSection === "delivery" && customerConfirmed && (
                <div className="border-t border-[#F0E6E3]">
                  {/* MAP SEARCH */}
                  <div className="relative border-b border-[#F0E6E3] p-4 sm:p-5">
                    <div className="relative">
                      <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99A9D]" />

                      <input
                        type="text"
                        value={mapSearch}
                        onChange={(e) => {
                          setMapSearch(e.target.value);
                          setMapSearchResults([]);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            searchMapLocation();
                          }
                        }}
                        placeholder="ابحث عن مدينة، حي أو موقع..."
                        className="h-12 w-full rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] py-2 pr-10 pl-20 text-sm text-[#4A1821] outline-none transition focus:border-[#A83F55] focus:bg-white"
                      />

                      <button
                        type="button"
                        onClick={searchMapLocation}
                        disabled={mapSearchLoading || !mapSearch.trim()}
                        className="absolute left-1.5 top-1.5 flex h-9 items-center gap-1.5 rounded-lg bg-[#641F2B] px-3 text-xs font-bold text-white transition hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {mapSearchLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}

                        <span>بحث</span>
                      </button>
                    </div>

                    {mapSearchResults.length > 0 && (
                      <div className="absolute inset-x-4 top-[72px] z-[1000] overflow-hidden rounded-xl border border-[#E8D9D6] bg-white shadow-xl sm:inset-x-5">
                        {mapSearchResults.map((result, index) => (
                          <button
                            key={result.id || index}
                            type="button"
                            onClick={() => handleMapSearchResult(result)}
                            className="flex w-full items-start gap-3 border-b border-[#F0E6E3] px-3 py-3 text-right last:border-b-0 hover:bg-[#FBF6F1]"
                          >
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A83F55]" />

                            <span className="min-w-0">
                              <span className="block text-xs font-bold text-[#4A1821]">
                                {result.text || "موقع"}
                              </span>

                              <span className="mt-0.5 block line-clamp-2 text-[10px] leading-5 text-[#806D70]">
                                {result.place_name || ""}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MAP */}
                  <div className="relative">
                    <div
                      ref={mapContainerRef}
                      className="h-[300px] w-full sm:h-[360px]"
                    />

                    <div className="absolute right-3 top-3 z-[500]">
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={locationLoading}
                        className="flex h-10 items-center gap-2 rounded-xl border border-[#E8D9D6] bg-white px-3.5 text-xs font-bold text-[#641F2B] shadow-lg transition hover:bg-[#FBF6F1] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {locationLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Navigation className="h-4 w-4" />
                        )}

                        <span>
                          {locationLoading ? "جارٍ التحديد..." : "موقعي"}
                        </span>
                      </button>
                    </div>

                    <div className="pointer-events-none absolute bottom-3 right-3 z-[500] max-w-[calc(100%-24px)]">
                      {locationMessage && (
                        <div className="rounded-xl border border-[#E8D9D6] bg-white/95 px-3 py-2 text-[11px] font-medium text-[#4A1821] shadow-lg backdrop-blur">
                          {locationMessage}
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.location && (
                    <div className="border-t border-red-100 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-500">
                      {errors.location}
                    </div>
                  )}

                  {/* DELIVERY FIELDS */}
                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* CITY */}
                      <div>
                        <label
                          htmlFor="city"
                          className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                        >
                          المدينة
                        </label>

                        <div className="relative">
                          <MapPin className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99A9D]" />

                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={customer.city}
                            onChange={handleChange}
                            placeholder="اكتب المدينة"
                            className={`h-12 w-full rounded-xl border bg-[#FBF6F1] py-2 pr-10 pl-3 text-sm text-[#4A1821] outline-none transition ${
                              errors.city
                                ? "border-red-400"
                                : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white"
                            }`}
                          />
                        </div>

                        {errors.city && (
                          <p className="mt-1 text-[11px] text-red-500">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* NEIGHBORHOOD */}
                      <div>
                        <label
                          htmlFor="neighborhood"
                          className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                        >
                          الحي
                        </label>

                        <div className="relative">
                          <MapPin className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99A9D]" />

                          <input
                            id="neighborhood"
                            name="neighborhood"
                            type="text"
                            value={customer.neighborhood}
                            onChange={handleChange}
                            placeholder="اكتب الحي"
                            className={`h-12 w-full rounded-xl border bg-[#FBF6F1] py-2 pr-10 pl-3 text-sm text-[#4A1821] outline-none transition ${
                              errors.neighborhood
                                ? "border-red-400"
                                : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white"
                            }`}
                          />
                        </div>

                        {errors.neighborhood && (
                          <p className="mt-1 text-[11px] text-red-500">
                            {errors.neighborhood}
                          </p>
                        )}
                      </div>

                      {/* SHORT ADDRESS */}
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="shortAddress"
                          className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                        >
                          العنوان المختصر
                        </label>

                        <input
                          id="shortAddress"
                          name="shortAddress"
                          type="text"
                          value={customer.shortAddress}
                          onChange={handleChange}
                          placeholder="مثال: ABCD1234"
                          maxLength={8}
                          dir="ltr"
                          autoComplete="postal-code"
                          className={`h-12 w-full rounded-xl border bg-[#FBF6F1] px-3 text-left text-sm uppercase tracking-wider text-[#4A1821] outline-none transition ${
                            errors.shortAddress
                              ? "border-red-400"
                              : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white"
                          }`}
                        />

                        <p className="mt-1 text-[10px] text-[#A99A9D]">
                          4 أحرف و4 أرقام، مثل ABCD1234
                        </p>

                        {errors.shortAddress && (
                          <p className="mt-1 text-[11px] text-red-500">
                            {errors.shortAddress}
                          </p>
                        )}
                      </div>

                      {/* NOTES */}
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="notes"
                          className="mb-1.5 block text-xs font-bold text-[#4A1821]"
                        >
                          ملاحظات الطلب{" "}
                          <span className="font-normal text-[#A99A9D]">
                            (اختياري)
                          </span>
                        </label>

                        <textarea
                          id="notes"
                          name="notes"
                          rows={2}
                          value={customer.notes}
                          onChange={handleChange}
                          placeholder="مثال: الاتصال قبل الوصول"
                          className="min-h-[82px] w-full resize-none rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-3 py-2.5 text-sm leading-6 text-[#4A1821] outline-none transition focus:border-[#A83F55] focus:bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={confirmDelivery}
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تأكيد بيانات التوصيل
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* SHIPPING SECTION */}
            <section
              className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(100,31,43,0.04)] ${
                deliveryConfirmed
                  ? "border-[#E8D9D6]"
                  : "border-[#E8D9D6] opacity-70"
              }`}
            >
              <button
                type="button"
                disabled={!deliveryConfirmed}
                onClick={() =>
                  deliveryConfirmed &&
                  setActiveSection(
                    activeSection === "shipping" ? "" : "shipping",
                  )
                }
                className={`${sectionButtonClass} flex items-center justify-between gap-4 px-4 py-4 disabled:cursor-not-allowed sm:px-5`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      shippingConfirmed
                        ? "bg-[#7A8B43] text-white"
                        : "bg-[#F2E4E1] text-[#641F2B]"
                    }`}
                  >
                    {shippingConfirmed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-[#4A1821]">
                      شركة الشحن
                    </h2>

                    {shippingConfirmed && selectedShippingMethod ? (
                      <p className="mt-1 truncate text-[11px] text-[#806D70]">
                        {selectedShippingMethod.name} —{" "}
                        {shippingCost === 0
                          ? "مجاني"
                          : `${shippingCost.toFixed(2)} ر.س`}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#806D70]">
                        اختر شركة الشحن
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#806D70] transition ${
                    activeSection === "shipping" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeSection === "shipping" && deliveryConfirmed && (
                <div className="border-t border-[#F0E6E3] p-4 sm:p-5">
                  <div className="space-y-2.5">
                    {activeShippingMethods.length > 0 ? (
                      activeShippingMethods.map((method) => {
                        const methodIsSelected =
                          selectedShippingMethod?.id === method.id;

                        const methodExtraFee = Number(method.extraFee || 0);

                        const methodCost = baseShippingCost + methodExtraFee;

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handleShippingChange(method.id)}
                            className={`flex w-full items-center justify-between gap-4 rounded-xl border-2 p-3.5 text-right transition ${
                              methodIsSelected
                                ? "border-[#641F2B] bg-[#FBF6F1]"
                                : "border-[#E8D9D6] bg-white hover:border-[#A83F55] hover:bg-[#FBF6F1]"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                  methodIsSelected
                                    ? "bg-[#641F2B] text-white"
                                    : "bg-[#F2E4E1] text-[#641F2B]"
                                }`}
                              >
                                {methodIsSelected ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Truck className="h-4 w-4" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-black text-[#4A1821] sm:text-sm">
                                  {method.name}
                                </p>

                                {method.isDefault && (
                                  <p className="mt-0.5 text-[10px] text-[#7A8B43]">
                                    شركة الشحن الأساسية
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 text-left">
                              {methodCost === 0 ? (
                                <span className="text-xs font-black text-[#7A8B43]">
                                  مجاني
                                </span>
                              ) : (
                                <span className="text-xs font-black text-[#641F2B]">
                                  {methodCost.toFixed(2)} ر.س
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-4 text-xs leading-6 text-[#806D70]">
                        لا توجد شركات شحن مفعلة حاليًا. سيتم تطبيق رسوم الشحن
                        الأساسية.
                      </div>
                    )}

                    {errors.shipping && (
                      <p className="text-[11px] font-medium text-red-500">
                        {errors.shipping}
                      </p>
                    )}

                    {freeShippingThreshold > 0 && !isFreeShipping && (
                      <div className="rounded-xl bg-[#F7EEE9] px-3.5 py-3 text-[10px] leading-5 text-[#806D70]">
                        الشحن الأساسي يصبح مجانيًا عند وصول الطلب إلى{" "}
                        <strong className="text-[#641F2B]">
                          {freeShippingThreshold.toFixed(2)} ر.س
                        </strong>
                        .
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={confirmShipping}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    تأكيد شركة الشحن
                  </button>
                </div>
              )}
            </section>

            {/* PAYMENT SECTION */}
            <section
              className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(100,31,43,0.04)] ${
                shippingConfirmed
                  ? "border-[#E8D9D6]"
                  : "border-[#E8D9D6] opacity-70"
              }`}
            >
              <button
                type="button"
                disabled={!shippingConfirmed}
                onClick={() =>
                  shippingConfirmed &&
                  setActiveSection(activeSection === "payment" ? "" : "payment")
                }
                className={`${sectionButtonClass} flex items-center justify-between gap-4 px-4 py-4 disabled:cursor-not-allowed sm:px-5`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      paymentConfirmed
                        ? "bg-[#7A8B43] text-white"
                        : "bg-[#F2E4E1] text-[#641F2B]"
                    }`}
                  >
                    {paymentConfirmed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-[#4A1821]">
                      طريقة الدفع
                    </h2>

                    <p className="mt-1 text-[11px] text-[#806D70]">
                      {paymentConfirmed
                        ? "الدفع عند الاستلام"
                        : "اختر طريقة الدفع"}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#806D70] transition ${
                    activeSection === "payment" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeSection === "payment" && shippingConfirmed && (
                <div className="border-t border-[#F0E6E3] p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={confirmPayment}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 p-3.5 text-right transition ${
                      paymentConfirmed
                        ? "border-[#641F2B] bg-[#FBF6F1]"
                        : "border-[#641F2B] bg-[#FBF6F1]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#641F2B] text-white">
                        <PackageCheck className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-black text-[#4A1821]">
                          الدفع عند الاستلام
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#806D70]">
                          ادفع عند استلام طلبك
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#641F2B]" />
                  </button>

                  <button
                    type="button"
                    onClick={confirmPayment}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    تأكيد طريقة الدفع
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* SIDE SUMMARY */}
          <aside className="lg:sticky lg:top-5">
            <section className="overflow-hidden rounded-2xl border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.07)]">
              <div className="border-b border-[#F0E6E3] px-4 py-4 sm:px-5">
                <h2 className="text-sm font-black text-[#4A1821]">
                  ملخص الدفع
                </h2>
              </div>

              <div className="p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806D70]">المنتجات</span>

                    <span className="font-bold text-[#4A1821]">
                      {Number(cartTotal).toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806D70]">الشحن</span>

                    {shippingCost === 0 ? (
                      <span className="font-bold text-[#7A8B43]">مجاني</span>
                    ) : (
                      <span className="font-bold text-[#4A1821]">
                        {Number(shippingCost).toFixed(2)} ر.س
                      </span>
                    )}
                  </div>

                  {selectedShippingMethod && (
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#806D70]">شركة الشحن</span>

                      <span className="max-w-[180px] truncate font-bold text-[#4A1821]">
                        {selectedShippingMethod.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-4 border-t border-[#E8D9D6]" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-[#4A1821]">
                      الإجمالي
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#806D70]">
                      شامل الشحن
                    </p>
                  </div>

                  <p className="text-2xl font-black text-[#641F2B]">
                    {Number(finalTotal).toFixed(2)}
                    <span className="mr-1 text-xs">ر.س</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting || cartItems.length === 0 || !paymentConfirmed
                  }
                  className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.18)] transition hover:-translate-y-0.5 hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جارٍ تأكيد الطلب...
                    </>
                  ) : (
                    <>
                      <span>تأكيد الطلب</span>
                      <ChevronLeft className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[10px] leading-5 text-[#A99A9D]">
                  الدفع عند الاستلام
                </p>

                <Link
                  to="/cart"
                  className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#806D70] transition hover:text-[#641F2B]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  العودة إلى السلة
                </Link>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
