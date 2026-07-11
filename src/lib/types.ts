export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type ProductVariant = {
  id: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  isPublished: boolean;
  imageUrl: string | null;
  galleryImages: string[];
  productType: string | null;
  tags: string[];
  videoUrl: string | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  shippingNote: string | null;
  category: { id: number; name: string; slug: string };
  variants: ProductVariant[];
};

export type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variant: { id: number; sku: string; size: string; color: string; stock: number };
  product: { id: number; name: string; slug: string };
};

export type Cart = {
  id: number;
  items: CartItem[];
  total: number;
};

export type Address = {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  complement: string | null;
};

export type CurrentUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

export type ShippingZone = {
  id: number;
  country: string;
  price: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  active: boolean;
};

export type HomepageSettings = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonLabel: string;
  heroButtonLink: string;
  promoBannerText: string;
  promoBannerEnabled: boolean;
};
