import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMBER } from "@/lib/business-contact";

const MESSAGE = encodeURIComponent("Assalamu alaikum, I need help with a book.");

export default function WhatsAppContactButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact AS Books House on WhatsApp"
      title="Contact us on WhatsApp"
      className="fixed bottom-5 right-4 z-[70] inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-white shadow-xl shadow-emerald-950/20 ring-2 ring-white transition hover:-translate-y-0.5 hover:bg-[#1da851] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 sm:bottom-6 sm:right-6 sm:px-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <FaWhatsapp aria-hidden="true" className="text-2xl" />
      <span className="text-sm font-bold">WhatsApp us</span>
    </a>
  );
}
