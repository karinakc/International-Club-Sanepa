import blackGold from "./assets/black-gold.webp";
import absoluteAesthetics from "./assets/absolute-aesthetics.webp";
import choco from "./assets/choco.webp";
import filli from "./assets/filli.webp";
import handicraft from "./assets/handicraft.webp";
import hero from "./assets/hero.jpg";
import hokkaido from "./assets/hokkaido.webp";
import innerSight from "./assets/innersight.webp";
import kayaLab from "./assets/kaya-lab.jpg";
import khukuri from "./assets/khukuri.webp";
import leSalon from "./assets/lesalon.jpg";
import logo from "./assets/logo.png";
import luggageHunt from "./assets/luggagehunt.jpg";
import neNepal from "./assets/ne-nepal.jpg";
import pizza from "./assets/pizza.jpg";
import silk from "./assets/silk.webp";
import sweetFix from "./assets/sweet-fix.webp";
import swimmingPool from "./assets/swimmingpool.jpg";
import view from "./assets/view.png";

export type Category =
  | "Dining & Cafes"
  | "Desserts"
  | "Wellness & Beauty"
  | "Retail"
  | "Health Club";

export type Business = {
  id: string;
  name: string;
  categories: Category[];
  description: string;
  detail: string;
  image?: string;
  alt?: string;
  focal?: string;
  featured?: boolean;
};

export const assets = {
  absoluteAesthetics,
  blackGold,
  choco,
  filli,
  handicraft,
  hero,
  hokkaido,
  innerSight,
  kayaLab,
  khukuri,
  leSalon,
  logo,
  luggageHunt,
  neNepal,
  pizza,
  silk,
  sweetFix,
  swimmingPool,
  view,
};

export const filters: Array<"All" | Category> = [
  "All",
  "Dining & Cafes",
  "Desserts",
  "Wellness & Beauty",
  "Retail",
  "Health Club",
];

