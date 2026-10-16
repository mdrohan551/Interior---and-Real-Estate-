import { interior } from "@/lib/interior";
import ConsultationForm from "./ConsultationForm";
import { SectionHead } from "./ui";

/** Inline lead-generation form with the same validation as the booking modal */
export default function QuoteSection() {
  return (
    <section id="quote" className="lv-wrap py-24 md:py-32">
      <SectionHead label="Request a quote" title={<h2 className="lv-h2 max-w-xl">{interior.contact.title}</h2>}>
        <p className="mt-4 max-w-lg text-[15px] sm:text-base md:text-lg font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{interior.contact.text}</p>
        <div className="mt-12 max-w-2xl"><ConsultationForm /></div>
      </SectionHead>
    </section>
  );
}

export { QuoteSection };

