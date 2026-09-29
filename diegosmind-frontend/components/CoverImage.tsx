/* eslint-disable @next/next/no-img-element */
type Props = {
  src?: string | null;
  alt: string;
  aspectRatio?: string;
  className?: string;
  children?: React.ReactNode;
};

// Fixed-ratio frame: any uploaded image is cropped (cover) to fit, so users never need a specific size.
export default function CoverImage({ src, alt, aspectRatio = "4 / 3", className = "", children }: Props) {
  return (
    <div className={`cover-frame ${className}`} style={{ aspectRatio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <div className="cover-placeholder" />}
      {children}
    </div>
  );
}