export const businesses: Business[] = [
  {
    id: "hokkaido-house",
    name: "Hokkaido House",
    categories: ["Dining & Cafes"],
    description: "Japanese cuisine and cocktails inside International Club.",
    detail:
      "A dining outlet listed at International Club. The supplied brief identifies it as Japanese cuisine and cocktails; individual contact details were not supplied.",
    image: hokkaido,
    alt: "Hokkaido House dining room with a circular bar and warm brass lighting",
    focal: "50% 50%",
    featured: true,
  },
  {
    id: "black-gold",
    name: "The Black Gold",
    categories: ["Dining & Cafes"],
    description: "Mediterranean dining in a polished interior setting.",
    detail:
      "Mediterranean dining within the club, shown through the supplied dining-room photography with warm lighting and forest-green interior details.",
    image: blackGold,
    alt: "Interior of The Black Gold with brass lighting and dining tables",
    focal: "42% 58%",
    featured: true,
  },
  {
    id: "fire-and-ice",
    name: "Fire and Ice Pizzeria",
    categories: ["Dining & Cafes"],
    description: "Pizza, identified by the hanging courtyard sign.",
    detail:
      "The supplied signage reads Fire and Ice Pizzeria. Further menu, hours, and booking details were not supplied.",
    image: pizza,
    alt: "Hanging sign for Fire and Ice Pizzeria",
    focal: "48% 50%",
  },
  {
    id: "khukri-experience",
    name: "The Khukri Experience",
    categories: ["Dining & Cafes"],
    description: "Dining outlet represented by a supplied interior detail.",
    detail:
      "A dining destination inside International Club. The source material supports the name and visual atmosphere, without menu or reservation details.",
    image: khukuri,
    alt: "Interior detail with a khukri-shaped bottle on display",
    focal: "68% 48%",
  },
  {
    id: "luggage-hunt",
    name: "The Luggage Hunt",
    categories: ["Dining & Cafes", "Retail"],
    description: "Cafe and travel-minded storefront along the courtyard.",
    detail:
      "The supplied photograph shows The Luggage Hunt signage and luggage displays near the club courtyard. The brief identifies it as a cafe.",
    image: luggageHunt,
    alt: "The Luggage Hunt storefront with luggage displays and courtyard arches",
    focal: "64% 42%",
    featured: true,
  },
  {
    id: "filli",
    name: "Filli",
    categories: ["Dining & Cafes"],
    description: "Cafe outlet shown through supplied staff and corridor photography.",
    detail:
      "The supplied image shows Filli branding on staff attire at International Club. Menu, hours, and individual contact details were not supplied.",
    image: filli,
    alt: "Filli staff member beside a bright corridor at International Club",
    focal: "52% 48%",
  },
  {
    id: "coco-affaire",
    name: "Coco Affaire",
    categories: ["Desserts"],
    description: "Chocolate and sweet treats.",
    detail:
      "Listed in the supplied brief as a chocolate and sweet-treats outlet. The supplied photograph now provides a dedicated visual reference; individual contact details were not supplied.",
    image: choco,
    alt: "Coco Affaire chocolate and confectionery display",
    focal: "55% 48%",
  },
  {
    id: "sweet-fix",
    name: "Sweet Fix",
    categories: ["Desserts"],
    description: "Sweet treats in a compact dessert counter.",
    detail:
      "The supplied photograph shows the Sweet Fix counter and signage. Specific menu items, prices, and hours were not supplied.",
    image: sweetFix,
    alt: "Sweet Fix dessert counter with pink wall signage",
    focal: "46% 38%",
  },
  {
    id: "silk",
    name: "Silk",
    categories: ["Desserts"],
    description: "Handcrafted ice cream.",
    detail:
      "Listed in the supplied brief as handcrafted ice cream. The supplied photograph shows the outlet display and ice-cream packaging; individual contact details were not supplied.",
    image: silk,
    alt: "Silk ice cream display with stacked cups and menu detail",
    focal: "58% 46%",
  },
  {
    id: "inner-sight",
    name: "Inner Sight",
    categories: ["Wellness & Beauty"],
    description: "Remedial, sports, and deep tissue massage therapy.",
    detail:
      "A wellness outlet identified in the supplied brief. Copy is kept factual because treatment details, claims, and contact information were not supplied.",
    image: innerSight,
    alt: "Inner Sight waiting area with sofa, framed artwork, and plants",
    focal: "56% 48%",
  },
  {
    id: "absolute-aesthetics",
    name: "Absolute Aesthetics",
    categories: ["Wellness & Beauty"],
    description: "Aesthetic clinic listed within International Club.",
    detail:
      "An aesthetic clinic named in the supplied brief. Services, clinicians, treatment outcomes, and booking details were not supplied.",
    image: absoluteAesthetics,
    alt: "Absolute Aesthetics treatment room with equipment and treatment chair",
    focal: "52% 52%",
  },
  {
    id: "le-salon",
    name: "Le Salon",
    categories: ["Wellness & Beauty"],
    description: "Salon outlet shown at reception.",
    detail:
      "The supplied photography shows Le Salon reception and branding. Service menu, hours, and contact details were not supplied.",
    image: leSalon,
    alt: "Le Salon reception area with wall signage",
    focal: "58% 54%",
    featured: true,
  },
  {
    id: "kaya-lab",
    name: "Kaya Lab",
    categories: ["Wellness & Beauty", "Retail"],
    description: "Skincare and personal-care retail.",
    detail:
      "The supplied photograph shows The Kaya Lab signage, counter, and product shelving. It is listed under both wellness and retail discovery.",
    image: kayaLab,
    alt: "The Kaya Lab counter with skincare products on shelves",
    focal: "46% 42%",
  },
  {
    id: "health-club-swimming",
    name: "Health Club & Swimming",
    categories: ["Health Club"],
    description: "Swimming pool and health-club destination within the property.",
    detail:
      "The supplied pool photograph confirms a swimming facility at International Club. Dimensions, admission policy, equipment, trainers, and pricing were not supplied.",
    image: swimmingPool,
    alt: "Swimming pool courtyard at International Club",
    focal: "52% 58%",
    featured: true,
  },
  {
    id: "ne-nepal",
    name: "Ne Nepal",
    categories: ["Retail"],
    description: "Retail outlet shown through supplied interior photography.",
    detail:
      "A retail outlet represented by the supplied interior image. Product range and contact details were not supplied beyond the visual reference.",
    image: neNepal,
    alt: "Retail interior with arched doorway and illuminated shelving",
    focal: "40% 50%",
  },
  {
    id: "handicraft",
    name: "Handicraft Outlet",
    categories: ["Retail"],
    description: "Handicraft and decorative retail space.",
    detail:
      "The supplied image shows a compact retail space with display shelves and craft objects. A more specific verified business name was not supplied.",
    image: handicraft,
    alt: "Handicraft retail interior with display shelves and floral wall",
    focal: "50% 54%",
  },
];

export const gallery = [
  {
    src: hero,
    alt: "Evening courtyard at International Club",
    caption: "Evening courtyard and white facades",
    focal: "50% 50%",
  },
  {
    src: luggageHunt,
    alt: "The Luggage Hunt storefront at International Club",
    caption: "Storefronts and brass hanging signs",
    focal: "64% 42%",
  },
  {
    src: blackGold,
    alt: "Dining interior at The Black Gold",
    caption: "Warm dining rooms",
    focal: "42% 58%",
  },
  {
    src: swimmingPool,
    alt: "Swimming pool inside the club",
    caption: "Health club and swimming",
    focal: "52% 58%",
  },
  {
    src: leSalon,
    alt: "Le Salon reception",
    caption: "Wellness and personal care",
    focal: "58% 54%",
  },
  {
    src: kayaLab,
    alt: "Kaya Lab retail counter",
    caption: "Skincare and retail",
    focal: "46% 42%",
  },
];
