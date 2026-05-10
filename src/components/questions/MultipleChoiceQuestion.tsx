"use client";

import { useState } from "react";
import type { MultipleChoiceQuestion } from "@/types/questions";

type MultipleChoiceQuestionProps = {
  question: MultipleChoiceQuestion;
};

export default function MultipleChoiceQuestion({
  question,
}: MultipleChoiceQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <fieldset className="flex flex-col gap-6">
      <legend className="font-headline font-bold text-2xl md:text-3xl leading-tight text-primary">
        {question.prompt}
      </legend>
      <div className="flex flex-col gap-4 font-body text-xl">
        {question.options.map((option) => {
          const isOtherSelected =
            option.isOther && selectedValue === option.value;

          return (
            <div key={option.id} className="flex flex-col gap-3">
              <label className="flex items-center gap-4 cursor-pointer group">
                <span className="relative flex items-center justify-center w-8 h-8">
                  <input
                    className="peer appearance-none w-8 h-8 border-4 border-primary rounded-none bg-background checked:bg-secondary cursor-pointer transition-colors"
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={() => setSelectedValue(option.value)}
                  />
                  <span className="absolute text-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none text-sm font-black">
                    X
                  </span>
                </span>
                <span className="group-hover:text-secondary transition-colors font-medium">
                  {option.label}
                </span>
              </label>
              {isOtherSelected ? (
                <input
                  className="ml-12 w-full bg-background border-4 border-primary p-4 font-body text-lg focus:border-secondary transition-colors"
                  type="text"
                  name={`${question.id}-other`}
                  placeholder={
                    question.otherPlaceholder ?? "Precisez votre reponse..."
                  }
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
