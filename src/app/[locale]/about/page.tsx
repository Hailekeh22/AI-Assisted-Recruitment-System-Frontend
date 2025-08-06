import { LanguageButton } from "@/components/languageSwitcher/LanguageButton";
import Nav from "@/components/Nav/Nav";
import { useTranslations } from "next-intl";
import React from "react";

const AboutPage = () => {
  const t = useTranslations("About");
  return (
    <>
    <Nav />
      <div>
        <h2>{t("title")}</h2>
        <LanguageButton />
      </div>
    </>
  );
};

export default AboutPage;
