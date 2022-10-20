import { Button, Heading } from "@/components/ui";
import { fieldsToZod } from "@/lib/fields-to-zod";
import { OrganizationContext, useOrganization } from "@/lib/use-organization";
import { useZodForm } from "@/lib/use-zod-form";
import { trpc } from "@/utils/trpc";
import { SignUpField } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";

const inputClasses =
  "bg-neutral-800 px-3 py-2 text-gray-100 rounded mt-2 ring-accent-primary focus:ring-2 w-full";

const Form: React.FC<{ fields: SignUpField[] }> = ({ fields }) => {
  const organization = useOrganization();
  const form = useZodForm({
    schema: fieldsToZod(fields),
  });
  const completeSignUp =
    trpc.organization.signUpForm.completeSignUp.useMutation();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          completeSignUp.mutate({
            organizationId: organization.id,
            data: values,
          });
        })}
      >
        <div className="flex gap-2 flex-col">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-background-secondary rounded px-4 pt-2 pb-4"
            >
              <div className="flex gap-1 items-center">
                <Heading>{field.name}</Heading>
                <span className="ml-auto bg-neutral-700 rounded px-2 py-0.5">
                  {field.type}
                </span>
              </div>
              <p>{field.description}</p>

              {field.type === "TEXT" ||
              field.type === "EMAIL" ||
              field.type === "NUMBER" ? (
                <input
                  {...form.register(field.attribute, {
                    valueAsNumber: field.type === "NUMBER" ? true : undefined,
                  })}
                  className={inputClasses}
                  type={field.type.toLowerCase()}
                />
              ) : (
                <p>Coming soon!</p>
              )}

              <p className="mt-1">
                Sets <span className="font-mono">{field.attribute}</span>
              </p>

              <p className="text-red-400">
                {form.formState.errors[field.attribute]?.message as string}
              </p>
            </div>
          ))}

          <Button
            className="mt-3"
            type="submit"
            loading={completeSignUp.isLoading}
          >
            Sign Up
          </Button>

          <p className="mt-2 mb-8 text-red-400">
            {completeSignUp.error?.message}
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

const OrganizationJoinPage: NextPage = () => {
  const router = useRouter();
  const organizationQuery =
    trpc.organization.signUpForm.getOrganizationSignUpForm.useQuery(
      { slug: router.query.slug as string },
      { enabled: !!router.query.slug }
    );

  if (organizationQuery.status === "loading") return <p>Loading</p>;
  if (organizationQuery.status === "error")
    return <p>Error: {organizationQuery.error.message}</p>;
  const organization = organizationQuery.data;

  // user has already signed up
  if (organization.users.length !== 0) {
    router.push(`/${router.query.slug as string}`);
  }

  return (
    <OrganizationContext.Provider
      value={{
        status: "NONE",
        ...organization,
      }}
    >
      <div className="flex justify-center pt-4">
        <main className="w-[48rem] flex gap-4 flex-col">
          <div className="bg-background-secondary rounded-b">
            <div
              className="w-full rounded-t"
              style={{
                backgroundImage: `url("${organization.headerUrl}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                aspectRatio: "5/1",
              }}
            />

            <h1 className="m-4 font-bold text-4xl">{organization.name}</h1>
          </div>

          {organization.signUpFields.length === 0 && (
            <p className="text-gray-300">
              This organization does not have a sign up form questions, just
              press submit to join the organization!
            </p>
          )}

          <hr />

          <Form fields={organization.signUpFields} />
        </main>
      </div>
    </OrganizationContext.Provider>
  );
};

export default OrganizationJoinPage;
