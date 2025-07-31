import { useTranslations } from "next-intl"


const LoginPage = () => {
    const t = useTranslations("Login")
  return (
    <div>{t("title")}</div>
  )
}

export default LoginPage