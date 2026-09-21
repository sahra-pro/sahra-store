
export const DEFAULT_SETTINGS = {
  // بيانات المتجر
  storeName: "سهرة",
  storeDescription: "مكملات غذائية ومنتجات لتعزيز الحيوية والطاقة",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  currency: "ر.س",

  // التواصل
  socialLinks: {
    instagram: "",
    twitter: "",
    snapchat: "",
    tiktok: "",
    telegram: "",
  },

  // الصيانة
  maintenanceMode: false,
  maintenanceMessage: "المتجر تحت الصيانة وسيعود قريباً.",

  // الشريط الإعلاني
  announcementBar: {
    enabled: true,
    interval: 4500,
    backgroundColor: "#641F2B",
    textColor: "#ffffff",

    messages: [
      "🚚 الشحن مجاني للطلبات فوق 199 ريال",
      "💳 الدفع عند الاستلام متوفر",
      "✨ منتجات مختارة بعناية لجودة أفضل",
    ],
  },

  // إعدادات السلايدر الرئيسي
  heroSlider: {
    enabled: true,
    autoplay: true,
    autoplayDelay: 5000,
    showArrows: true,
    showDots: true,
    desktopHeight: 420,
    mobileHeight: 220,
    overlay: 0.35,
  },

  // المظهر
  theme: {
    primaryColor: "#641F2B",
    secondaryColor: "#A83F55",
    darkMode: false,
    borderRadius: 16,
    fontFamily: "Cairo",
    productCardStyle: "modern",
    enableAnimations: true,
  },

  // الصفحة الرئيسية
  home: {
    showHero: true,
    heroTitle: "مرحباً بكم في سهرة",
    heroSubtitle: "مكملات غذائية ومنتجات مختارة لتعزيز الحيوية والطاقة",
    heroImage: "",

    showCategories: true,
    showBestSellers: true,
    showLatestProducts: true,

    productsPerSection: 8,
  },

  // المنتجات
  products: {
    showReviews: true,
    showStock: true,
    showFavorites: true,
    showRelatedProducts: true,

    hideOutOfStock: false,
    lowStockAlert: 5,

    showDiscountBadge: true,
    showNewBadge: true,
    showBestSellerBadge: true,
  },

  // الطلبات
  orders: {
    minOrderAmount: 0,

    enableCOD: true,
    allowGuestCheckout: true,

    allowCancelOrder: true,
    cancelHours: 12,

    autoConfirmOrders: false,
  },

  // الشحن
  shipping: {
    enabled: true,

    shippingFee: 0,

    freeShippingThreshold: 200,

    methods: [
      {
        id: 1,
        name: "توصيل عادي",
        price: 0,
      },
    ],
  },

  // الكوبونات
  coupons: [],

  // الخصومات
  discounts: {
    flashSaleEnabled: true,
    flashSaleTitle: "",
    flashSaleEndsAt: "",

    freeGiftThreshold: 0,
  },

  // البانرات
  banners: [],

  // النوافذ المنبثقة
  popups: {
    enabled: true,

    welcomePopup: {
      enabled: false,
      title: "",
      description: "",
      image: "",
      buttonText: "",
      buttonLink: "",
    },

    couponPopup: {
      enabled: false,
      title: "",
      couponCode: "",
    },

    exitPopup: {
      enabled: false,
      title: "",
      description: "",
    },
  },

  // SEO
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  },

  // الإشعارات
  notifications: {
    orderSound: true,
    browserNotifications: false,
    whatsappNotifications: true,
    lowStockNotification: true,
  },

  // الصفحات
  pages: {
    about: "",
    privacyPolicy: "",
    shippingPolicy: "",
    returnPolicy: "",
  },
};

