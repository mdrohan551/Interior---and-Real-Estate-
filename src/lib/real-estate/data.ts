/**
 * Imagine Interiors content. Every list here is served through lib/imagine/api.ts,
 * so you can swap this file for your real backend (REST / CMS / DB) without touching any UI.
 */
const U = "https://imagineinteriors.design/wp-content/uploads";

export const SITE = {
  name: "Imagine Interiors",
  phone: "+880 1712 664168",
  tel: "tel:+8801712664168",
  whatsapp: "https://wa.me/8801712664168?text=" + encodeURIComponent("Hi Imagine Interiors, I would like a free consultation."),
  email: "info@imagineinteriors.design",
  address: "SEL Rose-N-Dale, 116, Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1205",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.0712812767474!2d90.39350061498128!3d23.744837384592156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9aa09fce21d%3A0xf9076ab8f0e8af61!2sImagine%20Interiors%20-%20Dhaka!5e0!3m2!1sen!2sin!4v1659704359971!5m2!1sen!2sin",
  social: [
    ["Facebook", "https://www.facebook.com/imagineinteriorsbd/"],
    ["Instagram", "https://www.instagram.com/imagineinteriors.bd/"],
    ["LinkedIn", "https://www.linkedin.com/company/imagineinteriors/"],
    ["YouTube", "https://www.youtube.com/@imagineinteriorsbd"],
  ] as [string, string][],
};

export const BASE = "/real-estate";
export const NAV: [string, string][] = [
  ["Home", BASE], ["Approach", `${BASE}/about`], ["Services", `${BASE}/services`],
  ["Portfolio", `${BASE}/portfolio`], ["Journal", `${BASE}/blog`], ["Contact", `${BASE}/contact`],
];

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const IMG = {
  hero: `${U}/2019/03/bedroom-interior-design-bd.jpg`,
  home: `${U}/2021/01/imagine-interior-design.jpg`,
  office: `${U}/2021/01/imagine-interiors-office-design.jpg`,
  living: `${U}/2021/01/imagine-interiors-living-room-design.jpg`,
  restaurant: `${U}/2019/03/restaurant-design-bangladesh.jpg`,
  exterior: `${U}/2021/01/imagine-interiors-exterior-design.jpg`,
  kitchen: `${U}/2021/01/imagine-interiors-kitchen-design.jpg`,
  bathroom: `${U}/2021/01/imagine-interiors-bathroom-design.jpg`,
  duplex: `${U}/2021/01/imagine-interiors-duplex-house-design.jpg`,
  furniture: `${U}/2021/01/imagine-interiors-furniture-design.jpg`,
  bedroom: `${U}/2021/01/imagine-interiors-bedroom-design.jpg`,
};

/* ───────── Services ───────── */
export const CATS = ["All", "Home", "Office", "Restaurant", "Hotel"] as const;
export type CatFilter = (typeof CATS)[number];
export type Cat = Exclude<CatFilter, "All">;

export type Service = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  img: string;
  cat: Cat;
  leadService: string;
  includes: string[];
  price: string;
  startingPrice: string;
};
export const SERVICES: Service[] = [
  { slug: "home-interior", title: "Home Interior", short: "Beautiful, comfortable homes for you to live in.", cat: "Home", leadService: "Home Interior", img: IMG.living,
    price: "From ৳1,200 / sq.ft", startingPrice: "Packages from ৳3.5 Lakh",
    desc: "From a single room to a full duplex, we plan layout, furniture, storage and lighting around how your family actually lives, then carry the design through to a finished home.",
    includes: ["Living room design", "Bedroom design", "Kitchen design", "Bathroom design", "Duplex house design", "Exterior design"] },
  { slug: "office-interior", title: "Office Interior", short: "Ergonomic spaces that people want to work in.", cat: "Office", leadService: "Office Interior", img: IMG.office,
    price: "From ৳950 / sq.ft", startingPrice: "Workspaces from ৳4.8 Lakh",
    desc: "Modern, functional workplaces that support productivity and reflect your brand, from open-plan floors to executive cabins and meeting rooms.",
    includes: ["Open-plan workspaces", "Executive cabins", "Meeting & conference rooms", "Reception & lounge areas"] },
  { slug: "restaurant-commercial", title: "Restaurant & Commercial", short: "Hospitable environments that bring guests back.", cat: "Restaurant", leadService: "Restaurant Interior", img: IMG.restaurant,
    price: "From ৳1,400 / sq.ft", startingPrice: "Fit-outs from ৳6.0 Lakh",
    desc: "Restaurants, cafes, food courts and hotels designed for flow, atmosphere and durability, so the space works as hard as your team does.",
    includes: ["Restaurants & cafes", "Food courts", "Hotel interiors", "Retail & showrooms"] },
  { slug: "furniture-remodeling", title: "Furniture & Remodeling", short: "Made-to-measure pieces and thoughtful renovation.", cat: "Home", leadService: "Custom Furniture", img: IMG.furniture,
    price: "From ৳85,000", startingPrice: "Custom pieces & renovation",
    desc: "Custom furniture drawn and built for your space, plus remodeling that modernizes a home while keeping its soul.",
    includes: ["Custom furniture design", "Home remodeling", "Project analysis", "Built-in storage & joinery"] },
];

