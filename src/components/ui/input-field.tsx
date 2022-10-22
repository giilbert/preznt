import { fileToBase64 } from "@/utils/file-to-base-64";
import clsx from "clsx";
import moment from "moment";
import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { ImageUpload } from "./image-upload";

const labelClasses = "text-neutral-300 font-semibold";
const inputClasses =
  "bg-neutral-800 px-3 py-2 text-gray-100 rounded mt-2 ring-accent-primary focus:ring-2";
const errorClasses = "text-red-400";
const tipClasses = "mt-1 text-gray-400";

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
    <div className="my-1">
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
      {tip && <p className={tipClasses}>{tip}</p>}
      <p className={errorClasses}>
        {form.formState.errors[name]?.message as string}
      </p>
    </div>
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
      {tip && <p className={tipClasses}>{tip}</p>}
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

const Checkbox: React.FC<SimpleInputProps> = ({ name, label, tip }) => {
  const form = useFormContext();

  return (
    <div className="my-1">
      <div
        className="flex bg-neutral-800 py-2 rounded cursor-pointer select-none hover:bg-neutral-850 transition-colors pr-2"
        onClick={() => {
          form.setValue(name, !form.getValues(name));
        }}
      >
        <input
          {...form.register(name)}
          autoComplete="off"
          id={name}
          className={clsx("box-border mt-0.5 w-5 h-5 cursor-pointer mx-4")}
          type="checkbox"
        />
        <div>
          <label htmlFor={name} className={labelClasses}>
            {label || name.toUpperCase()}
          </label>
          {tip && <p className={tipClasses}>{tip}</p>}
        </div>
      </div>
      <p className={errorClasses}>
        {form.formState.errors[name]?.message as string}
      </p>
    </div>
  );
};

// gets an image from the user and stores the base64 in the `name` field
const Image: React.FC<
  SimpleInputProps & { defaultName?: string; aspectRatio: string }
> = ({ name, label, tip, aspectRatio, defaultName }) => {
  const form = useFormContext();

  return (
    <div className="mt-1">
      <label htmlFor={name} className={labelClasses}>
        {label || name.toUpperCase()}
      </label>
      <ImageUpload
        aspectRatio={aspectRatio}
        onChange={async (file) => {
          const base64 = await fileToBase64(file);
          form.setValue(name, base64);
        }}
        className="w-full mt-2"
        name={name}
        defaultValue={form.getValues(defaultName || "") || null}
      />

      {tip && <p className={tipClasses}>{tip}</p>}

      <p className={errorClasses}>
        {form.formState.errors[name]?.message as string}
      </p>
    </div>
  );
};

export const InputField = {
  Text,
  Generic,
  Checkbox,
  Date: DateInput,
  Image,
};
