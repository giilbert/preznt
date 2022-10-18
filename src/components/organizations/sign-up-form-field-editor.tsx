import { SignUpFieldType } from "@prisma/client";
import { useFormContext } from "react-hook-form";

const NO_CONFIG_INPUTS: SignUpFieldType[] = ["NONE", "TEXT", "EMAIL"];

export const QuestionInputField: React.FC = () => {
  const form = useFormContext();
  const type: SignUpFieldType = form.watch("type");

  if (NO_CONFIG_INPUTS.indexOf(type) !== -1) return null;

  return <p>TODO: {type}</p>;
};
