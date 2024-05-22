import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import StartPage from "@pages/index";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";

type Path = `/${string}`;

function wrapper(props: { children: ReactNode }, entry?: Path) {
  return (
    <MemoryRouter initialEntries={[entry || "/"]}>
      {props.children}
    </MemoryRouter>
  );
}

function init() {
  render(<StartPage />, {
    wrapper: (props) => wrapper(props, "/"),
  });
}

describe("StartPage", () => {
  test("should do initial render", () => {
    init();
    expect(screen.getAllByText(/wille does what\?/gi)[0]).toBeDefined();
  });
});
