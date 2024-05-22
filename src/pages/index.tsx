import {
  ChangeEvent,
  Fragment,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ISubject, ITodo } from "@models/todo";
import cookies from "@/libs/cookies";

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
        onAddSubject,
        onAddTodo,
        onRemoveTodo,
        onSelectFilter,
        onChangeTodoTitle,
        onChangeSubjectTitle,
        onToggleTodoDone,
        onChangeTodoSubject,
        onRemoveSubjectAndTodos,
        onReset,
      }) => (
        <>
          <TodoHeader
            onAddSubject={onAddSubject}
            onSelectFilter={onSelectFilter}
            onReset={onReset}
          />
          {subjects.map((subject) => (
            <Fragment key={subject.id}>
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
            </Fragment>
          ))}
        </>
      )}
    </TodoController>
  );
}

interface TodoControllerChildrenProps {
  todos: ITodo[];
  subjects: ISubject[];
  onAddSubject: () => void;
  onAddTodo: (subjectId: ISubject["id"]) => void;
  onRemoveTodo: (todoId: ITodo["id"]) => void;
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
    subjects: ISubject[],
  ) => void;
  onRemoveSubjectAndTodos: (subjectId: ISubject["id"]) => void;
  onReset: () => void;
}

interface TodoControllerProps {
  children: (args: TodoControllerChildrenProps) => ReactNode;
}

const initialTodos: ITodo[] = cookies.get("todos") || [];
const initialSubjects: ISubject[] = cookies.get("subjects") || [];

function TodoController({ children }: TodoControllerProps) {
  const [filter, setFilter] = useState<ITodoFilter>("ALL");
  const [todos, setTodos] = useState<ITodo[]>(initialTodos);
  const [subjects, setSubjects] = useState<ISubject[]>(initialSubjects);

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

  const handleReset = useCallback(() => {
    setTodos([]);
    setSubjects([]);
  }, []);

  const handleChangeTodoSubject = useCallback(
    (key: "UP" | "DOWN", todoId: ITodo["id"], subjects: ISubject[]) => {
      const subjectId = todos.find((todo) => todo.id === todoId)?.subjectId;
      const index = subjects.findIndex((subject) => subject.id === subjectId);
      if (!subjectId) return;
      switch (key) {
        case "UP": {
          if (index === 0) break;
          const prevSubjectId = subjects[index - 1].id;
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === todoId ? { ...todo, subjectId: prevSubjectId } : todo,
            ),
          );
          break;
        }
        case "DOWN": {
          if (index === subjects.length - 1) break;
          const nextSubjectId = subjects[index + 1].id;
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === todoId ? { ...todo, subjectId: nextSubjectId } : todo,
            ),
          );
          break;
        }
        default:
          break;
      }
    },
    [todos],
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
      onAddSubject: handleAddSubject,
      onAddTodo: handleAddTodo,
      onRemoveTodo: handleRemoveTodo,
      onSelectFilter: handleSelectFilter,
      onChangeTodoTitle: handleChangeTodoTitle,
      onChangeSubjectTitle: handleChangeSubjectTitle,
      onToggleTodoDone: handleToggleTodoDone,
      onChangeTodoSubject: handleChangeTodoSubject,
      onRemoveSubjectAndTodos: handleRemoveSubjectAndTodos,
      onReset: handleReset,
    }),
    [
      filteredTodos,
      subjects,
      handleAddSubject,
      handleAddTodo,
      handleSelectFilter,
      handleChangeTodoTitle,
      handleChangeSubjectTitle,
      handleToggleTodoDone,
      handleChangeTodoSubject,
      handleRemoveSubjectAndTodos,
      handleReset,
      handleRemoveTodo,
    ],
  );

  useEffect(() => {
    cookies.set("todos", JSON.stringify(todos), 365);
  }, [todos]);

  useEffect(() => {
    cookies.set("subjects", JSON.stringify(subjects), 365);
  }, [subjects]);

  if (!children || typeof children !== "function") return null;

  return children({ ...childrenProps });
}

interface TodoHeaderProps {
  onAddSubject: () => void;
  onSelectFilter: (key: ITodoFilter) => void;
  onReset: () => void;
}

const TodoHeader = memo(function TodoHeader({
  onAddSubject,
  onSelectFilter,
  onReset,
}: TodoHeaderProps) {
  return (
    <div>
      <h1>Wille does WHAT?</h1>
      <button onClick={onAddSubject}>그룹 추가</button>
      <select
        onChange={(e) => {
          const value = e.target.value as ITodoFilter;
          onSelectFilter(value);
        }}
      >
        {todoFilterOptions.map((option) => (
          <option
            key={option.key}
            value={option.key}
            aira-label="todo_filter_option"
          >
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={onReset}>초기화</button>
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
  console.log("rendered" + subject.title);
  return (
    <div>
      <input
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
  console.log("rendered" + todo.title);
  return (
    <div>
      <input
        value={todo.title}
        onChange={(e) => onChangeTodoTitle(e, todo.id)}
        disabled={todo.done}
      />
      <button onClick={() => onToggleTodoDone(todo.id)}>
        {todo.done ? "undone" : "done"}
      </button>
      {todo.subjectId !== subjects[0].id && (
        <button onClick={() => onChangeTodoSubject("UP", todo.id, subjects)}>
          위로
        </button>
      )}
      {todo.subjectId !== subjects[subjects.length - 1].id && (
        <button onClick={() => onChangeTodoSubject("DOWN", todo.id, subjects)}>
          아래로
        </button>
      )}
      <button onClick={() => onRemoveTodo(todo.id)}>제거</button>
    </div>
  );
});
