import type { MultipleChoiceOption, Question } from "@/types/questions";
import { ensureSchema, getTursoClient } from "@/lib/turso";

export type QuestionInput = {
  id: string;
  type: "text" | "multiple";
  prompt: string;
  options?: MultipleChoiceOption[];
};

export async function listQuestions(): Promise<Question[]> {
  await ensureSchema();
  const db = getTursoClient();

  const questionResult = await db.execute(
    "SELECT id, type, prompt FROM questions ORDER BY created_at ASC"
  );
  const optionResult = await db.execute(
    "SELECT id, question_id, label, value, is_other, position FROM question_options ORDER BY position ASC"
  );

  const optionsByQuestion = new Map<string, MultipleChoiceOption[]>();

  for (const row of optionResult.rows as Array<Record<string, unknown>>) {
    const questionId = String(row.question_id);
    const options = optionsByQuestion.get(questionId) ?? [];

    options.push({
      id: String(row.id),
      label: String(row.label),
      value: String(row.value),
      isOther: Boolean(row.is_other),
    });

    optionsByQuestion.set(questionId, options);
  }

  return (questionResult.rows as Array<Record<string, unknown>>).map(
    (row) => {
      const id = String(row.id);
      const type = String(row.type) as "text" | "multiple";
      const prompt = String(row.prompt);

      if (type === "multiple") {
        return {
          id,
          type,
          prompt,
          options: optionsByQuestion.get(id) ?? [],
          otherPlaceholder: "Precisez votre reponse...",
        };
      }

      return {
        id,
        type,
        prompt,
        placeholder: "Votre reponse ici...",
        rows: 3,
      };
    }
  );
}

export async function createQuestion(input: QuestionInput): Promise<void> {
  await ensureSchema();
  const db = getTursoClient();

  await db.execute({
    sql: "INSERT INTO questions (id, type, prompt) VALUES (?, ?, ?)",
    args: [input.id, input.type, input.prompt],
  });

  if (input.type === "multiple" && input.options) {
    await insertOptions(input.id, input.options);
  }
}

export async function updateQuestion(input: QuestionInput): Promise<void> {
  await ensureSchema();
  const db = getTursoClient();

  await db.execute({
    sql: "UPDATE questions SET type = ?, prompt = ? WHERE id = ?",
    args: [input.type, input.prompt, input.id],
  });

  await db.execute({
    sql: "DELETE FROM question_options WHERE question_id = ?",
    args: [input.id],
  });

  if (input.type === "multiple" && input.options) {
    await insertOptions(input.id, input.options);
  }
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await ensureSchema();
  const db = getTursoClient();

  await db.execute({
    sql: "DELETE FROM questions WHERE id = ?",
    args: [questionId],
  });
}

async function insertOptions(
  questionId: string,
  options: MultipleChoiceOption[]
): Promise<void> {
  const db = getTursoClient();

  for (const [index, option] of options.entries()) {
    await db.execute({
      sql: "INSERT INTO question_options (id, question_id, label, value, is_other, position) VALUES (?, ?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        questionId,
        option.label,
        option.value,
        option.isOther ? 1 : 0,
        index,
      ],
    });
  }
}
