import { FiX } from "react-icons/fi";
import { Heading } from "../ui";

export const ErrorMessage: React.FC<{
  error: {
    cause?: string;
    code?: string;
    message: string;
  } | null;
}> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-500 rounded py-2 px-4 flex items-center gap-4 mt-2">
      <FiX size="28" />
      <div className="">
        <Heading level="h3">
          An error occured{" "}
          {error.code && (
            <span className="font-mono bg-neutral-700 px-2 rounded ml-1">
              {error.code}
            </span>
          )}
        </Heading>

        <p className="font-mono">Message: {error.message.toString()}</p>
        {error.cause && (
          <p className="font-mono">Caused by: {error.cause.toString()}</p>
        )}
      </div>
    </div>
  );
};