/* ───────── Projects (hundreds are supported: the portfolio pages are paginated) ───────── */
export type Project = { slug: string; title: string; cat: Cat; img: string; place: string };
// [title, category, image path under /wp-content/uploads, place]
const RAW: [string, Cat, string, string][] = [
  ["Duplex Residence, Kushtia", "Home", "2025/02/Kustia-Duplex_Residence-13.jpg", "Kushtia"],
  ["Dr. Saiful Islam's Residence", "Home", "2025/02/Imagine-Interiors-15.jpg", "Dhaka"],
  ["Tolarbag Residence", "Home", "2025/02/Interiors-20.jpg", "Mirpur, Dhaka"],
  ["Dream Home, Uttara 4", "Home", "2025/02/DJI_20250127181110_0150_D.jpg", "Uttara, Dhaka"],
  ["Mrs. Sen's Residence", "Home", "2021/01/Living-3.jpg", "Banani, Dhaka"],
  ["Park Road Residence", "Home", "2021/01/3.jpg", "Baridhara, Dhaka"],
  ["Niketon Residence", "Home", "2021/01/Imagine-Interiors-7.jpg", "Niketon, Dhaka"],
  ["Sylhet Luxury Home", "Home", "2025/02/Imagine-Interiors-16.jpg", "Sylhet"],
  ["Baridhara Duplex", "Home", "2021/01/LIVING-01-2-1.jpg", "Baridhara, Dhaka"],
  ["Luxury Apartment", "Home", "2025/02/Imagine-Interiors-7-6.jpg", "Dhaka"],
  ["Chittagong Residence", "Home", "2019/08/1-2.jpg", "Chittagong"],
  ["Bashundhara Residence", "Home", "2025/02/Imagine-Interiors-15-2.jpg", "Bashundhara, Dhaka"],
  ["Modern Living Spaces", "Home", "2025/02/Imagine-Interiors-11-2.jpg", "Dhaka"],
  ["Dr. Farhana's Residence", "Home", "2025/02/Imagine-Interiors-7-4.jpg", "Mohammadpur, Dhaka"],
  ["Gulshan-2 Contemporary Home", "Home", "2025/02/Imagine-Interiors-24.jpg", "Gulshan, Dhaka"],
  ["ITL Group Office", "Office", "2025/02/Interiors-9-1.jpg", "Bangladesh"],
  ["Parker Wellbore Office", "Office", "2025/02/Interiors-12-1.jpg", "Bangladesh"],
  ["Conveyor Group Office", "Office", "2025/02/Motif_Wanta-shipping_Photo-by-Intelier1.png", "Bangladesh"],
  ["Aziz Group Office", "Office", "2025/02/Imagine-Interiors-18-1.jpg", "Bangladesh"],
  ["ASM Chemical Office", "Office", "2021/07/02.jpg", "Bangladesh"],
  ["Maliha Group Office", "Office", "2021/01/10.jpg", "Bangladesh"],
  ["Siemens Office", "Office", "2020/07/9-10.jpg", "Bangladesh"],
  ["Bond Group Office", "Office", "2020/07/8-4.jpg", "Bangladesh"],
  ["Laxmi Innerwear Office", "Office", "2020/07/7-3.jpg", "Bangladesh"],
  ["Pepsico Multi-Level Office", "Office", "2020/07/6-5.jpg", "Bangladesh"],
  ["Existeck Office", "Office", "2019/08/4-2.jpg", "Bangladesh"],
  ["Kimball Workspace", "Office", "2019/03/kimball-4.jpg", "Bangladesh"],
  ["KIA Office", "Office", "2019/03/kia-1.jpg", "Bangladesh"],
  ["Cisco Engineering Office", "Office", "2019/03/cisco-4.jpg", "Bangladesh"],
  ["The Ground, Dhaka Food Hall", "Restaurant", "2021/07/Cafe-02.jpg", "Dhaka"],
  ["Golden Food Court", "Restaurant", "2021/07/Golden-Broast-1.jpg", "Bangladesh"],
  ["Sushi Samurai", "Restaurant", "2019/05/sushi-samurai-1.jpg", "Dhaka"],
  ["Food Counter Restaurant", "Restaurant", "2019/03/restaurant-design-7.jpg", "Bangladesh"],
  ["Dagozi Restaurant", "Restaurant", "2019/03/restaurant-design-1.jpg", "Bangladesh"],
  ["Sagorgaon Hotel", "Hotel", "2019/05/sagorgaon-1.jpg", "Bangladesh"],
  ["Coxway Hotel", "Hotel", "2019/03/coxway-12.jpg", "Cox's Bazar"],
];

