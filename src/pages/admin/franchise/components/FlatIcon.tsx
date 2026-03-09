export const FlatIcon = ({
  src,
  alt,
  className = "h-5 w-5",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).style.display = "none";
    }}
    loading="lazy"
  />
);
