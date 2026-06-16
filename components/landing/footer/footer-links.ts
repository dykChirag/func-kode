export type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
  /** Poppins 400 for product sub-items; Archivo 500 for standard links. */
  variant?: "archivo" | "poppins";
};

export type FooterColumnConfig = {
  id: string;
  title: string;
  links: FooterLinkItem[];
};

export const FOOTER_COLUMNS: FooterColumnConfig[] = [
  {
    id: "patch-id",
    title: "Patch ID",
    links: [
      { label: "What is Patch ID?", href: "/about" },
      { label: "What is func(kode) ?", href: "/#func-kode" },
      { label: "Team", href: "/about" },
      { label: "Careers", href: "/#contact-us" },
    ],
  },
  {
    id: "product",
    title: "Product",
    links: [
      { label: "Connect via GitHub", href: "/auth/login" },
      { label: "Partner with Us", href: "/#contact-us" },
      { label: "Hire Talent", href: "/#for-teams" },
      { label: "Mobile app", href: "/#contact-us" },
      { label: "func(kode)", href: "/#func-kode", variant: "poppins" },
      { label: "Raccoon AI", href: "/#contact-us", variant: "poppins" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case study", href: "/about" },
      { label: "Testimonials", href: "/about" },
    ],
  },
  {
    id: "follow-us",
    title: "Follow us",
    links: [
      {
        label: "Instagram",
        href: "https://instagram.com/patchid",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/patchid",
        external: true,
      },
    ],
  },
];

export const FOOTER_ATTRIBUTION = {
  label: "Incubated by bbuilds.org",
  href: "https://bbuilds.org",
  external: true,
} as const;