function interleave(list: Project[]) {
  const g: Record<string, Project[]> = {};
  list.forEach((p) => (g[p.cat] ||= []).push(p));
  const keys = Object.keys(g); const out: Project[] = [];
  for (let i = 0; out.length < list.length; i++) keys.forEach((k) => g[k][i] && out.push(g[k][i]));
  return out;
}
export const PROJECTS: Project[] = interleave(RAW.map(([title, cat, path, place]) => ({ slug: slugify(title), title, cat, img: `${U}/${path}`, place })));

export const SCOPE: Record<Cat, string[]> = {
  Home: ["Space planning", "Furniture & joinery", "Lighting design", "Material selection", "Execution & handover"],
  Office: ["Workplace planning", "Ergonomic furniture", "Acoustics & lighting", "Branding in space", "Execution & handover"],
  Restaurant: ["Guest flow & seating", "Atmosphere & lighting", "Durable finishes", "Counter & kitchen interface", "Execution & handover"],
  Hotel: ["Guest-room planning", "Public areas", "Lighting & mood", "Premium materials", "Execution & handover"],
};

/* ───────── Approach / teams (edit the lead names to your real people) ───────── */
export const TEAMS = [
  { n: "Home Studio", lead: "Residential design lead", group: "B2C", img: IMG.bedroom, cat: "Home" as Cat,
    d: "A people-first team for families and homeowners. We listen to how you live, then design calm, comfortable homes with clear budgets and honest timelines." },
  { n: "Workspace Studio", lead: "Corporate design lead", group: "B2B", img: IMG.office, cat: "Office" as Cat,
    d: "For companies that need speed and certainty. Detailed briefs, ergonomic planning and tight programmes so teams move in on schedule." },
  { n: "Hospitality Studio", lead: "Commercial design lead", group: "B2B", img: IMG.restaurant, cat: "Restaurant" as Cat,
    d: "Restaurants, cafes and hotels designed around guest flow and atmosphere, with finishes built to survive a busy service." },
  { n: "Craft & Remodel", lead: "Furniture & renovation lead", group: "B2C / B2B", img: IMG.furniture, cat: "Home" as Cat,
    d: "Made-to-measure furniture and careful remodeling that modernizes a space while keeping its soul." },
];

export const PROMISES = [
  ["Detailed Consultation", "Extensive discussion with you to understand your need before a single line is drawn."],
  ["Premium Materials", "We source the best materials from reputable suppliers: wood, glass, tiles and marble."],
  ["On-time Delivery", "On time, every time. Your project delivered as promised."],
] as const;

export const STEPS = [
  ["Consult", "A detailed conversation and site visit to understand needs, taste and budget."],
  ["Design", "Layouts, 3D visuals, materials and lighting refined until nothing is unnecessary."],
  ["Execute", "Our team builds and installs with every detail inspected on site."],
  ["Handover", "A final walkthrough, then a space ready to be lived in."],
];

