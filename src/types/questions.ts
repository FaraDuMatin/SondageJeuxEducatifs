export type TextQuestion = {
  id: string;
  type: "text";
  prompt: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export type MultipleChoiceOption = {
  id: string;
  label: string;
  value: string;
  isOther?: boolean;
};

export type MultipleChoiceQuestion = {
  id: string;
  type: "multiple";
  prompt: string;
  options: MultipleChoiceOption[];
  otherPlaceholder?: string;
  required?: boolean;
};

export type Question = TextQuestion | MultipleChoiceQuestion;
