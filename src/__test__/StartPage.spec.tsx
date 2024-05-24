import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StartPage from "@pages/index";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./libs/renderUI";

function init() {
  const { unmount } = render(<StartPage />, {
    wrapper: (props) => wrapper(props, "/"),
  });
  return { unmount };
}

/*
1. 초기 렌더 o
2. 그룹 추가 버튼 클릭 o
3. 그룹 제거 버튼 클릭 o -> 수정 버전 (모달) o
4. 할 일 추가 버튼 클릭 o
5. 할 일 제거 버튼 클릭 o
6. 완료 / 완료 취소 버튼 클릭 o
7. 헤더 필터링 옵션 변경 o
8. 할 일 값 변경 o
9. 그룹 값 변경 o
10. 할 일의 그룹 위아래 변경 o
11. 초기화 버튼 클릭 o
*/

describe("StartPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("should do initial render", () => {
    const { unmount } = init();
    expect(screen.getAllByText("Wille does WHAT?")[0]).toBeDefined();
    expect(
      screen.getAllByRole("button", {
        name: "그룹 추가",
      })[0],
    );
    expect(screen.getAllByTestId("todo_filter_option")[0]).toBeDefined();
    expect(
      screen.getAllByRole("button", {
        name: "초기화",
      })[0],
    ).toBeDefined();
    unmount();
  });

  test("should add a new group when clicking the button", async () => {
    const { unmount } = init();
    const button = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    expect(button).toBeDefined();
    await userEvent.click(button);
    await waitFor(async () => {
      const group = screen.getAllByTestId(
        "input_subject_title",
      )[0] as HTMLInputElement;
      expect(group).toBeDefined();
      expect(group.value).toEqual("새로운 그룹");
    });
    unmount();
  });

  test("should remove a group when clicking the button", async () => {
    const { unmount } = init();

    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const group = screen.getAllByTestId("input_subject_title")[0];
      const todo = screen.getAllByTestId("input_todo_title")[0];
      expect(group).toBeDefined();
      expect(todo).toBeDefined();

      const removeGroups = screen.getAllByRole("button", {
        name: "그룹 제거",
      })[0];
      await userEvent.click(removeGroups);
    });
    await waitFor(async () => {
      const modalText = screen.getAllByText(
        "해당 그룹과 할 일 목록을 모두 삭제하시겠습니까?",
      );
      expect(modalText).toBeDefined();
      const confirmButton = screen.getAllByTestId("modal_confirm")[0];
      await userEvent.click(confirmButton);
    });
    await waitFor(async () => {
      const groups = screen.queryAllByTestId("input_subject_title");
      const todos = screen.queryAllByTestId("input_todo_title");
      expect(groups).toHaveLength(0);
      expect(todos).toHaveLength(0);
    });

    // await waitFor(async () => {
    //   const group = screen.queryAllByTestId("input_subject_title")[0];
    //   expect(group).not.toBeDefined();
    // });

    unmount();
  });

  test("should add a new todo when clicking the button", async () => {
    const { unmount } = init();
    const addSubject = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addSubject);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const todo = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      expect(todo).toBeDefined();
      expect(todo.value).toEqual("새로운 계획");
    });
    unmount();
  });

  test("should remove a todo when clicking the button", async () => {
    const { unmount } = init();
    const addSubject = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addSubject);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const todo = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      expect(todo).toBeDefined();
      const removeTodo = screen.getAllByRole("button", {
        name: "제거",
      })[0];
      await userEvent.click(removeTodo);
    });

    await waitFor(async () => {
      // getBy... methods throw an error if the element is not found
      // queryBy... methods return null (empty array by queryAll...) if the element is not found
      const todo = screen.queryAllByLabelText("input_todo_title")[0];
      expect(todo).not.toBeDefined();
    });
    unmount();
  });

  test("should toggle disabled attribute when clicking the button", async () => {
    const { unmount } = init();
    const addSubject = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addSubject);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const todo = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      expect(todo).toBeDefined();
      const done = screen.getAllByRole("button", {
        name: "완료",
      })[0];
      expect(done).toBeDefined();
      await userEvent.click(done);
    });
    await waitFor(async () => {
      const todo = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      expect(todo.disabled).toEqual(true);
      const undone = screen.getAllByRole("button", {
        name: "완료 취소",
      })[0];
      expect(undone).toBeDefined();
      await userEvent.click(undone);
    });
    await waitFor(async () => {
      const todo = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      expect(todo.disabled).toEqual(false);
    });
    unmount();
  });

  test("should change todo filters when changing the option", async () => {
    const { unmount } = init();
    const select = screen.getAllByTestId(
      "todo_filter_select",
    )[0] as HTMLSelectElement;
    const options = screen.getAllByTestId("todo_filter_option");
    const [all, done, undone] = options as HTMLOptionElement[];
    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const doneButtons = screen.getAllByRole("button", {
        name: "완료",
      });
      expect(doneButtons).toHaveLength(2);
      await userEvent.click(doneButtons[0]);
    });
    await waitFor(async () => {
      const doneButtons = screen.getAllByRole("button", {
        name: "완료",
      });
      expect(doneButtons).toHaveLength(1);
      const undoneButtons = screen.getAllByRole("button", {
        name: "완료 취소",
      });
      expect(undoneButtons).toHaveLength(1);
      await userEvent.selectOptions(select, done.value);
    });
    await waitFor(async () => {
      const todos = screen.getAllByTestId("input_todo_title");
      expect(todos).toHaveLength(1);
      await userEvent.selectOptions(select, all.value);
    });
    await waitFor(async () => {
      const todos = screen.getAllByTestId("input_todo_title");
      expect(todos).toHaveLength(2);
      await userEvent.selectOptions(select, undone.value);
    });
    await waitFor(async () => {
      const todos = screen.getAllByTestId("input_todo_title");
      expect(todos).toHaveLength(1);
    });
    unmount();
  });

  test("should change group value when changing the input", async () => {
    const { unmount } = init();
    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const groupTitle = screen.getAllByTestId(
        "input_subject_title",
      )[0] as HTMLInputElement;
      await userEvent.clear(groupTitle);
      await userEvent.type(groupTitle, "typed group title");
      await waitFor(async () => {
        expect(groupTitle.value).toEqual("typed group title");
      });
    });
    unmount();
  });

  test("should change todo value when changing the input", async () => {
    const { unmount } = init();
    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const todoTitle = screen.getAllByTestId(
        "input_todo_title",
      )[0] as HTMLInputElement;
      await userEvent.clear(todoTitle);
      await userEvent.type(todoTitle, "typed todo title");
      await waitFor(async () => {
        expect(todoTitle.value).toEqual("typed todo title");
      });
    });
    unmount();
  });

  test("should change todo's group when clicking up / down buttons", async () => {
    const { unmount } = init();
    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const group1 = screen.getAllByTestId("subject_container")[0];
      const todo = screen.getAllByTestId("input_todo_title")[0];
      expect(group1).toContain(todo);
      const downButton = screen.getAllByRole("button", {
        name: "아래로",
      })[0];
      await userEvent.click(downButton);
    });
    await waitFor(async () => {
      const [group1, group2] = screen.getAllByTestId("subject_container");
      const todo = screen.getAllByTestId("input_todo_title")[0];
      expect(group1).not.toContain(todo);
      expect(group2).toContain(todo);
      const upButton = screen.getAllByRole("button", {
        name: "위로",
      })[0];
      await userEvent.click(upButton);
    });
    await waitFor(async () => {
      const [group1, group2] = screen.getAllByTestId("subject_container");
      const todo = screen.getAllByTestId("input_todo_title")[0];
      expect(group1).toContain(todo);
      expect(group2).not.toContain(todo);
    });
    unmount();
  });

  test("should reset all values when clicking the button", async () => {
    const { unmount } = init();
    const resetButton = screen.getAllByRole("button", {
      name: "초기화",
    })[0] as HTMLButtonElement;
    expect(resetButton.disabled).toEqual(true);

    const addGroup = screen.getAllByRole("button", {
      name: "그룹 추가",
    })[0];
    await userEvent.click(addGroup);
    await userEvent.click(addGroup);
    await waitFor(async () => {
      const subjectTitles = screen.getAllByTestId("input_subject_title");
      expect(subjectTitles).toHaveLength(2);
      const addTodo = screen.getAllByRole("button", {
        name: "할 일 추가",
      })[0];
      await userEvent.click(addTodo);
      await userEvent.click(addTodo);
      await userEvent.click(addTodo);
    });
    await waitFor(async () => {
      const todoTitles = screen.getAllByTestId("input_todo_title");
      expect(todoTitles).toHaveLength(3);
      expect(resetButton.disabled).toEqual(false);
      await userEvent.click(resetButton);
    });
    await waitFor(async () => {
      const modalText =
        screen.getAllByText("할 일 목록을 초기화하시겠습니까?")[0];
      expect(modalText).toBeDefined();
      const confirmButton = screen.getAllByTestId("modal_confirm")[0];
      userEvent.click(confirmButton);
    });
    await waitFor(async () => {
      const subjectTitles = screen.queryAllByTestId("input_subject_title");
      expect(subjectTitles).toHaveLength(0);
      const todoTitles = screen.queryAllByTestId("input_todo_title");
      expect(todoTitles).toHaveLength(0);
    });

    unmount();
  });
});
