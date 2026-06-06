import { useTranslation } from "react-i18next";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NotationsButtonProps {
    onClick: () => void;
}

export function NotationsButton({ onClick }: NotationsButtonProps) {
    const { t } = useTranslation();
    return (
        <Button onClick={onClick} className="">
            <InfoIcon aria-hidden="true" />
            {t("howToUse")}
        </Button>
    );
}
