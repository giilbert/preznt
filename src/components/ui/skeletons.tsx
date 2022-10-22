import clsx from "clsx";

export const SkeletonCard: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    amount?: number;
  }
> = ({ amount = 1, className, ...rest }) => (
  <>
    {Array(amount)
      .fill(0)
      .map((_, i) => (
        <div key={i} role="status" className={"animate-pulse"}>
          <div
            className={clsx(
              "h-10 bg-neutral-800 rounded-md dark:bg-neutral-900 w-full mb-2",
              className
            )}
            {...rest}
          ></div>
          <span className="sr-only">Loading</span>
        </div>
      ))}
  </>
);
