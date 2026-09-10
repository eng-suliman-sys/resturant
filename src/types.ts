export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number;
}

export interface FlavorProfile {
  savory: number; // 0 - 100
  spicy: number; // 0 - 100
  sweet: number; // 0 - 100
  umami: number; // 0 - 100
  freshness: number; // 0 - 100
  richness: number; // 0 - 100
}

export interface Dish {
  id: string;
  name: string;
  category: 'Steaks & Grills' | 'Handmade Pasta' | 'Seafood' | 'Wood-Fired' | 'Desserts';
  tagline: string;
  description: string;
  price: number;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  spiceLevel: number; // 0 - 3
  prepTimeMinutes: number;
  nutrition: NutritionInfo;
  flavorProfile: FlavorProfile;
  ingredients: {
    name: string;
    origin: string;
    highlight?: boolean;
  }[];
  allergens: string[];
  modelType: 'steak' | 'pasta' | 'fish' | 'risotto' | 'cheesecake';
  plateColor: string;
  accentColor: string;
}

export interface RestaurantLocation {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  hours: {
    day: string;
    open: string;
    close: string;
    isToday?: boolean;
  }[];
  rating: number;
  reviewCount: number;
  features: string[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  specialInstructions?: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  promoCode: string;
  validUntilHour: number; // e.g. 19 for 7 PM
  highlight: string;
}
