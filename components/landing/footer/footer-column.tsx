import { FooterLink } from "@/components/landing/footer/footer-link";
import type { FooterColumnConfig } from "@/components/landing/footer/footer-links";

type FooterColumnProps = {
  column: FooterColumnConfig;
};

export function FooterColumn({ column }: FooterColumnProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      <h3 className="text-base font-bold leading-5 tracking-[0.32px] text-white">
        {column.title}
      </h3>
      <ul className="flex w-full flex-col items-start gap-1">
        {column.links.map((link) => (
          <li key={link.label}>
            <FooterLink link={link} column={column.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
