import {useTranslation} from "react-i18next";

export default function FundsPage() {
  const { t } = useTranslation()

  return (
    <div className="text-[20px]">
      {t("funds.funds")}
    </div>
  );
}
