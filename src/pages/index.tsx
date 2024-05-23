import {
  ChangeEvent,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ISubject, ITodo } from "@models/todo";
import Button from "@components/Button";
import { css } from "@emotion/react";
import Select from "@components/Select";
import colors from "@constants/colors";
import locals from "@libs/locals";
import Modal from "@components/Modal";

type ITodoFilter = "ALL" | "DONE" | "UNDONE";

const todoFilterOptions: { key: ITodoFilter; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "DONE", label: "완료" },
  { key: "UNDONE", label: "미완료" },
];

export default function StartPage() {
  return (
    <TodoController>
      {({
        todos,
        subjects,
        showResetModal,
        onAddSubject,
        onAddTodo,
        onRemoveTodo,
        onSelectFilter,
        onChangeTodoTitle,
        onChangeSubjectTitle,
        onToggleTodoDone,
        onChangeTodoSubject,
        onRemoveSubjectAndTodos,
        onOpenReset,
        onCloseReset,
        onConfirmReset,
      }) => (
        <>
          <TodoHeader
            isEmpty={subjects.length === 0}
            onAddSubject={onAddSubject}
            onSelectFilter={onSelectFilter}
            onOpenReset={onOpenReset}
          />
          {subjects.map((subject) => (
            <SubjectContainer key={subject.id}>
              <SubjectHeader
                subject={subject}
                onAddTodo={onAddTodo}
                onChangeSubjectTitle={onChangeSubjectTitle}
                onRemoveSubjectAndTodos={onRemoveSubjectAndTodos}
              />
              {todos
                .filter((todo) => todo.subjectId === subject.id)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    subjects={subjects}
                    onChangeTodoTitle={onChangeTodoTitle}
                    onToggleTodoDone={onToggleTodoDone}
                    onChangeTodoSubject={onChangeTodoSubject}
                    onRemoveTodo={onRemoveTodo}
                  />
                ))}
            </SubjectContainer>
          ))}
          {showResetModal && (
            <Modal onClose={onCloseReset} onConfirm={onConfirmReset}>
              할 일 목록을 초기화하시겠습니까?
            </Modal>
          )}
        </>
      )}
    </TodoController>
  );
}

interface TodoControllerChildrenProps {
  todos: ITodo[];
  subjects: ISubject[];
  showResetModal: boolean;
  onAddTodo: (subjectId: ISubject["id"]) => void;
  onRemoveTodo: (todoId: ITodo["id"]) => void;
  onAddSubject: () => void;
  onSelectFilter: (key: ITodoFilter) => void;
  onChangeTodoTitle: (
    e: ChangeEvent<HTMLInputElement>,
    todoId: ITodo["id"],
  ) => void;
  onToggleTodoDone: (todoId: ITodo["id"]) => void;
  onChangeSubjectTitle: (
    e: ChangeEvent<HTMLInputElement>,
    subjectId: ISubject["id"],
  ) => void;
  onChangeTodoSubject: (
    key: "UP" | "DOWN",
    todoId: ITodo["id"],
    currentSubjectId: ISubject["id"],
    subjects: ISubject[],
  ) => void;
  onRemoveSubjectAndTodos: (subjectId: ISubject["id"]) => void;
  onOpenReset: () => void;
  onCloseReset: () => void;
  onConfirmReset: () => void;
}

interface TodoControllerProps {
  children: (args: TodoControllerChildrenProps) => ReactNode;
}

const initialTodos: ITodo[] = locals.get("wille_todos") || [];
const initialSubjects: ISubject[] = locals.get("wille_subjects") || [];

