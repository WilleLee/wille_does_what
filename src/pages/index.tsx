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
import Input from "@components/Input";
import CheckSvg from "@components/svgs/CheckSvg";
import DashSvg from "@components/svgs/DashSvg";
import IconButton from "@components/IconButton";
import UpSvg from "@components/svgs/UpSvg";
import DownSvg from "@components/svgs/DownSvg";
import XSvg from "@components/svgs/XSvg";

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
        subjectIdToRemove,
        progress,
        progressText,
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
        onOpenRemoveSubject,
        onCloseRemoveSubject,
      }) => (
        <>
          <TodoHeader
            progress={progress}
            progressText={progressText}
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
                onOpenRemoveSubject={onOpenRemoveSubject}
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
          {subjectIdToRemove && (
            <Modal
              onClose={onCloseRemoveSubject}
              onConfirm={() => onRemoveSubjectAndTodos(subjectIdToRemove)}
            >
              해당 그룹과 할 일 목록을 모두 삭제하시겠습니까?
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
  subjectIdToRemove: ISubject["id"] | null;
  progress: number;
  progressText: string;
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
  onOpenReset: () => void;
  onCloseReset: () => void;
  onConfirmReset: () => void;
  onOpenRemoveSubject: (id: ISubject["id"]) => void;
  onCloseRemoveSubject: () => void;
  onRemoveSubjectAndTodos: (subjectId: ISubject["id"]) => void;
}

interface TodoControllerProps {
  children: (args: TodoControllerChildrenProps) => ReactNode;
}

const initialTodos: ITodo[] = locals.get("wille_todos") || [];
const initialSubjects: ISubject[] = locals.get("wille_subjects") || [];

function TodoController({ children }: TodoControllerProps) {
  // const [showRemoveSubjectModal, setShowRemoveSubjectModal] = useState(false);
  const [subjectIdToRemove, setSubjectIdToRemove] = useState<
    ISubject["id"] | null
  >(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [filter, setFilter] = useState<ITodoFilter>("ALL");
  const [todos, setTodos] = useState<ITodo[]>(initialTodos);
  const [subjects, setSubjects] = useState<ISubject[]>(initialSubjects);

  const [progress, progressText] = useMemo(() => {
    const doneCount = todos.reduce((acc, cur) => {
      if (cur.done) return acc + 1;
      else return acc;
    }, 0);
    const progress = Math.round((doneCount / todos.length) * 100);
    let progressText: string;

    if (todos.length === 0) return [0, "😐"];

    if (progress === 100) {
      progressText = "😇";
    } else if (progress >= 80) {
      progressText = "😎";
    } else if (progress >= 60) {
      progressText = "😊";
    } else if (progress >= 40) {
      progressText = "😐";
    } else if (progress >= 20) {
      progressText = "😕";
    } else {
      progressText = "😭";
    }
    return [progress, progressText];
  }, [todos]);

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
      const value = e.target.value.replace(/^\s+/i, "").replace(/\s+/gi, " ");
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
      const value = e.target.value.replace(/^\s+/i, "").replace(/\s+/gi, " ");
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, title: value } : s)),
      );
    },
    [],
  );

  const handleOpenRemoveSubject = useCallback((id: ISubject["id"]) => {
    setSubjectIdToRemove(id);
  }, []);
  const handleCloseRemoveSubject = useCallback(() => {
    setSubjectIdToRemove(null);
  }, []);
  const handleRemoveSubjectAndTodos = useCallback(
    (subjectId: ISubject["id"]) => {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setTodos((prev) => prev.filter((t) => t.subjectId !== subjectId));
      setSubjectIdToRemove(null);
    },
    [],
  );

  const childrenProps: TodoControllerChildrenProps = useMemo(
    () => ({
      todos: filteredTodos,
      subjects,
      showResetModal,
      subjectIdToRemove,
      progress,
      progressText,
      onAddTodo: handleAddTodo,
      onRemoveTodo: handleRemoveTodo,
      onAddSubject: handleAddSubject,
      onSelectFilter: handleSelectFilter,
      onChangeTodoTitle: handleChangeTodoTitle,
      onChangeSubjectTitle: handleChangeSubjectTitle,
      onToggleTodoDone: handleToggleTodoDone,
      onChangeTodoSubject: handleChangeTodoSubject,
      onOpenReset: handleOpenReset,
      onCloseReset: handleCloseReset,
      onConfirmReset: handleConfirmReset,
      onOpenRemoveSubject: handleOpenRemoveSubject,
      onCloseRemoveSubject: handleCloseRemoveSubject,
      onRemoveSubjectAndTodos: handleRemoveSubjectAndTodos,
    }),
    [
      filteredTodos,
      subjects,
      showResetModal,
      subjectIdToRemove,
      progress,
      progressText,
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
      handleOpenRemoveSubject,
      handleCloseRemoveSubject,
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
  progress: number;
  progressText: string;
  onAddSubject: () => void;
  onSelectFilter: (key: ITodoFilter) => void;
  onOpenReset: () => void;
}

const TodoHeader = memo(function TodoHeader({
  isEmpty,
  progress,
  progressText,
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
          position: relative;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 800;
          color: ${colors.grey600};
        `}
      >
        Wille does WHAT?
        <span
          css={css`
            position: absolute;
            right: 5%;
            top: 50%;
            transform: translateY(-50%);
            cursor: default;
          `}
          title={`진척률 : ${progress}%`}
          data-testid="progress_indicator"
        >
          ( {progressText} )
        </span>
      </h1>
      <div
        css={css`
          display: grid;
          grid-template-columns: 84px 1fr 70px;
          column-gap: 8px;
        `}
      >
        <Button data-testid="button_add_group" onClick={onAddSubject}>
          그룹 추가
        </Button>
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
        <Button disabled={isEmpty} buttonType="danger" onClick={onOpenReset}>
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
  onOpenRemoveSubject: (id: ISubject["id"]) => void;
}

const SubjectHeader = memo(function SubjectHeader({
  subject,
  onAddTodo,
  onChangeSubjectTitle,
  onOpenRemoveSubject,
}: SubjectHeaderProps) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr 74px 74px;
        column-gap: 8px;
      `}
    >
      <Input
        data-testid="input_subject_title"
        value={subject.title}
        onChange={(e) => onChangeSubjectTitle(e, subject.id)}
      />
      <Button
        data-testid="button_add_todo"
        onClick={() => onAddTodo(subject.id)}
      >
        할 일 추가
      </Button>
      <Button
        onClick={() => {
          onOpenRemoveSubject(subject.id);
        }}
      >
        그룹 제거
      </Button>
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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
      `}
    >
      <Input
        data-testid="input_todo_title"
        value={todo.title}
        onChange={(e) => onChangeTodoTitle(e, todo.id)}
        disabled={todo.done}
      />
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(4, 26px);
          grid-template-rows: 26px;
          column-gap: 4px;
        `}
      >
        <IconButton
          title={todo.done ? "완료 취소" : "완료 처리"}
          data-testid={todo.done ? `button_todo_undone` : `button_todo_done`}
          buttonType={todo.done ? "danger" : "complete"}
          onClick={() => onToggleTodoDone(todo.id)}
        >
          {todo.done ? <DashSvg /> : <CheckSvg />}
        </IconButton>
        {todo.subjectId !== subjects[0].id && (
          <IconButton
            title="위 그룹으로 이동"
            data-testid="button_move_todo_up"
            onClick={() =>
              onChangeTodoSubject("UP", todo.id, todo.subjectId, subjects)
            }
          >
            <UpSvg />
          </IconButton>
        )}
        {todo.subjectId !== subjects[subjects.length - 1].id && (
          <IconButton
            title="아래 그룹으로 이동"
            data-testid="button_move_todo_down"
            onClick={() =>
              onChangeTodoSubject("DOWN", todo.id, todo.subjectId, subjects)
            }
          >
            <DownSvg />
          </IconButton>
        )}
        <IconButton
          title="할 일 삭제"
          data-testid="button_remove_todo"
          onClick={() => onRemoveTodo(todo.id)}
        >
          <XSvg />
        </IconButton>
      </div>
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
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      `}
      data-testid="subject_container"
    >
      {children}
    </div>
  );
});
