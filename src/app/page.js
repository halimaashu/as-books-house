import Banner from "@/components/shared/Banner";
import Marque from "@/components/shared/Marque";
import SpeachileBooks from "@/components/shared/SpeachileBooks";
import SimpleStep from "@/components/shared/SimpleStep";
import TrustedBooks from "@/components/shared/TrustedBooks";
import UserreviewMarque from "@/components/shared/UserreviewMarque";
import FAQ from "@/components/shared/FAQ";
import ContactPage from "@/components/shared/ContactPage";
import PartnersMarquee from "@/components/shared/Partnersmarquee";
import { getAllBooks } from "@/lib/data";
import EBookShelf from "@/components/shared/EBookShelf";
import WriterShelf from "@/components/shared/WriterShelf";
import LearningBannerPromo from "@/components/shared/LearningBannerPromo";

export default async function Home() {
  const books = (await getAllBooks()) || [];
  return (
    <div>
      <Banner books={books} />
      <LearningBannerPromo />
      <Marque />
      <SpeachileBooks books={books} />
      <EBookShelf books={books} />
      <WriterShelf books={books} />

      <div id="how-it-works">
        <SimpleStep />
      </div>

      <TrustedBooks />
      <UserreviewMarque />
      <FAQ />
      <ContactPage/>
      <PartnersMarquee/>
    </div>
  );
}
