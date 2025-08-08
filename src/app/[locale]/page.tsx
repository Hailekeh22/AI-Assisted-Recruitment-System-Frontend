import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/Nav/Nav";
import LandingPage from "@/pages/LandingPage";



export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <>
    <Nav />
    <LandingPage />
    </>
  );
}
