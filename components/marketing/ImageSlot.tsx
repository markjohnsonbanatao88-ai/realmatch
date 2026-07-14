import Image from "next/image";

type ImageSlotProps = {
  /** Short description of the final photograph this slot needs. */
  requirement: string;
  ratio?: "portrait" | "landscape";
  /** Real, approved photography only. See ASSET_REQUIREMENTS.md. */
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

/**
 * Photography slot. Until real, approved photography exists it renders a
 * clearly labelled development placeholder — never a fake photo, never a
 * fake person. Supply `src`/`alt` once final assets are approved.
 */
export function ImageSlot({
  requirement,
  ratio = "portrait",
  src,
  alt,
  width = 960,
  height = 1200,
  priority = false
}: ImageSlotProps) {
  if (src && alt) {
    return (
      <figure className={`image-slot ratio-${ratio}`} style={{ padding: 0 }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 880px) 100vw, 45vw"
        />
      </figure>
    );
  }

  return (
    <figure className={`image-slot ratio-${ratio}`} aria-label="Photography placeholder">
      <span className="slot-kicker">Photography slot</span>
      <figcaption className="slot-note">
        Development placeholder — final image specified in ASSET_REQUIREMENTS.md: {requirement}
      </figcaption>
    </figure>
  );
}
