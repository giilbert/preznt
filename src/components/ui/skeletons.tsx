export const SkeletonCard: React.FC<{ amount?: number }> = ({ amount = 1 }) => (
  <>
    {Array(amount)
      .fill(0)
      .map((_, i) => (
        <div key={i} role="status" className="animate-pulse mt-2">
          <div className="h-10 bg-neutral-800 rounded-md dark:bg-neutral-900 w-full mb-2"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ))}
  </>
);
