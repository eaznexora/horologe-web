export interface Article {
  slug: string;
  category: "WATCH GUIDES" | "CRAFTSMANSHIP" | "BRAND JOURNAL" | "COLLECTORS";
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  pullQuote: string;
  content: string[];
  featured?: boolean;
}

export type CategoryFilter =
  | "ALL STORIES"
  | "WATCH GUIDES"
  | "CRAFTSMANSHIP"
  | "BRAND JOURNAL"
  | "COLLECTORS";

export const CATEGORIES: CategoryFilter[] = [
  "ALL STORIES",
  "WATCH GUIDES",
  "CRAFTSMANSHIP",
  "BRAND JOURNAL",
  "COLLECTORS",
];

export const INSIGHTS_ARTICLES: Article[] = [
  {
    slug: "a-guide-to-the-world-of-mechanical-watches",
    category: "CRAFTSMANSHIP",
    date: "NOV 08, 2025",
    readTime: "6 MIN READ",
    title: "A GUIDE TO THE WORLD OF MECHANICAL WATCHES",
    excerpt:
      "From intricate movements to timeless design, discover what makes mechanical watches truly extraordinary.",
    image:
      "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=1200&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "In a world characterized by disposable electronics, a masterfully engineered mechanical calibre remains an immortal mechanical pulse passed across generations.",
    featured: true,
    content: [
      "A mechanical watch is far more than an instrument for measuring seconds; it is a miniature kinetic symphony. Operating without quartz crystals, printed circuit boards, or lithium cells, mechanical calibres rely solely on stored mechanical potential—transferred from a coiled mainspring through a train of microscopic gears to the beating balance wheel.",
      "The beating escapement oscillates at frequencies upwards of 28,800 vibrations per hour, releasing stored power in microscopic increments that translate into the fluid, hypnotic sweep of the second hand. Each wheel and pinion is chamfered, polished, and seated in synthetic sapphire bearings that reduce friction to near-zero tolerances, converting raw torque into poetic chronometric cadence.",
      "Manual-wind calibres demand deliberate daily communion between owner and timepiece, turning the simple winding of the crown into an intimate tactile ritual. Automatic calibres, by contrast, harness the natural kinetic energy of the wearer's wrist via a weighted oscillating rotor—often carved from 21k or 22k gold—to continually replenish the barrel's power reserve throughout the day.",
      "Beyond raw chronometric precision, the enduring allure of mechanical watchmaking lies in its sheer permanence. In a culture characterized by planned obsolescence, a masterfully engineered mechanical timepiece can survive four, five, or six generations, retaining its mechanical vitality indefinitely when entrusted to master watchmaking hands.",
      "To fasten a mechanical timepiece to one's wrist is to wear several centuries of human physics, metallurgical discovery, and artisanal devotion. It serves as an unyielding anchor in a fleeting digital world.",
    ],
  },
  {
    slug: "inside-the-heart-of-a-timepiece",
    category: "WATCH GUIDES",
    date: "OCT 28, 2025",
    readTime: "4 MIN READ",
    title: "Inside the Heart of a Timepiece",
    excerpt:
      "An in-depth exploration into the intricate escapements, hairsprings, and balance wheels that breathe kinetic life into fine horology.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "A hairspring is thinner than a human hair yet resilient enough to breathe five hundred thousand times each day without fatiguing.",
    content: [
      "At the true centre of every mechanical watch beats the balance assembly. Composed of a thermally compensated balance wheel and a microscopic hairspring coiled with microscopic precision, this organ governs the entire timekeeping accuracy of the movement.",
      "Every fraction of a millimeter in hairspring curvature dictates whether a watch gains or loses seconds across diurnal cycles. Master horologists spend decades perfecting the art of dynamic poise, adjusting tiny micro-screws or inertia blocks along the wheel perimeter to achieve chronometric equilibrium across multiple resting positions.",
      "Observing an openworked movement through an exhibition sapphire caseback reveals the delicate interplay between the Swiss lever escapement and synthetic ruby pallet jewels. With each oscillation, the escape wheel teeth strike the jeweled surfaces, producing the unmistakable ticking that marks passing time.",
      "Modern metallurgical advancements, including proprietary paramagnetic alloys and etched silicon balance springs, have fortified these microscopic beating hearts against electromagnetic fields and ambient temperature fluctuations, elevating daily stability to unprecedented horological heights.",
    ],
  },
  {
    slug: "choosing-a-watch-that-lasts",
    category: "WATCH GUIDES",
    date: "OCT 20, 2025",
    readTime: "5 MIN READ",
    title: "Choosing a Watch That Lasts",
    excerpt:
      "Key architectural, material, and mechanical considerations when selecting an heirloom timepiece destined to transcend generations.",
    image: "/assets/house-1.png",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "True longevity is not born from indestructible metal alone, but from a silhouette that outlives the ephemeral tides of contemporary fashion.",
    content: [
      "Acquiring a luxury timepiece is an investment in personal heritage. When evaluating prospective additions to your vault, case architecture, metallurgy, and movement serviceability form the inviolable triumvirate of longevity.",
      "Oystersteel 904L, proprietary high-density rose golds, and Grade 5 titanium each offer distinct patina characteristics and tensile strengths. A classic case diameter calibrated between 38mm and 40mm ensures the watch maintains aesthetic relevance through decades of shifting trends and formal dress standards.",
      "Equally critical is the movement architecture beating beneath the dial. Calibres engineered with modular gear trains, robust balance bridges, and readily available archival components guarantee that independent restorers will be able to service, adjust, and lubricate the mechanism half a century from today.",
      "When choosing an heirloom, favor dials characterized by harmonious symmetry, legible typography, and enduring restraint. Timepieces that resist avant-garde gimmicks inevitably mature with peerless grace.",
    ],
  },
  {
    slug: "the-craft-behind-every-detail",
    category: "CRAFTSMANSHIP",
    date: "OCT 15, 2025",
    readTime: "5 MIN READ",
    title: "The Craft Behind Every Detail",
    excerpt:
      "From hand-chamfered anglage to Côtes de Genève stripes, uncovering the finishing arts practiced in high horology ateliers.",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=900&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "Hand anglage does not improve accuracy by a single millisecond; it exists solely as an offering to absolute aesthetic devotion.",
    content: [
      "While automated CNC milling has revolutionized modern case manufacturing, the soul of haute horlogerie remains fundamentally anchored in manual hand finishing. In the Vallée de Joux, artisanal finishers spend hundreds of painstaking hours beveling steel bridges using gentian wood pegs dressed with diamond paste.",
      "Techniques such as perlage (circular graining on mainplates), mirror black polishing of screw heads, and hand-engraved balance cocks do not alter timekeeping precision—they exist purely as tributes to artistic perfection and artisanal patience.",
      "When light strikes a hand-anglé bridge at a 45-degree angle, the resulting flash of luminescence distinguishes true high craft from mass industrial assembly. The internal angles—sharp corners where two beveled edges meet seamlessly—can only be executed by human hands wielding traditional steel files.",
      "To peer into the back of a hand-finished watch through a loupe is to enter a cathedral of light, reflection, and quiet human triumph.",
    ],
  },
  {
    slug: "a-collectors-first-watch",
    category: "COLLECTORS",
    date: "OCT 10, 2025",
    readTime: "4 MIN READ",
    title: "A Collector's First Watch",
    excerpt:
      "Navigating provenance, original documentation, and condition when undertaking your foundational luxury timepiece acquisition.",
    image:
      "https://images.unsplash.com/photo-1547996160-71dfabb1a9b1?q=80&w=900&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "A vintage icon in unpolished, honest condition will always command greater respect than an over-restored relic stripped of its soul.",
    content: [
      "Every distinguished collection began with a singular, deliberate purchase. For the nascent collector, the primary challenge is cutting through secondary market hype to isolate authentic horological merit and historical integrity.",
      "Focusing on verified provenance, unpolished case chamfers, original dials, and matching serial documentation is far more valuable than pursuing fleeting speculative hype. A pre-owned icon in crisp mechanical health will always anchor a vault with quiet authority.",
      "Condition is paramount: original tritium or early Super-LumiNova hour plots, crisp bezel knurling, and sharp factory bevels tell an honest chronological narrative that polished metal simply cannot duplicate.",
      "At Horologe Royale, our master curators guide collectors through reference nuances, helping you secure timepieces that appreciate in emotional significance and tangible value alike.",
    ],
  },
  {
    slug: "from-heritage-to-modern-design",
    category: "BRAND JOURNAL",
    date: "OCT 05, 2025",
    readTime: "5 MIN READ",
    title: "From Heritage to Modern Design",
    excerpt:
      "How historic Swiss maisons balance archival reverence with avant-garde metallurgy and contemporary proportions.",
    image:
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=900&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "The greatest maisons do not emulate the past; they enter into an ongoing dialogue with their own founding archives.",
    content: [
      "The perpetual dialogue between historical reverence and technical innovation defines modern haute horlogerie. Esteemed manufactures continuously revisit mid-century tool watch archives, extracting iconic typography, gilded indices, and stepped bezel profiles while re-engineering calibres with silicon escapements and ceramic components.",
      "This synthesis produces timepieces that honor the deep-sea divers, aviators, and motorsport pioneers who originally put them to the test, while delivering the 100-meter water resistance, antimagnetic shielding, and chronometric certification demanded by modern executive life.",
      "Rather than falling prey to superficial retro styling, leading ateliers reinvent historical silhouettes with proprietary alloy mixtures—such as ceramic-infused golds and brushed tantalum—that resist the rigors of modern daily wear.",
      "Our vault celebrates maisons that respect their foundational DNA without becoming hostages to nostalgia.",
    ],
  },
  {
    slug: "understanding-complications",
    category: "WATCH GUIDES",
    date: "SEP 30, 2025",
    readTime: "6 MIN READ",
    title: "Understanding Complications",
    excerpt:
      "Demystifying perpetual calendars, flyback split-second chronographs, minute repeaters, and celestial moonphase complications.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
    author: "Horologe Royale Editorial Desk",
    pullQuote:
      "A perpetual calendar mechanical movement is a mechanical computer calculating leap years until 2100 with zero electricity.",
    content: [
      "In horological terminology, any mechanical function that extends beyond standard hours, minutes, and running seconds is termed a complication. From modest date apertures to astronomical celestial charts, complications represent the absolute summit of human mechanical computation.",
      "A perpetual calendar mechanically computes differing month lengths, leap year cycles, and lunar phases until the secular year 2100 without requiring manual intervention, utilizing a complex 48-tooth program wheel that rotates once every four calendar years.",
      "Meanwhile, minute repeaters translate optical time into acoustic music, striking calibrated hardened steel gongs with miniature hammers to chime hours, quarters, and exact minutes on demand. The resonance of each strike is tuned to musical perfection by ears that have listened to bells for decades.",
      "Chronographs with split-second rattrapante mechanisms allow wearers to measure two simultaneous events with two superimposed second hands, while celestial moonphase discs track the exact 29.53-day synodic month with astronomical precision.",
      "To fasten a grand complication to one's wrist is to wear centuries of mathematical mastery and microscopic ingenuity.",
    ],
  },
];

export const FEATURED_ARTICLE = INSIGHTS_ARTICLES[0];
export const JOURNAL_ARTICLES = INSIGHTS_ARTICLES.slice(1);

export function getArticleBySlug(slug: string): Article | undefined {
  const normalized = slug.toLowerCase().trim();
  return INSIGHTS_ARTICLES.find(
    (a) => a.slug.toLowerCase().trim() === normalized
  );
}

export function getRelatedArticles(currentSlug: string, count = 3): Article[] {
  const normalized = currentSlug.toLowerCase().trim();
  return INSIGHTS_ARTICLES.filter(
    (a) => a.slug.toLowerCase().trim() !== normalized
  ).slice(0, count);
}

