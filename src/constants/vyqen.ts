export const V = {
  bg: '#0d0805',
  card: '#1a110b',
  cardBorder: '#2e1e12',
  orange: '#ff5a1f',
  amber: '#f5a623',
  text: '#fdf3e7',
  muted: '#a8927c',
  dim: '#6f5c4a',
} as const;

export type Product = {
  id: string;
  badge: string;
  category: string;
  maker: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  tint: [string, string];
  filter: 'BEST SELLERS' | '3D STANDS' | 'TABLE LAMPS' | 'PENDANTS';
};

export const FILTERS = ['ALL', 'BEST SELLERS', '3D STANDS', 'TABLE LAMPS', 'PENDANTS'] as const;

export const PRODUCTS: Product[] = [
  { id: '1', badge: 'BEST SELLER', category: 'TABLE LAMP', maker: 'ELENA BRISTOVA', name: 'Solis Amber Luminaire', desc: 'Mouth-blown fluted amber glass with hand-finished spun brass base.', price: 40800, oldPrice: 48000, rating: 4.8, reviews: 84, tint: ['#3a3a3f', '#8a8a92'], filter: 'TABLE LAMPS' },
  { id: '2', badge: 'ARTISAN CURATED', category: 'PENDANT LIGHT', maker: 'MATTIAS LINDQVIST', name: 'Aurora Chandelier Orb', desc: 'Sculptural fared pendant floating like a glowing sunset eclipse.', price: 81600, oldPrice: 96000, rating: 5.0, reviews: 62, tint: ['#0f5a5f', '#1d8c93'], filter: 'PENDANTS' },
  { id: '3', badge: 'NEW', category: 'FLOOR LAMP', maker: 'KARLEN THORNE', name: 'Arcadia Minimal Floor Arc', desc: 'Graceful cantilevered arm with countersweighted cast terracotta base.', price: 62400, rating: 4.8, reviews: 41, tint: ['#6b3d1d', '#c47a38'], filter: 'BEST SELLERS' },
  { id: '4', badge: 'BEST SELLER', category: 'WALL SCONCE', maker: 'ATELIER VYQEN', name: 'Vesper Sunset Sconce', desc: 'Radial disc wall sculpture that reflects warm indirect lighting.', price: 28800, oldPrice: 32000, rating: 4.9, reviews: 77, tint: ['#5a4a3a', '#d6c4ac'], filter: 'BEST SELLERS' },
  { id: '5', badge: 'LIMITED EDITION', category: 'AMBIENT ART', maker: 'NOOR AL-MANSOORI', name: 'Terra Cordless Portable', desc: 'Rechargeable tactile terracotta lamp for indoor tables and evening terraces.', price: 23400, rating: 4.9, reviews: 118, tint: ['#8a5a22', '#e8a84a'], filter: 'TABLE LAMPS' },
  { id: '6', badge: 'ARTISAN CURATED', category: 'PENDANT LIGHT', maker: 'SEBASTIAN CRUZ', name: 'Helios Architectural Pendant', desc: 'A sweeping horizontal rod of warm light enveloped in copper glass globes.', price: 106800, oldPrice: 120000, rating: 4.7, reviews: 9, tint: ['#3a3a3f', '#8a8a92'], filter: 'PENDANTS' },
  { id: '7', badge: 'NEW', category: 'TABLE LAMP', maker: 'MIA KANG', name: 'Nimbus Smoked Mushroom', desc: 'Sensual organic silhouette carries a downward dome of warm amber warmth.', price: 34200, rating: 4.8, reviews: 21, tint: ['#2a2a2e', '#6a6a72'], filter: 'TABLE LAMPS' },
  { id: '8', badge: 'LIMITED EDITION', category: 'AMBIENT ART', maker: 'BENEDI TAKAHASHI', name: 'Dune Monolith Ambient', desc: 'Sculpted stoneware lamp that doubles as a minimalist gallery artefact.', price: 49200, oldPrice: 56000, rating: 4.9, reviews: 33, tint: ['#0f5a5f', '#1d8c93'], filter: 'BEST SELLERS' },
];

export const STANDS = [
  { id: 's1', badge: 'BEST SELLER', name: 'Acrobat PS-Symbols 3D…', desc: 'Sculpted PlayStation cradle with symbols dock.', price: 4200, rating: 5.0, reviews: 52, tint: ['#2b2457', '#6a4fd8'] as [string, string] },
  { id: 's2', badge: 'ARTISAN CURATED', name: 'Sentinel Dual Controller &…', desc: 'Twin-tier DualSense cradle with curved headphone boom.', price: 6600, rating: 5.0, reviews: 31, tint: ['#5a1020', '#c8283f'] as [string, string] },
  { id: 's3', badge: 'NEW', name: 'Nexus Minimalist Floating…', desc: 'Clean architectural curve engineered for universal gamepad fit.', price: 3360, rating: 4.8, reviews: 28, tint: ['#555a60', '#c9ced4'] as [string, string] },
  { id: 's4', badge: 'LIMITED EDITION', name: 'Valkyrie Desk Commander…', desc: 'Compact side-by-side dock with discrete charging wire guides.', price: 5520, rating: 4.9, reviews: 17, tint: ['#2a2a2e', '#6a6a72'] as [string, string] },
];

