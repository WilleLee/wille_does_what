import { GlobalPortal } from "@/GlobalPortal";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

type Path = `/${string}`;

export function wrapper(props: { children: ReactNode }, entry?: Path) {
  return (
    <GlobalPortal.Provider>
      <MemoryRouter initialEntries={[entry || "/"]}>
        {props.children}
      </MemoryRouter>
    </GlobalPortal.Provider>
  );
}
