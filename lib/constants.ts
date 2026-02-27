import type { OrderStatus, ServiceType } from "@prisma/client";

export const SITE_NAME = "Solvix Studio";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const WHATSAPP_URL = "https://wa.me/6281234567890?text=Halo%20Solvix%20Studio%2C%20saya%20ingin%20diskusi%20project";

export const serviceCatalog: {
  type: ServiceType;
  title: string;
  summary: string;
  category: "web" | "mobile" | "branding";
  delivery: string;
  startPrice: number;
  bullets: string[];
}[] = [
  {
    type: "WEB_APP",
    title: "Web App",
    summary: "Aplikasi web custom dengan arsitektur scalable dan UX yang conversion-focused.",
    category: "web",
    delivery: "4-10 minggu",
    startPrice: 25000000,
    bullets: ["Product discovery", "Modular architecture", "Analytics ready"],
  },
  {
    type: "COMPANY_PROFILE",
    title: "Company Profile",
    summary: "Website company profile premium untuk menaikkan trust dan kualitas lead masuk.",
    category: "branding",
    delivery: "2-5 minggu",
    startPrice: 9500000,
    bullets: ["Story-driven sections", "SEO baseline", "CMS-ready"],
  },
  {
    type: "LANDING_PAGE",
    title: "Landing Page",
    summary: "Landing page cepat, persuasive, dan siap A/B testing untuk campaign marketing.",
    category: "web",
    delivery: "1-3 minggu",
    startPrice: 6500000,
    bullets: ["Copy hierarchy", "Performance first", "CTA optimization"],
  },
  {
    type: "DIGITAL_INVITATION",
    title: "Digital Invitation",
    summary: "Undangan digital modern dengan visual estetik, interaktif, dan mobile-first.",
    category: "branding",
    delivery: "5-10 hari",
    startPrice: 2500000,
    bullets: ["Custom theme", "RSVP flow", "Share-ready"],
  },
  {
    type: "MOBILE_APP",
    title: "Mobile App",
    summary: "Aplikasi mobile iOS/Android dengan pengalaman pengguna yang halus dan konsisten.",
    category: "mobile",
    delivery: "8-16 minggu",
    startPrice: 45000000,
    bullets: ["Cross-platform", "Push notifications", "Store deployment support"],
  },
  {
    type: "DESKTOP_APP",
    title: "Desktop App",
    summary: "Aplikasi desktop untuk operasional internal dengan reliabilitas tinggi.",
    category: "mobile",
    delivery: "6-12 minggu",
    startPrice: 30000000,
    bullets: ["Windows/macOS support", "Secure local workflow", "Auto update strategy"],
  },
];

export const pricingPackages = [
  {
    name: "Starter",
    description: "Untuk bisnis yang ingin go-live cepat dengan scope terarah.",
    price: "Mulai 8 juta",
    features: ["1 channel konsultasi", "UI kit dasar", "QA dasar", "1 minggu support"],
  },
  {
    name: "Growth",
    description: "Untuk tim yang ingin hasil bisnis terukur dan iterasi berkelanjutan.",
    price: "Mulai 22 juta",
    features: ["Workshop discovery", "Design system", "Analytics setup", "2 minggu support"],
  },
  {
    name: "Pro",
    description: "Untuk produk digital kompleks dengan target performa agresif.",
    price: "Mulai 45 juta",
    features: ["Product squad", "Architecture review", "Performance budget", "1 bulan support"],
  },
] as const;

export const testimonials = [
  {
    name: "Rifky Pradana",
    role: "CMO, Komerce Labs",
    quote:
      "Solvix menyusun ulang funnel kami dari copy sampai performa teknis. Conversion naik signifikan dalam 6 minggu.",
  },
  {
    name: "Nadya Savitri",
    role: "Founder, Finovo",
    quote:
      "Kolaborasi paling rapi yang pernah kami alami. Keputusan desain selalu berbasis data, bukan asumsi.",
  },
  {
    name: "Dimas Setiawan",
    role: "Ops Lead, RantaiID",
    quote:
      "Dashboard operasional yang mereka bangun memotong waktu proses tim kami hampir setengahnya.",
  },
];

export const caseStudies = [
  {
    title: "Komerce Labs",
    description: "Revamp landing dan checkout flow untuk campaign kuartal.",
    metrics: ["Conversion +35%", "Bounce -28%", "Lead quality +22%"],
  },
  {
    title: "Finovo",
    description: "Pembuatan dashboard onboarding untuk meningkatkan aktivasi user.",
    metrics: ["Activation +41%", "Time-to-value -32%", "Support tickets -18%"],
  },
  {
    title: "RantaiID",
    description: "Optimasi performa web app operasional dengan budget performa ketat.",
    metrics: ["Load time -40%", "TTI -37%", "Error rate -26%"],
  },
];

export const faqs = [
  {
    question: "Apakah Solvix menerima proyek dari nol sampai launch?",
    answer:
      "Ya. Kami bisa mulai dari discovery, UI/UX, implementasi, QA, deployment, hingga support pasca-launch.",
  },
  {
    question: "Bagaimana skema pembayaran proyek?",
    answer:
      "Umumnya bertahap: DP, progress milestone, dan final delivery. Detailnya disesuaikan ruang lingkup proyek.",
  },
  {
    question: "Apakah revisi sudah termasuk?",
    answer:
      "Termasuk. Setiap paket memiliki jumlah iterasi terstruktur agar timeline tetap sehat dan hasil tetap presisi.",
  },
  {
    question: "Berapa lama estimasi pengerjaan?",
    answer:
      "Tergantung kompleksitas. Landing page bisa 1-3 minggu, sedangkan web app biasanya 4-10 minggu.",
  },
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  IN_REVIEW: "In Review",
  IN_PROGRESS: "In Progress",
  WAITING_CLIENT: "Waiting Client",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const serviceTypeLabel: Record<ServiceType, string> = {
  WEB_APP: "Web App",
  COMPANY_PROFILE: "Company Profile",
  LANDING_PAGE: "Landing Page",
  DIGITAL_INVITATION: "Digital Invitation",
  MOBILE_APP: "Mobile App",
  DESKTOP_APP: "Desktop App",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const appNavLinks = [
  { href: "/app", label: "Home", icon: "Home" },
  { href: "/app/orders", label: "Orders", icon: "ClipboardList" },
  { href: "/app/orders/new", label: "New Order", icon: "PlusSquare" },
  { href: "/app/billing", label: "Billing", icon: "WalletCards" },
  { href: "/app/profile", label: "Profile", icon: "UserCircle2" },
] as const;

export const adminNavLinks = [
  { href: "/admin", label: "Admin Orders", icon: "ShieldCheck" },
  { href: "/admin/leads", label: "Admin Leads", icon: "MailCheck" },
] as const;
