export type PlanFrequency = "daily" | "weekly" | "monthly"
export type PlanCategory = "fruits" | "vegetables" | "combo"

export type SubscriptionPlan = {
  id: string
  category: PlanCategory
  frequency: PlanFrequency
  name: string
  tagline: string
  price: number
  originalPrice: number
  pricePerDay: number
  itemsPerDelivery: string
  deliveriesLabel: string
  contents: string[]
  highlights: string[]
  popular?: boolean
  bestValue?: boolean
  image: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  // ===== FRUITS =====
  {
    id: "fruits-daily",
    category: "fruits",
    frequency: "daily",
    name: "Daily Fresh Fruits",
    tagline: "A handpicked fruit basket every morning",
    price: 99,
    originalPrice: 120,
    pricePerDay: 99,
    itemsPerDelivery: "3-4 seasonal fruits",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "Banana - Robusta (4-5 pcs)",
      "Apple Royal Gala (1 pc)",
      "1 seasonal fruit (mango, pomegranate, kiwi etc.)",
      "Free delivery every day",
    ],
    highlights: ["Cancel anytime", "Pause for vacation", "Free swaps"],
    image: "/colorful-assortment-fresh-fruits-banner.jpg",
  },
  {
    id: "fruits-weekly",
    category: "fruits",
    frequency: "weekly",
    name: "Weekly Fruit Pack",
    tagline: "7 days of premium fruits, delivered fresh",
    price: 599,
    originalPrice: 840,
    pricePerDay: 86,
    itemsPerDelivery: "5-6 fruit varieties / week",
    deliveriesLabel: "Once a week · 7 AM",
    contents: [
      "Bananas, apples and oranges weekly",
      "Seasonal premium fruits (kiwi, pomegranate)",
      "1 imported fruit (dragon fruit / blueberry)",
      "Free delivery on every order",
    ],
    highlights: ["Save 28%", "Curated by experts", "Cancel anytime"],
    popular: true,
    image: "/colorful-assortment-fresh-fruits-banner.jpg",
  },
  {
    id: "fruits-monthly",
    category: "fruits",
    frequency: "monthly",
    name: "Monthly Fruit Bonanza",
    tagline: "30 days of fresh fruits at the best price",
    price: 2199,
    originalPrice: 3600,
    pricePerDay: 73,
    itemsPerDelivery: "30 daily fruit deliveries",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "All seasonal Indian fruits",
      "2 premium imported fruits / week",
      "Priority customer support",
      "Free delivery + free swap window",
    ],
    highlights: ["Save 39%", "Best for families", "Free customizations"],
    image: "/colorful-assortment-fresh-fruits-banner.jpg",
  },

  // ===== VEGETABLES =====
  {
    id: "vegetables-daily",
    category: "vegetables",
    frequency: "daily",
    name: "Daily Veggie Box",
    tagline: "Fresh from the farm to your kitchen",
    price: 89,
    originalPrice: 110,
    pricePerDay: 89,
    itemsPerDelivery: "4-5 daily veggies",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "Tomato, onion, potato every day",
      "Daily seasonal greens (palak, methi)",
      "1 staple veggie (carrot / cucumber / beans)",
      "Free delivery every day",
    ],
    highlights: ["Cancel anytime", "Skip a day", "Locally sourced"],
    image: "/fresh-vegetables-assortment-banner.jpg",
  },
  {
    id: "vegetables-weekly",
    category: "vegetables",
    frequency: "weekly",
    name: "Weekly Veggie Pack",
    tagline: "A full week of mixed vegetables",
    price: 549,
    originalPrice: 770,
    pricePerDay: 78,
    itemsPerDelivery: "8-10 vegetable varieties / week",
    deliveriesLabel: "Once a week · 7 AM",
    contents: [
      "All daily-use vegetables",
      "Weekly leafy greens bundle",
      "Capsicum, broccoli or cauliflower",
      "Ginger + garlic + lemon refill",
    ],
    highlights: ["Save 28%", "Family size", "Cancel anytime"],
    image: "/fresh-vegetables-assortment-banner.jpg",
  },
  {
    id: "vegetables-monthly",
    category: "vegetables",
    frequency: "monthly",
    name: "Monthly Veggie Saver",
    tagline: "Stock your kitchen all month for less",
    price: 1999,
    originalPrice: 3300,
    pricePerDay: 66,
    itemsPerDelivery: "30 daily veggie deliveries",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "All daily and seasonal vegetables",
      "Premium leafy greens 4x / week",
      "Mushrooms once a week",
      "Priority delivery + free swaps",
    ],
    highlights: ["Save 39%", "Best for families", "Free swaps"],
    image: "/fresh-vegetables-assortment-banner.jpg",
  },

  // ===== COMBO (Fruits + Vegetables) =====
  {
    id: "combo-daily",
    category: "combo",
    frequency: "daily",
    name: "Daily Combo Pack",
    tagline: "Fruits + Vegetables, delivered every morning",
    price: 169,
    originalPrice: 230,
    pricePerDay: 169,
    itemsPerDelivery: "3 fruits + 4 vegetables daily",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "Daily Fresh Fruits box",
      "Daily Veggie box",
      "1 free seasonal surprise per week",
      "Free delivery every day",
    ],
    highlights: ["Most balanced plan", "Cancel anytime", "Free swaps"],
    image: "/colorful-assortment-fresh-fruits-banner.jpg",
  },
  {
    id: "combo-weekly",
    category: "combo",
    frequency: "weekly",
    name: "Weekly Combo Pack",
    tagline: "A week of fruits and vegetables together",
    price: 999,
    originalPrice: 1500,
    pricePerDay: 142,
    itemsPerDelivery: "Weekly fruit + veggie pack",
    deliveriesLabel: "Once a week · 7 AM",
    contents: [
      "Full Weekly Fruit Pack",
      "Full Weekly Veggie Pack",
      "Free recipe ideas every week",
      "Priority customer support",
    ],
    highlights: ["Save 33%", "Curated by chefs", "Cancel anytime"],
    popular: true,
    image: "/fresh-vegetables-assortment-banner.jpg",
  },
  {
    id: "combo-monthly",
    category: "combo",
    frequency: "monthly",
    name: "Monthly Family Combo",
    tagline: "30 days of fruits + veggies for the whole family",
    price: 3499,
    originalPrice: 6000,
    pricePerDay: 116,
    itemsPerDelivery: "30 daily combo deliveries",
    deliveriesLabel: "Daily · 7 AM",
    contents: [
      "Monthly Fruit Bonanza",
      "Monthly Veggie Saver",
      "2 imported fruits per week",
      "Free swaps + priority delivery",
    ],
    highlights: ["Save 41%", "Best value overall", "Free customizations"],
    bestValue: true,
    image: "/colorful-assortment-fresh-fruits-banner.jpg",
  },
]

export function getPlanById(id: string) {
  return subscriptionPlans.find((p) => p.id === id)
}

export function getPlansByCategory(category: PlanCategory) {
  return subscriptionPlans.filter((p) => p.category === category)
}