function TodoController({ children }: TodoControllerProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [filter, setFilter] = useState<ITodoFilter>("ALL");
  const [todos, setTodos] = useState<ITodo[]>(initialTodos);
  const [subjects, setSubjects] = useState<ISubject[]>(initialSubjects);

  const handleConfirmReset = useCallback(() => {
    setTodos([]);
    setSubjects([]);
    setShowResetModal(false);
  }, []);
  const handleCloseReset = useCallback(() => {
    setShowResetModal(false);
  }, []);
  const handleOpenReset = useCallback(() => {
    setShowResetModal(true);
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "DONE": {
        return todos.filter((todo) => todo.done);
      }
      case "UNDONE": {
        return todos.filter((todo) => !todo.done);
      }
      default: {
        return todos;
      }
    }
  }, [todos, filter]);

  const handleChangeTodoSubject = useCallback(
    (
      key: "UP" | "DOWN",
      todoId: ITodo["id"],
      currentSubjectId: ISubject["id"],
      subjects: ISubject[],
    ) => {
      const subjectIndex = subjects.findIndex((s) => s.id === currentSubjectId);
      switch (key) {
        case "UP": {
          if (subjectIndex === 0) break;
          const targetSubjectId = subjects[subjectIndex - 1].id;
          setTodos((prev) =>
            prev.map((t) => {
              if (t.id === todoId) return { ...t, subjectId: targetSubjectId };
              return t;
            }),
          );
          break;
        }
        case "DOWN": {
          if (subjectIndex === subjects.length - 1) break;
          const targetSubjectId = subjects[subjectIndex + 1].id;
          setTodos((prev) =>
            prev.map((t) => {
              if (t.id === todoId) return { ...t, subjectId: targetSubjectId };
              return t;
            }),
          );
          break;
        }
        default:
          break;
      }
    },
    [],
  );

  const handleSelectFilter = useCallback((key: ITodoFilter) => {
    setFilter(key);
  }, []);

  const handleAddTodo = useCallback((subjectId: ISubject["id"]) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), title: "새로운 계획", done: false, subjectId },
    ]);
  }, []);

  const handleRemoveTodo = useCallback((todoId: ITodo["id"]) => {
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
  }, []);

  const handleChangeTodoTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>, todoId: ITodo["id"]) => {
      const value = e.target.value.trimStart();
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, title: value } : t)),
      );
    },
    [],
  );

  const handleToggleTodoDone = useCallback((todoId: ITodo["id"]) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const handleAddSubject = useCallback(() => {
    setSubjects((prev) => [...prev, { id: Date.now(), title: "새로운 그룹" }]);
  }, []);

  const handleChangeSubjectTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>, subjectId: ISubject["id"]) => {
      const value = e.target.value.trimStart();
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, title: value } : s)),
      );
    },
    [],
  );

  const handleRemoveSubjectAndTodos = useCallback(
    (subjectId: ISubject["id"]) => {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setTodos((prev) => prev.filter((t) => t.subjectId !== subjectId));
    },
    [],
  );

  const childrenProps: TodoControllerChildrenProps = useMemo(
    () => ({
      todos: filteredTodos,
      subjects,
      showResetModal,
      onAddTodo: handleAddTodo,
      onRemoveTodo: handleRemoveTodo,
      onAddSubject: handleAddSubject,
      onSelectFilter: handleSelectFilter,
      onChangeTodoTitle: handleChangeTodoTitle,
      onChangeSubjectTitle: handleChangeSubjectTitle,
      onToggleTodoDone: handleToggleTodoDone,
      onChangeTodoSubject: handleChangeTodoSubject,
      onRemoveSubjectAndTodos: handleRemoveSubjectAndTodos,
      onOpenReset: handleOpenReset,
      onCloseReset: handleCloseReset,
      onConfirmReset: handleConfirmReset,
    }),
    [
      filteredTodos,
      subjects,
      showResetModal,
      handleAddSubject,
      handleAddTodo,
      handleSelectFilter,
      handleChangeTodoTitle,
      handleChangeSubjectTitle,
      handleToggleTodoDone,
      handleChangeTodoSubject,
      handleRemoveSubjectAndTodos,
      handleRemoveTodo,
      handleOpenReset,
      handleCloseReset,
      handleConfirmReset,
    ],
  );

  useEffect(() => {
    locals.set("wille_todos", todos);
  }, [todos]);

  useEffect(() => {
    locals.set("wille_subjects", subjects);
  }, [subjects]);

  if (!children || typeof children !== "function") return null;

  return children({ ...childrenProps });
}

interface TodoHeaderProps {
  isEmpty: boolean;
  onAddSubject: () => void;
  onSelectFilter: (key: ITodoFilter) => void;
  onOpenReset: () => void;
}

