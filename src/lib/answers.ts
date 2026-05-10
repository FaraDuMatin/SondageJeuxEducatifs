import type { MultipleChoiceOption, Question } from "@/types/questions";
import { ensureSchema, getTursoClient } from "@/lib/turso";
import { listQuestions } from "@/lib/questions";

export type MultipleChoiceResult = {
  option: MultipleChoiceOption;
  count: number;
};

export type QuestionResult = {
  question: Question;
  total: number;
  options: MultipleChoiceResult[];
  textResponses: string[];
  otherResponses: string[];
};

export async function saveSurveyAnswers(formData: FormData): Promise<void> {
  await ensureSchema();
  const db = getTursoClient();
  const questions = await listQuestions();

  for (const question of questions) {
    if (question.type === "text") {
      const value = formData.get(question.id);
      if (typeof value === "string" && value.trim()) {
        await db.execute({
          sql: "INSERT INTO answers (id, question_id, answer_text) VALUES (?, ?, ?)",
          args: [crypto.randomUUID(), question.id, value.trim()],
        });
      }
      continue;
    }

    const selected = formData.get(question.id);
    if (typeof selected !== "string" || !selected.trim()) {
      continue;
    }

    const otherValue = formData.get(`${question.id}-other`);
    const otherText =
      selected === "other" && typeof otherValue === "string"
        ? otherValue.trim()
        : null;

    await db.execute({
      sql: "INSERT INTO answers (id, question_id, answer_option, answer_text) VALUES (?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        question.id,
        selected,
        otherText && otherText.length ? otherText : null,
      ],
    });
  }
}

export async function getSurveyResults(): Promise<QuestionResult[]> {
  await ensureSchema();
  const db = getTursoClient();
  const questions = await listQuestions();

  const totalsResult = await db.execute(
    "SELECT question_id, COUNT(*) as count FROM answers GROUP BY question_id"
  );
  const optionCountsResult = await db.execute(
    "SELECT question_id, answer_option, COUNT(*) as count FROM answers WHERE answer_option IS NOT NULL GROUP BY question_id, answer_option"
  );
  const textResult = await db.execute(
    "SELECT question_id, answer_text, answer_option FROM answers WHERE answer_text IS NOT NULL ORDER BY created_at DESC"
  );

  const totalsMap = new Map<string, number>();
  for (const row of totalsResult.rows as Array<Record<string, unknown>>) {
    totalsMap.set(String(row.question_id), Number(row.count));
  }

  const optionMap = new Map<string, Map<string, number>>();
  for (const row of optionCountsResult.rows as Array<Record<string, unknown>>) {
    const questionId = String(row.question_id);
    const optionValue = String(row.answer_option);
    const count = Number(row.count);

    const map = optionMap.get(questionId) ?? new Map<string, number>();
    map.set(optionValue, count);
    optionMap.set(questionId, map);
  }

  const textMap = new Map<string, string[]>();
  const otherMap = new Map<string, string[]>();

  for (const row of textResult.rows as Array<Record<string, unknown>>) {
    const questionId = String(row.question_id);
    const answerText = String(row.answer_text);
    const optionValue = row.answer_option ? String(row.answer_option) : null;

    if (optionValue === "other") {
      const list = otherMap.get(questionId) ?? [];
      if (list.length < 5) {
        list.push(answerText);
        otherMap.set(questionId, list);
      }
      continue;
    }

    const list = textMap.get(questionId) ?? [];
    if (list.length < 5) {
      list.push(answerText);
      textMap.set(questionId, list);
    }
  }

  return questions.map((question) => {
    const total = totalsMap.get(question.id) ?? 0;
    const options: MultipleChoiceResult[] = [];

    if (question.type === "multiple") {
      const counts = optionMap.get(question.id) ?? new Map<string, number>();
      for (const option of question.options) {
        options.push({
          option,
          count: counts.get(option.value) ?? 0,
        });
      }
    }

    return {
      question,
      total,
      options,
      textResponses: textMap.get(question.id) ?? [],
      otherResponses: otherMap.get(question.id) ?? [],
    };
  });
}
