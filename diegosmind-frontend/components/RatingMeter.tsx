export default function RatingMeter({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className="meter" aria-label={`Rating ${rating} out of 10`}>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="meter-seg"
          data-on={i < rating}
          style={{ animationDelay: `${i * 40}ms`, height: size === "lg" ? 14 : 11 }}
        />
      ))}
      <span
        className="font-mono-ui"
        style={{ fontSize: size === "lg" ? 12 : 10.5, color: "var(--text-tertiary)", marginLeft: 8 }}
      >
        {rating}/10
      </span>
    </div>
  );
}
