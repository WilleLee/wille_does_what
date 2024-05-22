export interface ITodo {
  id: number;
  title: string;
  done: boolean;
  subjectId: number;
}

export interface ISubject {
  id: number;
  title: string;
}
