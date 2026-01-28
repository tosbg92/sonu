
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: number;
  isPlaceholder?: boolean;
}

export interface Block {
  id: string;
  title: string;
  sets: QuizSet[];
}

export interface Module {
  id: string;
  name: string;
  blocks: Block[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  modules: Module[];
}

export enum AppView {
  SPLASH = 'splash',
  SUBJECT_SELECT = 'subject_select',
  MODULE_SELECT = 'module_select',
  SET_SELECT = 'set_select',
  SUB_SET_SELECT = 'sub_set_select',
  QUIZ = 'quiz',
  RESULT = 'result',
  ADMIN = 'admin'
}
