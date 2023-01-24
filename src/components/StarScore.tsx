export default function StarScore({
  score,
  maxScore = 5,
  color,
  size = 24,
}: {
  score: number;
  maxScore: number;
  color?: string;
  size?: number;
}) {
  const displayedScore = Math.min(score, maxScore);
  if (maxScore === 0) {
    return null;
  }

  return (
    <span
      className="text-transparent inline-block relative text-[24px] font-light"
      style={{ fontSize: size }}
    >
      *****
      <div
        className="absolute top-0 left-0 bottom-0 text-[#FFD80C] text-[24px] font-light overflow-hidden"
        style={{
          width: `${(displayedScore / maxScore) * 100}%`,
          color,
          fontSize: size,
        }}
      >
        *****
      </div>
    </span>
  );
}
