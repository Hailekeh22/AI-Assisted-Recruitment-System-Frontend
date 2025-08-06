import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageButton } from "@/components/languageSwitcher/LanguageButton";
import Nav from "@/components/Nav/Nav";



export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <>
    <Nav />
      <div className=" flex justify-between">
        <h1 className=" text-5xl text-blue-600">{t("title")}</h1>
        <LanguageButton />
      </div>
      <Link href="/about">{t("about")}</Link>
    </>
  );
}
