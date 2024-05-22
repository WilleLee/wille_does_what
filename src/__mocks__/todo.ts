import { ISubject, ITodo } from "@models/todo";

export const sampleTodos: ITodo[] = [
  { id: 1, title: "todo1", done: false, subjectId: 1 },
  { id: 2, title: "todo2", done: false, subjectId: 1 },
  { id: 3, title: "todo3", done: false, subjectId: 2 },
  { id: 4, title: "todo4", done: false, subjectId: 2 },
  { id: 5, title: "todo5", done: false, subjectId: 3 },
  { id: 6, title: "todo6", done: false, subjectId: 3 },
];

export const sampleSubjects: ISubject[] = [
  { id: 1, title: "subject1" },
  { id: 2, title: "subject2" },
  { id: 3, title: "subject3" },
];
