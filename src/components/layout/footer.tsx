import { AttributionFooter } from "@rutopio/ui/footer";

export function Footer() {
  return (
    <AttributionFooter
      repository={{
        href: "https://github.com/rutopio/mahjong-font",
        label: "rutopio/mahjong-font",
      }}
      author={{ href: "https://chingru.com", label: "Created by ChingRu" }}
    />
  );
}
