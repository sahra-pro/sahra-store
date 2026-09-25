import { useState } from "react";
import {
  FaStore,
  FaPalette,
  FaBox,
  FaTruck,
  FaBell,
  FaSave,
  FaUndo,
  FaCog,
  FaBullhorn,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaSlidersH,
  FaImage,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaStar,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";

import { useSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS } from "../context/default-settings";
import { uploadToCloudinary } from "../services/cloudinary";

const TAB_STYLES = {
  general: {
    icon: FaStore,
    description: "بيانات المتجر والتواصل",
  },
  theme: {
    icon: FaPalette,
    description: "الألوان والمظهر العام",
  },
  products: {
    icon: FaBox,
    description: "خيارات عرض المنتجات",
  },
  shipping: {
    icon: FaTruck,
    description: "الرسوم وشركات الشحن",
  },
  notifications: {
    icon: FaBell,
    description: "تنبيهات وإشعارات الإدارة",
  },
  announcement: {
    icon: FaBullhorn,
    description: "الرسائل الظاهرة للزوار",
  },
  banners: {
    icon: FaImage,
    description: "إدارة بنرات الصفحة الرئيسية",
  },
  advanced: {
    icon: FaCog,
    description: "إعدادات متقدمة",
  },
};

function normalizeShippingMethods(methods) {
  const currentMethods = Array.isArray(methods) ? methods : [];

  if (currentMethods.length === 0) {
    return [
      {
        id: `shipping-${Date.now()}`,
        name: "شركة الشحن الافتراضية",
        isDefault: true,
        active: true,
        extraFee: 0,
      },
    ];
  }

  const normalized = currentMethods.map((method, index) => ({
    id:
      method?.id ||
      `shipping-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    name: method?.name || "",
    isDefault: method?.isDefault === true || index === 0,
    active: method?.active !== false,
    extraFee: Number.isFinite(Number(method?.extraFee))
      ? Number(method.extraFee)
      : index === 0
        ? 0
        : 6,
  }));

  const defaultIndex = normalized.findIndex((method) => method.isDefault);

  return normalized.map((method, index) => ({
    ...method,
    isDefault: defaultIndex === -1 ? index === 0 : index === defaultIndex,
    extraFee:
      defaultIndex === -1 && index === 0
        ? 0
        : defaultIndex !== -1 && index === defaultIndex
          ? 0
          : Number(method.extraFee || 0),
  }));
}

function createShippingMethod() {
  return {
    id: `shipping-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    isDefault: false,
    active: true,
    extraFee: 6,
  };
}

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const [form, setForm] = useState(() => ({
    ...settings,
    shipping: {
      ...(settings?.shipping || {}),
      methods: normalizeShippingMethods(settings?.shipping?.methods),
    },
  }));

  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("general");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const save = async () => {
    const shippingMethods = normalizeShippingMethods(form.shipping?.methods);

    const normalizedForm = {
      ...form,
      shipping: {
        ...(form.shipping || {}),
        methods: shippingMethods,
      },
    };

    setForm(normalizedForm);

    await updateSettings(normalizedForm);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const restore = async () => {
    if (!window.confirm("هل أنت متأكد من استعادة جميع الإعدادات؟")) {
      return;
    }

    await resetSettings();

    setForm({
      ...DEFAULT_SETTINGS,
      shipping: {
        ...(DEFAULT_SETTINGS.shipping || {}),
        methods: normalizeShippingMethods(DEFAULT_SETTINGS.shipping?.methods),
      },
    });
  };

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateBanners = (banners) => {
    setForm((prev) => ({
      ...prev,
      banners,
    }));
  };

  const updateShippingMethods = (methods) => {
    setForm((prev) => ({
      ...prev,
      shipping: {
        ...(prev.shipping || {}),
        methods,
      },
    }));
  };

  const addShippingMethod = () => {
    updateShippingMethods([
      ...(form.shipping?.methods || []),
      createShippingMethod(),
    ]);
  };

  const updateShippingMethod = (id, field, value) => {
    const methods = (form.shipping?.methods || []).map((method) =>
      method.id === id
        ? {
            ...method,
            [field]: value,
          }
        : method,
    );

    updateShippingMethods(methods);
  };

  const setDefaultShippingMethod = (id) => {
    const methods = (form.shipping?.methods || []).map((method) => ({
      ...method,
      isDefault: method.id === id,
      extraFee: method.id === id ? 0 : Number(method.extraFee || 0),
    }));

    updateShippingMethods(methods);
  };

  const removeShippingMethod = (id) => {
    const methods = form.shipping?.methods || [];
    const methodToRemove = methods.find((method) => method.id === id);

    if (!methodToRemove) {
      return;
    }

    if (methodToRemove.isDefault) {
      window.alert(
        "لا يمكن حذف شركة الشحن الافتراضية. اختر شركة أخرى كافتراضية أولاً.",
      );
      return;
    }

    if (!window.confirm("هل أنت متأكد من حذف شركة الشحن هذه؟")) {
      return;
    }

    updateShippingMethods(methods.filter((method) => method.id !== id));
  };

  const toggleShippingMethod = (id) => {
    const methods = (form.shipping?.methods || []).map((method) =>
      method.id === id
        ? {
            ...method,
            active: method.active === false,
          }
        : method,
    );

    updateShippingMethods(methods);
  };

  const handleBannerUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setUploadError("");
    setUploadingBanner(true);

    try {
      const uploadedBanners = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const imageUrl = await uploadToCloudinary(file);

        uploadedBanners.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          image: imageUrl,
          link: "/products",
          active: true,
        });
      }

      if (uploadedBanners.length) {
        updateBanners([...(form.banners || []), ...uploadedBanners]);
      }
    } catch (error) {
      console.error("Banner upload error:", error);

      setUploadError(
        error?.message || "حدث خطأ أثناء رفع البنر. حاول مرة أخرى.",
      );
    } finally {
      setUploadingBanner(false);
      event.target.value = "";
    }
  };

  const removeBanner = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا البنر؟")) {
      return;
    }

    updateBanners((form.banners || []).filter((banner) => banner.id !== id));
  };

  const toggleBanner = (id) => {
    updateBanners(
      (form.banners || []).map((banner) =>
        banner.id === id
          ? {
              ...banner,
              active: banner.active === false,
            }
          : banner,
      ),
    );
  };

  const updateBannerField = (id, field, value) => {
    updateBanners(
      (form.banners || []).map((banner) =>
        banner.id === id
          ? {
              ...banner,
              [field]: value,
            }
          : banner,
      ),
    );
  };

  const moveBanner = (index, direction) => {
    const banners = [...(form.banners || [])];

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= banners.length) {
      return;
    }

    [banners[index], banners[newIndex]] = [banners[newIndex], banners[index]];

    updateBanners(banners);
  };

  const tabs = [
    {
      id: "general",
      label: "عام",
    },
    {
      id: "theme",
      label: "التصميم",
    },
    {
      id: "products",
      label: "المنتجات",
    },
    {
      id: "shipping",
      label: "الشحن",
    },
    {
      id: "notifications",
      label: "الإشعارات",
    },
    {
      id: "announcement",
      label: "الشريط الإعلاني",
    },
    {
      id: "banners",
      label: "البنرات",
    },
    {
      id: "advanced",
      label: "متقدمة",
    },
  ];

  const activeTab = tabs.find((item) => item.id === tab);
  const activeTabInfo = TAB_STYLES[tab] || TAB_STYLES.general;
  const ActiveIcon = activeTabInfo.icon;

  const shippingMethods = form.shipping?.methods || [];
  const defaultShippingMethod = shippingMethods.find(
    (method) => method.isDefault,
  );

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] pb-10">
        {/* Page Header */}
        <div className="mt-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#641F2B] via-[#711F31] to-[#4A1821] px-5 py-7 text-white shadow-[0_18px_50px_rgba(74,24,33,0.12)] md:px-8 md:py-9">
          <div className="relative">
            <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white/60">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    SAHRA ADMIN
                  </span>

                  <span>إدارة المتجر</span>
                </div>

                <h1 className="text-3xl font-black md:text-4xl">
                  إعدادات سهرة
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
                  تحكم في بيانات المتجر، المظهر، المنتجات، الشحن والإشعارات من
                  مكان واحد.
                </p>
              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-2xl md:flex">
                <FaSlidersH />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="h-fit rounded-[30px] border border-[#E8D9D6] bg-white p-3 shadow-[0_15px_45px_rgba(74,24,33,0.05)] lg:sticky lg:top-6">
            <div className="mb-3 px-3 py-3">
              <p className="text-xs font-bold text-[#806D70]">
                أقسام الإعدادات
              </p>

              <h2 className="mt-1 text-lg font-black text-[#4A1821]">
                إعدادات المتجر
              </h2>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {tabs.map((item) => {
                const Icon = TAB_STYLES[item.id].icon;
                const isActive = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`group flex min-w-[145px] flex-shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-right transition lg:min-w-0 ${
                      isActive
                        ? "bg-[#641F2B] text-white shadow-lg shadow-[#641F2B]/15"
                        : "text-[#4A1821] hover:bg-[#FBF6F1]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-[#F2E4E1] text-[#641F2B]"
                      }`}
                    >
                      <Icon />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-bold">{item.label}</span>

                      <span
                        className={`mt-0.5 hidden text-[10px] leading-4 sm:block ${
                          isActive ? "text-white/60" : "text-[#806D70]"
                        }`}
                      >
                        {TAB_STYLES[item.id].description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0 overflow-hidden rounded-[30px] border border-[#E8D9D6] bg-white shadow-[0_15px_45px_rgba(74,24,33,0.05)]">
            {/* Content Header */}
            <div className="border-b border-[#E8D9D6] bg-[#FBF6F1] px-5 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#641F2B] text-white">
                  <ActiveIcon />
                </div>

                <div>
                  <h2 className="text-xl font-black text-[#4A1821] md:text-2xl">
                    {activeTab?.label}
                  </h2>

                  <p className="mt-1 text-xs text-[#806D70]">
                    {activeTabInfo.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-7">
              {/* General */}
              {tab === "general" && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                        اسم المتجر
                      </label>

                      <input
                        type="text"
                        className="w-full rounded-2xl border border-[#E8D9D6] bg-white px-4 py-3.5 text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                        placeholder="سهرة"
                        value={form.storeName || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            storeName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                        رقم الواتساب
                      </label>

                      <input
                        type="text"
                        className="w-full rounded-2xl border border-[#E8D9D6] bg-white px-4 py-3.5 text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                        placeholder="رقم الواتساب"
                        value={form.whatsapp || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            whatsapp: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                      وصف المتجر
                    </label>

                    <textarea
                      rows={5}
                      className="w-full resize-y rounded-2xl border border-[#E8D9D6] bg-white px-4 py-3.5 leading-7 text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                      placeholder="اكتب وصفًا مختصرًا وواضحًا عن متجر سهرة"
                      value={form.storeDescription || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          storeDescription: e.target.value,
                        })
                      }
                    />
                  </div>

                  <SettingToggle
                    title="وضع الصيانة"
                    description="إيقاف واجهة المتجر مؤقتًا أثناء إجراء التحديثات."
                    checked={form.maintenanceMode || false}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        maintenanceMode: value,
                      })
                    }
                  />
                </div>
              )}

              {/* Theme */}
              {tab === "theme" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-[#4A1821]">
                          اللون الرئيسي
                        </p>

                        <p className="mt-1 text-xs leading-6 text-[#806D70]">
                          اللون المستخدم في العناصر الرئيسية التي يدعمها نظام
                          الإعدادات.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 rounded-2xl border-4 border-white shadow ring-1 ring-[#E8D9D6]"
                          style={{
                            backgroundColor:
                              form.theme?.primaryColor || "#641F2B",
                          }}
                        />

                        <input
                          type="color"
                          value={form.theme?.primaryColor || "#641F2B"}
                          onChange={(e) =>
                            updateNested(
                              "theme",
                              "primaryColor",
                              e.target.value,
                            )
                          }
                          className="h-12 w-16 cursor-pointer rounded-xl border border-[#E8D9D6] bg-white p-1"
                        />
                      </div>
                    </div>
                  </div>

                  <SettingToggle
                    title="الوضع الداكن"
                    description="تفعيل الوضع الداكن إذا كان مدعومًا في واجهة المتجر."
                    checked={form.theme?.darkMode || false}
                    onChange={(value) =>
                      updateNested("theme", "darkMode", value)
                    }
                  />
                </div>
              )}

              {/* Products */}
              {tab === "products" && (
                <div className="space-y-4">
                  <SettingToggle
                    title="إخفاء المنتجات المنتهية"
                    description="عدم إظهار المنتجات التي لا يتوفر منها مخزون للزوار."
                    checked={form.products?.hideOutOfStock || false}
                    onChange={(value) =>
                      updateNested("products", "hideOutOfStock", value)
                    }
                  />

                  <SettingToggle
                    title="عرض المفضلة"
                    description="السماح بإظهار واستخدام خاصية المنتجات المفضلة."
                    checked={form.products?.showFavorites || false}
                    onChange={(value) =>
                      updateNested("products", "showFavorites", value)
                    }
                  />
                </div>
              )}

              {/* Shipping */}
              {tab === "shipping" && (
                <div className="space-y-6">
                  {/* Main Shipping Settings */}
                  <div>
                    <div className="mb-4">
                      <span className="text-xs font-bold tracking-[0.15em] text-[#A83F55]">
                        إعدادات التكلفة
                      </span>

                      <h3 className="mt-1 text-xl font-black text-[#4A1821]">
                        رسوم الشحن
                      </h3>

                      <p className="mt-1 text-sm leading-7 text-[#806D70]">
                        السعر الأساسي الذي تستخدمه شركة الشحن الافتراضية، ويصبح
                        مجانيًا عند وصول السلة إلى حد الشحن المجاني.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <NumberField
                        label="رسوم الشحن الأساسية"
                        suffix="ر.س"
                        min="0"
                        value={form.shipping?.shippingFee ?? 0}
                        onChange={(value) =>
                          updateNested("shipping", "shippingFee", Number(value))
                        }
                      />

                      <NumberField
                        label="الشحن المجاني بعد"
                        suffix="ر.س"
                        min="0"
                        value={form.shipping?.freeShippingThreshold ?? 0}
                        onChange={(value) =>
                          updateNested(
                            "shipping",
                            "freeShippingThreshold",
                            Number(value),
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Shipping Companies */}
                  <div className="rounded-3xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                            <FaTruck />
                          </div>

                          <div>
                            <h3 className="font-black text-[#4A1821]">
                              شركات الشحن
                            </h3>

                            <p className="mt-1 text-xs text-[#806D70]">
                              اختر الشركة الافتراضية وأضف الشركات الأخرى.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addShippingMethod}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#641F2B]/15 transition hover:-translate-y-0.5 hover:bg-[#4A1821]"
                      >
                        <FaPlus />
                        إضافة شركة
                      </button>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#E8D9D6] bg-white p-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="mt-1 flex-shrink-0 text-[#A83F55]" />

                        <div>
                          <p className="font-bold text-[#4A1821]">
                            طريقة احتساب الشحن
                          </p>

                          <p className="mt-1 text-xs leading-6 text-[#806D70]">
                            الشركة الافتراضية تستخدم رسوم الشحن الأساسية. عند
                            الوصول إلى حد الشحن المجاني تصبح رسومها صفرًا.
                            الشركات الأخرى تضيف رسومها الإضافية فوق السعر
                            الأساسي، حتى لو أصبح الشحن الأساسي مجانيًا.
                          </p>
                        </div>
                      </div>
                    </div>

                    {shippingMethods.length === 0 ? (
                      <div className="mt-5 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8D9D6] bg-white px-5 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2E4E1] text-xl text-[#641F2B]">
                          <FaTruck />
                        </div>

                        <h4 className="mt-4 font-black text-[#4A1821]">
                          لا توجد شركات شحن
                        </h4>

                        <p className="mt-2 text-xs leading-6 text-[#806D70]">
                          أضف شركة الشحن التي تريد إتاحتها للعملاء.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {shippingMethods.map((method, index) => {
                          const isDefault = method.isDefault === true;

                          return (
                            <div
                              key={method.id}
                              className={`rounded-2xl border p-4 transition ${
                                isDefault
                                  ? "border-[#A83F55]/30 bg-[#FFF9F7] shadow-sm"
                                  : "border-[#E8D9D6] bg-white"
                              }`}
                            >
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <div
                                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                                        isDefault
                                          ? "bg-[#641F2B] text-white"
                                          : "bg-[#F2E4E1] text-[#641F2B]"
                                      }`}
                                    >
                                      <FaTruck />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-black text-[#4A1821]">
                                          {method.name ||
                                            `شركة الشحن ${index + 1}`}
                                        </span>

                                        {isDefault && (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F2E4E1] px-2.5 py-1 text-[10px] font-black text-[#641F2B]">
                                            <FaStar className="text-[9px]" />
                                            الافتراضية
                                          </span>
                                        )}

                                        {method.active === false && (
                                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-black text-[#806D70]">
                                            متوقفة
                                          </span>
                                        )}
                                      </div>

                                      <p className="mt-1 text-xs leading-6 text-[#806D70]">
                                        {isDefault
                                          ? "تستخدم رسوم الشحن الأساسية وتستفيد من الشحن المجاني."
                                          : `تضاف ${Number(method.extraFee || 0)} ر.س فوق رسوم الشحن الأساسية.`}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleShippingMethod(method.id)
                                      }
                                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition ${
                                        method.active === false
                                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                          : "bg-[#F2E4E1] text-[#641F2B] hover:bg-[#EAD5D1]"
                                      }`}
                                    >
                                      {method.active === false ? (
                                        <>
                                          <FaEye />
                                          تفعيل
                                        </>
                                      ) : (
                                        <>
                                          <FaEyeSlash />
                                          إيقاف
                                        </>
                                      )}
                                    </button>

                                    {!isDefault && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeShippingMethod(method.id)
                                        }
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                      >
                                        <FaTrash />
                                        حذف
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                                  <div>
                                    <label className="mb-2 block text-xs font-bold text-[#4A1821]">
                                      اسم شركة الشحن
                                    </label>

                                    <input
                                      type="text"
                                      value={method.name || ""}
                                      onChange={(e) =>
                                        updateShippingMethod(
                                          method.id,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="مثال: شركة الشحن"
                                      className="w-full rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-3 py-3 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10"
                                    />
                                  </div>

                                  <NumberField
                                    label="الرسوم الإضافية"
                                    suffix="ر.س"
                                    min="0"
                                    value={
                                      isDefault ? 0 : (method.extraFee ?? 6)
                                    }
                                    onChange={(value) =>
                                      updateShippingMethod(
                                        method.id,
                                        "extraFee",
                                        Number(value),
                                      )
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-3 border-t border-[#F0E6E3] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-xs font-bold text-[#4A1821]">
                                      الشركة الافتراضية
                                    </p>

                                    <p className="mt-1 text-[11px] leading-5 text-[#806D70]">
                                      هي الشركة التي يحصل العميل معها على الشحن
                                      المجاني عند بلوغ الحد المحدد.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDefaultShippingMethod(method.id)
                                    }
                                    disabled={isDefault}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                                      isDefault
                                        ? "cursor-default bg-[#641F2B] text-white"
                                        : "border border-[#E8D9D6] bg-white text-[#641F2B] hover:bg-[#F2E4E1]"
                                    }`}
                                  >
                                    <FaStar />
                                    {isDefault
                                      ? "الشركة الافتراضية"
                                      : "تعيين كافتراضية"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {defaultShippingMethod && (
                      <div className="mt-5 rounded-2xl border border-[#E8D9D6] bg-white px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FaCheckCircle />
                          </div>

                          <div>
                            <p className="text-sm font-black text-[#4A1821]">
                              الشركة الافتراضية الحالية
                            </p>

                            <p className="mt-1 text-xs leading-6 text-[#806D70]">
                              {defaultShippingMethod.name ||
                                "شركة الشحن الافتراضية"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="mt-1 text-[#A83F55]" />

                      <div>
                        <p className="font-bold text-[#4A1821]">
                          مثال على الحساب
                        </p>

                        <p className="mt-1 text-sm leading-7 text-[#806D70]">
                          إذا كان السعر الأساسي 15 ر.س، وشركة أخرى رسومها
                          الإضافية 6 ر.س، يصبح شحنها 21 ر.س. وإذا وصل الطلب إلى
                          حد الشحن المجاني، تصبح الشركة الافتراضية 0 ر.س بينما
                          الشركة الأخرى تبقى 6 ر.س.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {tab === "notifications" && (
                <div className="space-y-4">
                  <SettingToggle
                    title="صوت الطلبات"
                    description="تشغيل تنبيه صوتي عند وصول طلبات جديدة."
                    checked={form.notifications?.orderSound || false}
                    onChange={(value) =>
                      updateNested("notifications", "orderSound", value)
                    }
                  />

                  <SettingToggle
                    title="إشعارات المخزون"
                    description="تنبيه الإدارة عند انخفاض كمية المنتجات."
                    checked={form.notifications?.lowStockNotification || false}
                    onChange={(value) =>
                      updateNested(
                        "notifications",
                        "lowStockNotification",
                        value,
                      )
                    }
                  />
                </div>
              )}

              {/* Announcement */}
              {tab === "announcement" && (
                <div className="space-y-6">
                  <SettingToggle
                    title="تفعيل الشريط الإعلاني"
                    description="عرض الرسائل أعلى واجهة المتجر."
                    checked={form.announcementBar?.enabled ?? true}
                    onChange={(value) =>
                      updateNested("announcementBar", "enabled", value)
                    }
                  />

                  <NumberField
                    label="مدة تبديل الرسائل"
                    suffix="مللي ثانية"
                    min="1000"
                    value={form.announcementBar?.interval ?? 4500}
                    onChange={(value) =>
                      updateNested("announcementBar", "interval", Number(value))
                    }
                  />

                  <div className="rounded-3xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-[#4A1821]">
                          رسائل الشريط
                        </h3>

                        <p className="mt-1 text-xs text-[#806D70]">
                          أضف الرسائل التي تريد عرضها بالتتابع.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            announcementBar: {
                              ...(prev.announcementBar || {}),
                              messages: [
                                ...(prev.announcementBar?.messages || []),
                                "",
                              ],
                            },
                          }))
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                      >
                        <FaPlus />
                        إضافة رسالة
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {(form.announcementBar?.messages || []).map(
                        (msg, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 rounded-2xl border border-[#E8D9D6] bg-white p-3 sm:flex-row"
                          >
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-sm font-black text-[#641F2B]">
                              {index + 1}
                            </div>

                            <input
                              type="text"
                              className="min-w-0 flex-1 rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-3 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                              placeholder={`الرسالة ${index + 1}`}
                              value={msg}
                              onChange={(e) => {
                                const messages = [
                                  ...(form.announcementBar?.messages || []),
                                ];

                                messages[index] = e.target.value;

                                setForm((prev) => ({
                                  ...prev,
                                  announcementBar: {
                                    ...(prev.announcementBar || {}),
                                    messages,
                                  },
                                }));
                              }}
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const messages = [
                                  ...(form.announcementBar?.messages || []),
                                ];

                                messages.splice(index, 1);

                                setForm((prev) => ({
                                  ...prev,
                                  announcementBar: {
                                    ...(prev.announcementBar || {}),
                                    messages,
                                  },
                                }));
                              }}
                              className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                            >
                              <FaTrash />
                              حذف
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <ColorField
                      label="لون الخلفية"
                      value={form.announcementBar?.backgroundColor || "#641F2B"}
                      onChange={(value) =>
                        updateNested(
                          "announcementBar",
                          "backgroundColor",
                          value,
                        )
                      }
                    />

                    <ColorField
                      label="لون النص"
                      value={form.announcementBar?.textColor || "#FFFFFF"}
                      onChange={(value) =>
                        updateNested("announcementBar", "textColor", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* Banners */}
              {tab === "banners" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 md:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                            <FaImage />
                          </div>

                          <h3 className="font-black text-[#4A1821]">
                            بنرات الصفحة الرئيسية
                          </h3>
                        </div>

                        <p className="mt-2 max-w-2xl text-xs leading-6 text-[#806D70]">
                          ارفع صور البنرات التي تريد عرضها في الواجهة الرئيسية.
                          سيتم رفع الصور إلى Cloudinary وحفظ روابطها ضمن إعدادات
                          المتجر.
                        </p>
                      </div>

                      <label
                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
                          uploadingBanner
                            ? "cursor-not-allowed bg-[#A99B9D]"
                            : "bg-[#641F2B] shadow-[#641F2B]/15 hover:-translate-y-0.5 hover:bg-[#4A1821]"
                        }`}
                      >
                        {uploadingBanner ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            رفع بنرات
                          </>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingBanner}
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {uploadError && (
                      <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-700">
                        {uploadError}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-[#E8D9D6] bg-white p-5 md:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-[#4A1821]">
                          البنرات الحالية
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-[#806D70]">
                          ترتيب البنرات من الأعلى إلى الأسفل هو ترتيب ظهورها في
                          السلايدر.
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-[#F2E4E1] px-3 py-1.5 text-xs font-black text-[#641F2B]">
                        {(form.banners || []).length} بنر
                      </span>
                    </div>

                    {(form.banners || []).length === 0 ? (
                      <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#E8D9D6] bg-[#FBF6F1] px-5 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2E4E1] text-2xl text-[#641F2B]">
                          <FaImage />
                        </div>

                        <h4 className="mt-4 font-black text-[#4A1821]">
                          لا توجد بنرات حاليًا
                        </h4>

                        <p className="mt-2 max-w-md text-xs leading-6 text-[#806D70]">
                          ارفع أول بنر ليظهر في الصفحة الرئيسية للمتجر.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-5">
                        {(form.banners || []).map((banner, index) => (
                          <div
                            key={banner.id || `${banner.image}-${index}`}
                            className="overflow-hidden rounded-3xl border border-[#E8D9D6] bg-[#FBF6F1]"
                          >
                            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
                              <div className="relative min-h-[180px] overflow-hidden bg-[#F2E4E1] lg:min-h-[220px]">
                                <img
                                  src={banner.image}
                                  alt={`بنر سهرة ${index + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  className={`h-full min-h-[180px] w-full object-cover transition ${
                                    banner.active === false
                                      ? "opacity-45 grayscale"
                                      : ""
                                  }`}
                                />

                                <div className="absolute right-4 top-4 flex items-center gap-2">
                                  <span className="rounded-full bg-[#4A1821]/85 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                                    البنر {index + 1}
                                  </span>

                                  <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-black backdrop-blur ${
                                      banner.active === false
                                        ? "bg-white/90 text-[#806D70]"
                                        : "bg-emerald-600/90 text-white"
                                    }`}
                                  >
                                    {banner.active === false ? "متوقف" : "نشط"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col p-4 md:p-5">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-xs font-bold text-[#806D70]">
                                      ترتيب العرض
                                    </p>

                                    <p className="mt-1 text-lg font-black text-[#4A1821]">
                                      {index + 1}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => moveBanner(index, -1)}
                                      disabled={index === 0}
                                      aria-label="تحريك البنر للأعلى"
                                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                      <FaArrowUp />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => moveBanner(index, 1)}
                                      disabled={
                                        index ===
                                        (form.banners || []).length - 1
                                      }
                                      aria-label="تحريك البنر للأسفل"
                                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                      <FaArrowDown />
                                    </button>
                                  </div>
                                </div>

                                <div className="mt-5">
                                  <label className="mb-2 block text-xs font-bold text-[#4A1821]">
                                    رابط البنر
                                  </label>

                                  <input
                                    type="text"
                                    value={banner.link || ""}
                                    onChange={(e) =>
                                      updateBannerField(
                                        banner.id,
                                        "link",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="/products"
                                    className="w-full rounded-xl border border-[#E8D9D6] bg-white px-3 py-3 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99B9D] focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                                  />
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleBanner(banner.id)}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition ${
                                      banner.active === false
                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        : "bg-[#F2E4E1] text-[#641F2B] hover:bg-[#EAD5D1]"
                                    }`}
                                  >
                                    {banner.active === false ? (
                                      <>
                                        <FaEye />
                                        تفعيل
                                      </>
                                    ) : (
                                      <>
                                        <FaEyeSlash />
                                        إيقاف
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeBanner(banner.id)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                  >
                                    <FaTrash />
                                    حذف
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="mt-1 flex-shrink-0 text-[#A83F55]" />

                      <div>
                        <p className="font-bold text-[#4A1821]">ملاحظة</p>

                        <p className="mt-1 text-sm leading-7 text-[#806D70]">
                          بعد رفع البنرات اضغط على "حفظ الإعدادات" لتطبيق
                          التغييرات على المتجر. البنرات المتوقفة لن تظهر للزوار.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced */}
              {tab === "advanced" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                        <FaUndo />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-black text-rose-800">
                          استعادة الإعدادات الافتراضية
                        </h3>

                        <p className="mt-1 text-sm leading-7 text-rose-700/75">
                          سيؤدي هذا الإجراء إلى إعادة جميع الإعدادات إلى القيم
                          الافتراضية.
                        </p>

                        <button
                          type="button"
                          onClick={restore}
                          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white transition hover:bg-rose-700"
                        >
                          <FaUndo />
                          استعادة الإعدادات
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save */}
              <div className="mt-10 flex flex-col gap-4 border-t border-[#E8D9D6] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-[#806D70]">
                  <FaInfoCircle className="text-[#A83F55]" />

                  <span>احفظ التعديلات لتطبيقها على المتجر.</span>
                </div>

                <button
                  type="button"
                  onClick={save}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 font-bold text-white shadow-lg transition ${
                    saved
                      ? "bg-emerald-600 shadow-emerald-600/15"
                      : "bg-[#641F2B] shadow-[#641F2B]/15 hover:-translate-y-0.5 hover:bg-[#4A1821]"
                  }`}
                >
                  {saved ? <FaCheckCircle /> : <FaSave />}

                  {saved ? "تم حفظ الإعدادات" : "حفظ الإعدادات"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}

/* =========================
Reusable Components
========================= */

function SettingToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-black text-[#4A1821]">{title}</p>

        <p className="mt-1 max-w-2xl text-xs leading-6 text-[#806D70]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition ${
          checked ? "bg-[#641F2B]" : "bg-[#D7C8C5]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "right-1" : "right-6"
          }`}
        />
      </button>
    </div>
  );
}

function NumberField({ label, suffix, min, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#4A1821]">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={min}
          className="w-full rounded-2xl border border-[#E8D9D6] bg-white px-4 py-3.5 pl-20 text-[#4A1821] outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#806D70]">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
      <label className="mb-3 block text-sm font-bold text-[#4A1821]">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-2xl border-4 border-white shadow ring-1 ring-[#E8D9D6]"
          style={{ backgroundColor: value }}
        />

        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-xl border border-[#E8D9D6] bg-white p-1"
        />

        <span className="font-mono text-xs font-bold uppercase text-[#806D70]">
          {value}
        </span>
      </div>
    </div>
  );
}

export default Settings;
