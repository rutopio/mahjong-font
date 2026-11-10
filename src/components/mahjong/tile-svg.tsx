import { Suspense, use } from "react";

import { DEFAULT_TILE_COLOR } from "@/lib/constants";
import { renderTilesSvg } from "@/lib/render-tile-svg";
import { loadTilesData } from "@/lib/tiles-data";

interface TileSvgProps {
  /** Already transformed notation string (e.g. "1m2m3m"). */
  text: string;
  theme: string;
  tileColor?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Renders a tile sequence as inline SVG. Shared by the main preview and the
 * notation examples so both use the same data-driven renderer (no webfont).
 */
function TileSvgContent({
  text,
  theme,
  tileColor = DEFAULT_TILE_COLOR,
  className,
  ariaLabel,
}: TileSvgProps) {
  const data = use(loadTilesData());
  const svg = renderTilesSvg({ text, theme, tileColor, data });

  const ariaProps = ariaLabel
    ? ({ role: "img", "aria-label": ariaLabel } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <div
      {...ariaProps}
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, locally generated SVG
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function TileSvg(props: TileSvgProps) {
  const ariaProps = props.ariaLabel
    ? ({ role: "img", "aria-label": props.ariaLabel } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <Suspense fallback={<div {...ariaProps} className={props.className} />}>
      <TileSvgContent {...props} />
    </Suspense>
  );
}