const TodoHeader = memo(function TodoHeader({
  isEmpty,
  onAddSubject,
  onSelectFilter,
  onOpenReset,
}: TodoHeaderProps) {
  return (
    <div
      css={css`
        margin-bottom: 16px;
      `}
    >
      <h1
        css={css`
          margin-bottom: 8px;
          font-size: 24px;
          font-weight: 800;
          color: ${colors.grey600};
        `}
      >
        Wille does WHAT?
      </h1>
      <div
        css={css`
          display: grid;
          grid-template-columns: 84px 1fr 70px;
          column-gap: 4px;
        `}
      >
        <Button onClick={onAddSubject}>그룹 추가</Button>
        <Select
          data-testid="todo_filter_select"
          onChange={(e) => {
            const value = e.target.value as ITodoFilter;
            onSelectFilter(value);
          }}
        >
          {todoFilterOptions.map((option) => (
            <option
              key={option.key}
              value={option.key}
              data-testid="todo_filter_option"
            >
              {option.label}
            </option>
          ))}
        </Select>
        <Button disabled={isEmpty} danger onClick={onOpenReset}>
          초기화
        </Button>
      </div>
    </div>
  );
});

interface SubjectHeaderProps {
  subject: ISubject;
  onAddTodo: (subjectId: ISubject["id"]) => void;
  onChangeSubjectTitle: (
    e: ChangeEvent<HTMLInputElement>,
    subjectId: ISubject["id"],
  ) => void;
  onRemoveSubjectAndTodos: (subjectId: ISubject["id"]) => void;
}

const SubjectHeader = memo(function SubjectHeader({
  subject,
  onAddTodo,
  onChangeSubjectTitle,
  onRemoveSubjectAndTodos,
}: SubjectHeaderProps) {
  return (
    <div>
      <input
        data-testid="input_subject_title"
        value={subject.title}
        onChange={(e) => onChangeSubjectTitle(e, subject.id)}
      />
      <button onClick={() => onAddTodo(subject.id)}>할 일 추가</button>
      <button onClick={() => onRemoveSubjectAndTodos(subject.id)}>
        그룹 제거
      </button>
    </div>
  );
});

interface TodoItemProps {
  todo: ITodo;
  subjects: ISubject[];
  onChangeTodoTitle: (
    e: ChangeEvent<HTMLInputElement>,
    todoId: ITodo["id"],
  ) => void;
  onToggleTodoDone: (todoId: ITodo["id"]) => void;
  onChangeTodoSubject: (
    key: "UP" | "DOWN",
    todoId: ITodo["id"],
    currentSubjectId: ISubject["id"],
    subjects: ISubject[],
  ) => void;
  onRemoveTodo: (todoId: ITodo["id"]) => void;
}

const TodoItem = memo(function TodoItem({
  todo,
  subjects,
  onChangeTodoTitle,
  onToggleTodoDone,
  onChangeTodoSubject,
  onRemoveTodo,
}: TodoItemProps) {
  return (
    <div>
      <input
        data-testid="input_todo_title"
        value={todo.title}
        onChange={(e) => onChangeTodoTitle(e, todo.id)}
        disabled={todo.done}
      />
      <button onClick={() => onToggleTodoDone(todo.id)}>
        {todo.done ? "완료 취소" : "완료"}
      </button>
      {todo.subjectId !== subjects[0].id && (
        <button
          onClick={() =>
            onChangeTodoSubject("UP", todo.id, todo.subjectId, subjects)
          }
        >
          위로
        </button>
      )}
      {todo.subjectId !== subjects[subjects.length - 1].id && (
        <button
          onClick={() =>
            onChangeTodoSubject("DOWN", todo.id, todo.subjectId, subjects)
          }
        >
          아래로
        </button>
      )}
      <button onClick={() => onRemoveTodo(todo.id)}>제거</button>
    </div>
  );
});

const SubjectContainer = memo(function SubjectContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      css={css`
        margin-bottom: 16px;
      `}
      data-testid="subject_container"
    >
      {children}
    </div>
  );
});