export const REVIEWS = [
  { name: "Ayesha Khatun", role: "Gulshan Residence", title: "Highly Professional Team", text: "My past experience with interior design had not been very good. Not so with Imagine Interiors. I was kept up to date on progress at every stage, and the final output was exactly what I wanted.", stars: 5 },
  { name: "Tanvir Ahmed", role: "Managing Director, Conveyor Group", title: "Flawless Corporate HQ Execution", text: "Imagine transformed our 14,000 sq ft head office on schedule and within budget. Acoustic separation, ergonomic workstations, and brand presence were executed flawlessly.", stars: 5 },
  { name: "Nazrul Islam", role: "Dhanmondi Duplex", title: "Excellent Work & Great Service", text: "One of the best design teams in Bangladesh. Their redesign made sure the soul of the house was maintained while the look and functionality were modernized.", stars: 5 },
  { name: "Samira Rahman", role: "Partner, The Brass Rail", title: "Uncompromising Design Quality", text: "From custom joinery to warm layered lighting, they created an atmosphere our guests constantly compliment. Truly uncompromised craftsmanship.", stars: 5 },
];

export const CLIENTS: [string, string][] = [
  ["Bashundhara Group", `${U}/2019/03/32.png`], ["InterContinental", `${U}/2019/03/20.png`], ["Apex", `${U}/2019/03/apex.jpg`],
  ["Client", `${U}/2019/03/11.png`], ["BTA", `${U}/2019/03/27.png`], ["Dhaka Bank", `${U}/2019/03/16.png`], ["Client", `${U}/2019/03/34.png`],
];

export const FAQS = [
  ["How much does interior design cost?", "It depends on size, materials and scope. After a free consultation and site visit we share a detailed, itemised estimate so there are no surprises."],
  ["How long does a project take?", "Most homes take a few weeks to a few months from design approval to handover. We agree a clear timeline up front and keep you updated at each stage."],
  ["Do you handle execution too?", "Yes. We manage electrical, plumbing, false ceiling, flooring, painting, carpentry and furniture installation under one roof."],
  ["Which areas do you serve?", "We work across Bangladesh, with teams in Dhaka and Chittagong and projects in Sylhet, Kushtia and more."],
  ["Can I see past projects first?", "Of course. Browse the portfolio, open any case study, or book a consultation and we will walk you through relevant work."],
];

