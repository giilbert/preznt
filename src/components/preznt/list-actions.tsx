import type { Action } from "@/schemas/preznt";
import { PropsWithChildren } from "react";

export const ListActions: React.FC<{ actions: Action[] }> = ({ actions }) => (
  <>
    {actions.map(({ attribute, action, value, defaultValue }, i) => (
      <p className="mt-2" key={i}>
        <DarkBg>{action}</DarkBg> <DarkBg>{attribute}</DarkBg> by{" "}
        <DarkBg>{value}</DarkBg>, defaulting to <DarkBg>{defaultValue}</DarkBg>
      </p>
    ))}
  </>
);

const DarkBg: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <span className="px-2 py-1 bg-gray-800 rounded">{children}</span>
);