export const LAMP_TYPES = [
  { name: 'Ember', price: 18400, color: '#ff7a2f' },
  { name: 'Halo', price: 9800, color: '#e8dcc8' },
  { name: 'Arc', price: 21600, color: '#f5a623' },
  { name: 'Pebble', price: 12000, color: '#7ddc7a' },
  { name: 'Tulip', price: 15200, color: '#ffd24a' },
  { name: 'Spire', price: 11200, color: '#ff9a5a' },
  { name: 'Sway', price: 14400, color: '#5ac8ff' },
];

export const ROOMS = [
  { key: 'LIVING SALON', title: 'The Grand Living Salon', desc: 'Cast low-profile, indirect warm amber light across custom upholstery and textured walls without ceiling glare.', rec: 'Arcadia Minimal Floor Arc & Solis Table Lamp', tint: ['#6b4a2a', '#d9b98a'] as [string, string] },
  { key: 'DINING ATRIUM', title: 'The Dining Atrium', desc: 'Layer pendant glow above the table so every plate and face is lit in candle-warm 2200K light.', rec: 'Helios Architectural Pendant', tint: ['#5a3a22', '#c48a52'] as [string, string] },
  { key: 'BEDSIDE SANCTUARY', title: 'The Bedside Sanctuary', desc: 'Low, dimmable pools of amber that ease the room toward sleep.', rec: 'Nimbus Smoked Mushroom', tint: ['#3a2a30', '#9a6a72'] as [string, string] },
  { key: 'PRIVATE LOUNGE', title: 'The Private Lounge', desc: 'Sculptural sconces and ambient art that glow like a quiet gallery.', rec: 'Vesper Sunset Sconce', tint: ['#2a2a2e', '#7a6a5a'] as [string, string] },
];

export const MATERIALS = [
  { icon: 'glass-wine', title: 'Italian Mouth-Blown Glass', desc: 'Free-blown by master artisans. Subtle organic ripples and micro air bubbles refract incoming light like candlelight.' },
  { icon: 'hammer-wrench', title: 'Solid Spun & Brushed Brass', desc: 'Machined from solid brass billets with protective micro-lacquer that ensures warmth without weighting oxidation.' },
  { icon: 'lightbulb-on-outline', title: 'Flicker-Free Warm LEDs', desc: 'Proprietary custom phosphor arrays tuned to 2200K–2700K sunset tones with zero perceptible strobe effect.' },
] as const;

export const formatPrice = (n: number) => '৳' + n.toLocaleString('en-US');

export type Detail = {
  id: string;
  badge: string;
  category: string;
  maker: string;
  name: string;
  desc: string;
  long: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  gallery: [string, string][];
  specs: { output: string; power: string; craft: string };
};

const ALT_TINTS: [string, string][] = [
  ['#0f5a5f', '#1d8c93'],
  ['#6b3d1d', '#c47a38'],
];

export function getProduct(id: string): Detail | undefined {
  const p = PRODUCTS.find((x) => x.id === id);
  if (p) {
    return {
      ...p,
      long: `The ${p.name} is an homage to twilight. ${p.desc} Sculpted from mouth-blown optic glass and solid brass, it diffuses a warm golden glow across any bedside, credenza, or reading nook. Features our precision capacitive brass touch-dimmer.`,
      gallery: [p.tint, ...ALT_TINTS],
      specs: { output: '650 lm', power: '6W Integrated Warm LED', craft: 'Mouth-blown Amber Glass, Aged Brushed Brass' },
    };
  }
  const s = STANDS.find((x) => x.id === id);
  if (s) {
    return {
      id: s.id,
      badge: s.badge,
      category: '3D PRINTED STAND',
      maker: 'VYQEN 3D LAB',
      name: s.name.replace('…', ''),
      desc: s.desc,
      long: `${s.desc} Printed in ultra-fine 0.16mm layers with weighted anti-slip base and tailored cradles protecting analog sticks and headphone pads.`,
      price: s.price,
      rating: s.rating,
      reviews: s.reviews,
      gallery: [s.tint, ...ALT_TINTS],
      specs: { output: 'n/a', power: 'Passive (no power)', craft: 'Matte PLA+, 0.16mm layers, silicone grip base' },
    };
  }
  return undefined;
}
