import moment from "moment";
import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";

const labelClasses = "text-neutral-300 font-semibold";
const inputClasses = "bg-neutral-800 px-3 py-2 text-gray-100 rounded mt-2";
const errorClasses = "text-red-400";

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface GenericInputProps extends HTMLInputProps {
  name: string;
  displayName?: string;
  label?: string;
  tip?: string;
  registerOptions?: RegisterOptions;
  wrapperProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

const Generic: React.FC<GenericInputProps> = ({
  name,
  label,
  tip,
  registerOptions,
  wrapperProps,
  ...rest
}) => {
  const form = useFormContext();

  return (
    <>
      <div {...wrapperProps}>
        <label htmlFor={name} className={labelClasses}>
          {label || name.toUpperCase()}
        </label>
        <input
          {...form.register(name, registerOptions)}
          autoComplete="off"
          id={name}
          className={inputClasses}
          {...rest}
        />
      </div>
      <p className={errorClasses}>
        {form.formState.errors[name]?.message as string}
      </p>
    </>
  );
};

const DateInput: React.FC<GenericInputProps> = ({ name, label, tip }) => {
  const form = useFormContext();

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className={labelClasses}>
        {label || name.toUpperCase()}
      </label>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <input
            value={
              form.watch(name)
                ? moment(form.watch(name)).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={(e) => {
              field.onChange(new Date(e.target.value as string));
            }}
            autoComplete="off"
            type="datetime-local"
            id={name}
            className={inputClasses}
          />
        )}
      />
      <p className={errorClasses}>
        {form.formState.errors[name]?.message as string}
      </p>
    </div>
  );
};

type SimpleInputProps = Omit<
  GenericInputProps,
  "registerOptions" | keyof HTMLInputProps
> & {
  name: string;
};

const Text: React.FC<SimpleInputProps> = (props) => {
  return (
    <Generic
      {...props}
      wrapperProps={{
        className: "flex flex-col",
      }}
    />
  );
};

const Checkbox: React.FC<SimpleInputProps> = (props) => {
  return (
    <Generic
      {...props}
      type="checkbox"
      className="scale-125"
      wrapperProps={{
        className: "flex gap-4 mt-2",
      }}
    />
  );
};

export const InputField = {
  Text,
  Generic,
  Checkbox,
  Date: DateInput,
};