/* ───────── Journal ───────── */
export type Post = { slug: string; title: string; cat: string; date: string; read: string; img: string; excerpt: string; body: { h: string; p: string[] }[] };
export const POSTS: Post[] = [
  { slug: "what-does-an-interior-design-company-do", title: "What Does an Interior Design Company Do?", cat: "Guide", date: "2026-09-18", read: "4 min", img: IMG.home,
    excerpt: "Interior design is more than decoration. Here is what really happens between the first call and the final handover.",
    body: [
      { h: "It starts with how you live", p: ["Interior design is more than decoration. A good designer first looks at how you use the space, then plans layout, furniture, storage, lighting and movement so that everything has a purpose.", "That is why a detailed consultation comes before any drawing."] },
      { h: "Materials, colour and light", p: ["Next come colours, materials, textures and fixtures that fit your style and budget. Wood, MDF, plywood, laminate, glass, tiles and marble are each chosen for where and how they will be used.", "Lighting is planned too, from natural daylight to task and accent lighting."] },
      { h: "From drawing to handover", p: ["The work can continue all the way to execution: electrical, plumbing, false ceiling, flooring, painting, carpentry and furniture installation.", "Good coordination keeps everything on track and turns the design into a space that feels right and works well."] },
    ] },
  { slug: "design-styles-that-suit-bangladeshi-homes", title: "Seven Design Styles That Suit Bangladeshi Homes", cat: "Style", date: "2026-08-30", read: "5 min", img: IMG.living,
    excerpt: "Modern, contemporary, minimalist, luxury, Scandinavian, Japandi or modern traditional: how to choose.",
    body: [
      { h: "Clean and current", p: ["Modern interiors use clean lines, simple forms and practical layouts. Contemporary design is similar but fresher, following current colours, materials and finishes.", "Minimalist spaces go further: less clutter, more open room and only what you truly need."] },
      { h: "Warm and refined", p: ["Scandinavian design leans on light colours, natural materials and a warm, comfortable feel. Japandi blends Japanese simplicity with that same Nordic comfort.", "Luxury interiors use premium materials, elegant details and a refined look."] },
      { h: "Classic with comfort", p: ["Modern traditional keeps classic elements but adds modern comfort and function, a popular choice for families who want a home with character.", "Not sure which fits you? Bring a few photos you love to the consultation and we will translate them into a plan."] },
    ] },
  { slug: "choosing-the-right-materials", title: "Wood, MDF, Plywood or Laminate? Choosing the Right Materials", cat: "Materials", date: "2026-08-12", read: "4 min", img: IMG.kitchen,
    excerpt: "Each material has a best use. Picking right saves money now and repairs later.",
    body: [
      { h: "Match the material to the place", p: ["Solid wood and quality plywood suit structural furniture and areas that carry weight. MDF gives a smooth surface that takes paint well, but it prefers dry rooms.", "Laminate is a hard-wearing surface layer that keeps kitchens and wardrobes easy to clean."] },
      { h: "Floors, walls and wet areas", p: ["Tiles and marble work for floors and bathrooms where water and wear are constant. Glass brings light and openness to partitions, doors and shelving.", "In kitchens and bathrooms, always ask about moisture resistance before choosing a board."] },
      { h: "Ask for samples", p: ["Always look at samples in your own light. A finish can look very different in a showroom and in your living room.", "We bring physical samples to the consultation so decisions are easy."] },
    ] },
  { slug: "how-to-plan-your-interior-budget", title: "How to Plan Your Home Interior Budget", cat: "Budget", date: "2026-07-25", read: "5 min", img: IMG.duplex,
    excerpt: "Decide priorities, ask for itemised quotes and keep a buffer. A simple plan that avoids surprises.",
    body: [
      { h: "Start with priorities", p: ["List the rooms and items that matter most to you, such as the kitchen, wardrobes or the living room. Spend where you will notice it every day.", "Everything else can be phased."] },
      { h: "Get an itemised estimate", p: ["A single lump-sum number hides a lot. Ask for a breakdown across carpentry, furniture, lighting, finishes and labour so you can compare and adjust.", "Itemised quotes also make changes easier to price later."] },
      { h: "Keep a buffer", p: ["Set aside a contingency for unexpected site conditions and small changes of mind. It is far easier than stopping a project half-way.", "A clear scope and timeline are the best protection for your budget."] },
    ] },
  { slug: "office-interior-design-for-productivity", title: "Office Interior Design That Helps People Do Their Best Work", cat: "Office", date: "2026-07-08", read: "4 min", img: IMG.office,
    excerpt: "Layout, light, acoustics and ergonomics: four levers that change how a team feels at work.",
    body: [
      { h: "Plan for how teams really work", p: ["Map who collaborates with whom, who needs quiet and which meetings repeat. Layout should follow those patterns, not the other way round.", "Mix open desks with focus rooms and informal meeting spots."] },
      { h: "Light, sound and comfort", p: ["Natural light, good task lighting and sensible acoustics reduce fatigue. Ergonomic chairs and desks pay for themselves in comfort and focus.", "Small details, like where the printer sits, shape daily habits."] },
      { h: "Let the space tell your story", p: ["Colour, materials and signage should reflect your brand so visitors understand it the moment they walk in.", "A calm reception sets the tone for every meeting that follows."] },
    ] },
  { slug: "restaurant-interior-design-that-brings-guests-back", title: "Restaurant Interior Design That Brings Guests Back", cat: "Restaurant", date: "2026-06-20", read: "4 min", img: IMG.restaurant,
    excerpt: "Flow, lighting and acoustics decide whether a meal feels special. Start with these.",
    body: [
      { h: "Design the journey", p: ["Think about the guest's path from entrance to table to payment, and the staff's path from kitchen to floor. Smooth flow makes service faster and calmer.", "Offer a mix of seating so couples, families and groups all feel at home."] },
      { h: "Atmosphere is lighting", p: ["Warm, layered lighting makes food look better and guests linger. Pair it with materials that handle heat, spills and heavy use.", "Acoustics matter too: soft surfaces keep a busy room pleasant."] },
      { h: "Build for durability", p: ["Commercial spaces get used hard. Choose finishes that clean easily and age gracefully so the room looks fresh for years.", "We design the counter and kitchen interface together with the dining area."] },
    ] },
];
